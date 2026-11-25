import { useEffect, useMemo, useState } from 'react';
import { Animated, Platform, Pressable, StyleSheet, Text } from 'react-native';
import type { IAssetResolver } from '../../application/ports';
import type { ModeIconComponent } from '../mode-icons';
import { BORDER_WIDTH, RADIUS, SPACING, TYPOGRAPHY, type Theme } from '../theme';
import { renderModeIcon, withAlpha, type ExtendedHomeModeDTO } from './shared';

const USE_NATIVE_DRIVER = Platform.OS !== 'web';

export interface ModeSelectorTileProps {
  readonly mode: ExtendedHomeModeDTO;
  readonly isSelected: boolean;
  readonly tileHeight: number;
  readonly iconSize: number;
  readonly fontScale: number;
  readonly theme: Theme;
  readonly isDark: boolean;
  readonly reduceMotion: boolean;
  readonly modeIconResolver?: IAssetResolver<ModeIconComponent>;
  readonly modeName: string;
  readonly shortLabel: string;
  readonly onSelectMode: (mode: ExtendedHomeModeDTO) => void;
}

export function ModeSelectorTile({
  mode,
  isSelected,
  tileHeight,
  iconSize,
  fontScale,
  theme,
  isDark,
  reduceMotion,
  modeIconResolver,
  modeName,
  shortLabel,
  onSelectMode,
}: ModeSelectorTileProps) {
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [scaleAnim] = useState(() => new Animated.Value(isSelected ? 1.04 : 1));

  useEffect(() => {
    const targetScale = isSelected ? 1.04 : 1;
    if (reduceMotion) {
      scaleAnim.setValue(targetScale);
      return;
    }
    Animated.spring(scaleAnim, {
      toValue: targetScale,
      stiffness: 220,
      damping: 18,
      mass: 0.85,
      useNativeDriver: USE_NATIVE_DRIVER,
    }).start();
  }, [isSelected, reduceMotion, scaleAnim]);

  const activeBg = isDark ? withAlpha(theme.primary, '1C') : withAlpha(theme.primary, '12');
  const activeBorder = isDark ? theme.primaryHover : theme.primary;

  return (
    <Animated.View style={[styles.tileWrapper, { transform: [{ scale: scaleAnim }] }]}>
      <Pressable
        testID={`mode-tile-${mode.id}`}
        accessibilityRole="button"
        accessibilityLabel={modeName}
        accessibilityState={{ selected: isSelected }}
        onPress={() => onSelectMode(mode)}
        style={({ pressed }) => [
          styles.tile,
          {
            height: tileHeight,
            backgroundColor: isSelected ? activeBg : theme.surface,
            borderColor: isSelected ? activeBorder : theme.borderDefault,
            borderWidth: isSelected ? BORDER_WIDTH.thick : BORDER_WIDTH.thin,
          },
          isSelected ? theme.shadowGlowPrimary : theme.shadowLow,
          pressed && styles.pressed,
        ]}
      >
        {renderModeIcon(
          mode,
          isSelected ? theme.primary : theme.textSecondary,
          iconSize,
          isSelected,
          modeIconResolver,
        )}
        <Text
          testID={`mode-tile-label-${mode.id}`}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.75}
          style={[
            styles.label,
            {
              fontSize: Math.round(12 * fontScale),
              lineHeight: Math.round(16 * fontScale),
              color: isSelected ? theme.textPrimary : theme.textSecondary,
              fontWeight: isSelected ? '700' : '600',
            },
          ]}
        >
          {shortLabel}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    tileWrapper: {
      flex: 1,
      minWidth: SPACING.touchTargetMin,
    },
    tile: {
      width: '100%',
      minWidth: SPACING.touchTargetMin,
      borderRadius: RADIUS.lg,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: SPACING.s1,
      paddingVertical: SPACING.s2,
      gap: 4,
    },
    pressed: {
      opacity: 0.9,
    },
    label: {
      fontSize: TYPOGRAPHY.caption.fontSize,
      textAlign: 'center',
    },
  });
}
