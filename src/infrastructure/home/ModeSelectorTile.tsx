import { useMemo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import type { IAssetResolver } from '../../application/ports';
import type { ModeIconComponent } from '../mode-icons';
import { AnimatedScale, MOTION_SPRINGS } from '../motion';
import { BORDER_WIDTH, RADIUS, SPACING, TYPOGRAPHY, type Theme } from '../theme';
import { renderModeIcon, withAlpha, type ExtendedHomeModeDTO } from './shared';

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
  const activeBg = isDark ? withAlpha(theme.primary, '1C') : withAlpha(theme.primary, '12');
  const activeBorder = isDark ? theme.primaryHover : theme.primary;

  return (
    <AnimatedScale
      scale={isSelected ? 1.04 : 1}
      spring={MOTION_SPRINGS.tileSelection}
      reduceMotion={reduceMotion}
      style={styles.tileWrapper}
    >
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
    </AnimatedScale>
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
