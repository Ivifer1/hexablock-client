import { useEffect, useMemo, useState } from 'react';
import { Animated, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import type { IAssetResolver } from '../../application/ports';
import type { HomeModeDTO } from '../../application/value-objects';
import type { ModeIconComponent } from '../mode-icons';
import { BORDER_WIDTH, RADIUS, SPACING, TYPOGRAPHY, type Theme } from '../theme';
import { modeBaseAngleRad } from '../wheelMath';

export type ExtendedHomeModeDTO = HomeModeDTO & {
  readonly shortName?: string;
};

const USE_NATIVE_DRIVER = Platform.OS !== 'web';

function withAlpha(hex: string, alphaHex: string): string {
  if (/^#[0-9A-Fa-f]{6}$/.test(hex)) return `${hex}${alphaHex}`;
  return hex;
}

function renderModeIcon(
  mode: ExtendedHomeModeDTO,
  color: string,
  size: number,
  isSelected: boolean,
  modeIconResolver: IAssetResolver<ModeIconComponent> | undefined,
) {
  const Icon = modeIconResolver?.resolve(mode.iconKey);
  if (Icon) {
    return <Icon color={color} size={size} isSelected={isSelected} />;
  }

  const initial = (mode.shortName ?? mode.id ?? 'G').slice(0, 1).toUpperCase();
  return (
    <Text style={{ color, fontSize: Math.max(12, size * 0.42), fontWeight: '800' }}>
      {initial}
    </Text>
  );
}

export interface CentralIsoCubeProps {
  readonly color: string;
  readonly size: number;
}

export function CentralIsoCube({ color, size }: CentralIsoCubeProps) {
  const face = size * 0.42;
  return (
    <View style={[slotStyles.isoCubeContainer, { width: size, height: size }]}>
      <View
        style={[
          slotStyles.isoCubeFaceBack,
          {
            width: face,
            height: face,
            backgroundColor: withAlpha(color, '66'),
          },
        ]}
      />
      <View
        style={[
          slotStyles.isoCubeFace,
          {
            width: face,
            height: face,
            backgroundColor: color,
          },
        ]}
      />
    </View>
  );
}

export interface WheelModeSlotProps {
  readonly mode: ExtendedHomeModeDTO;
  readonly index: number;
  readonly totalModes: number;
  readonly isSelected: boolean;
  readonly wheelSize: number;
  readonly modeIconSize: number;
  readonly selectedModeIconSize: number;
  readonly counterRotateDeg: Animated.AnimatedInterpolation<string>;
  readonly theme: Theme;
  readonly isDark: boolean;
  readonly reduceMotion: boolean;
  readonly modeIconResolver?: IAssetResolver<ModeIconComponent>;
  readonly modeName: string;
  readonly shortLabel: string;
  readonly onSelectMode: (mode: ExtendedHomeModeDTO) => void;
}

export function WheelModeSlot({
  mode,
  index,
  totalModes,
  isSelected,
  wheelSize,
  modeIconSize,
  selectedModeIconSize,
  counterRotateDeg,
  theme,
  isDark,
  reduceMotion,
  modeIconResolver,
  modeName,
  shortLabel,
  onSelectMode,
}: WheelModeSlotProps) {
  const styles = useMemo(() => createSlotStyles(theme), [theme]);
  const idleScale = selectedModeIconSize > 0 ? modeIconSize / selectedModeIconSize : 1;
  const [scaleAnim] = useState(() => new Animated.Value(isSelected ? 1 : idleScale));

  useEffect(() => {
    const targetScale = isSelected ? 1 : idleScale;
    if (reduceMotion) {
      scaleAnim.setValue(targetScale);
      return;
    }
    Animated.spring(scaleAnim, {
      toValue: targetScale,
      stiffness: 190,
      damping: 18,
      mass: 0.85,
      useNativeDriver: USE_NATIVE_DRIVER,
    }).start();
  }, [isSelected, idleScale, reduceMotion, scaleAnim]);

  const idleLabelLift = -(selectedModeIconSize - modeIconSize) / 2;
  const labelTranslateY =
    idleScale < 1
      ? scaleAnim.interpolate({
          inputRange: [idleScale, 1],
          outputRange: [idleLabelLift, 0],
        })
      : 0;

  const slotWidth = Math.max(selectedModeIconSize + 18, 78);
  const slotHeight = selectedModeIconSize + 18;
  const baseAngle = modeBaseAngleRad(index, totalModes);
  const radius = wheelSize * 0.41;
  const centerX = wheelSize / 2;
  const centerY = wheelSize / 2;
  const posX = centerX + radius * Math.cos(baseAngle) - slotWidth / 2;
  const posY = centerY + radius * Math.sin(baseAngle) - slotHeight / 2;

  return (
    <View
      style={[
        slotStyles.modeOrbitSlot,
        {
          left: posX,
          top: posY,
          width: slotWidth,
          height: slotHeight,
          zIndex: isSelected ? 4 : 3,
        },
      ]}
    >
      <Animated.View
        style={[
          slotStyles.slotUprightWrapper,
          { transform: [{ rotate: counterRotateDeg }] },
        ]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={modeName}
          accessibilityState={{ selected: isSelected }}
          onPress={() => onSelectMode(mode)}
          hitSlop={6}
          style={({ pressed }) => [
            slotStyles.modePressable,
            pressed && slotStyles.pressedScale,
          ]}
        >
          <View
            style={[
              slotStyles.circleCluster,
              { width: slotWidth, height: selectedModeIconSize },
            ]}
          >
            <Animated.View
              style={[
                styles.modeHexBase,
                {
                  width: selectedModeIconSize,
                  height: selectedModeIconSize,
                  borderRadius: selectedModeIconSize / 2,
                  borderColor: isSelected ? theme.primary : theme.borderDefault,
                  borderWidth: isSelected ? BORDER_WIDTH.chunky : BORDER_WIDTH.thin,
                  shadowColor: isSelected ? theme.primary : theme.shadowLow.shadowColor,
                  shadowOpacity: isSelected ? 0.35 : theme.shadowLow.shadowOpacity,
                  shadowRadius: isSelected ? 14 : theme.shadowLow.shadowRadius,
                  shadowOffset: isSelected
                    ? { width: 0, height: 6 }
                    : theme.shadowLow.shadowOffset,
                  elevation: isSelected ? 8 : 2,
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              {renderModeIcon(
                mode,
                isSelected ? theme.primary : theme.textSecondary,
                selectedModeIconSize * 0.68,
                isSelected,
                modeIconResolver,
              )}
            </Animated.View>
            <Animated.View
              testID={`wheel-mode-label-${mode.id}`}
              pointerEvents="none"
              style={[
                slotStyles.dockedLabelPill,
                isSelected ? slotStyles.selectedLabelPill : slotStyles.idleLabelPill,
                {
                  backgroundColor: isSelected
                    ? theme.primary
                    : isDark
                      ? theme.surfaceSubdued
                      : theme.surface,
                  borderColor: isSelected
                    ? isDark
                      ? theme.primaryHover
                      : theme.surface
                    : isDark
                      ? theme.borderStrong
                      : theme.borderDefault,
                  elevation: isSelected ? 9 : 4,
                  transform: [{ translateY: labelTranslateY }],
                },
              ]}
            >
              <Text
                style={
                  isSelected
                    ? [slotStyles.selectedLabelText, { color: theme.primaryFg }]
                    : [styles.idleLabelText, { color: theme.textPrimary }]
                }
                numberOfLines={1}
              >
                {shortLabel}
              </Text>
            </Animated.View>
          </View>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const slotStyles = StyleSheet.create({
  isoCubeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  isoCubeFace: {
    borderRadius: RADIUS.xs,
    transform: [{ rotate: '45deg' }],
  },
  isoCubeFaceBack: {
    position: 'absolute',
    borderRadius: RADIUS.xs,
    transform: [{ rotate: '45deg' }, { translateX: 4 }, { translateY: -4 }],
  },
  modeOrbitSlot: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotUprightWrapper: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modePressable: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: SPACING.touchTargetMin,
    minHeight: SPACING.touchTargetMin,
  },
  circleCluster: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  pressedScale: {
    opacity: 0.92,
    transform: [{ scale: 0.97 }],
  },
  dockedLabelPill: {
    position: 'absolute',
    bottom: -7,
    zIndex: 2,
    borderRadius: RADIUS.full,
    borderWidth: BORDER_WIDTH.thin,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedLabelPill: {
    paddingHorizontal: SPACING.s2 + 1,
    paddingVertical: 2,
  },
  idleLabelPill: {
    paddingHorizontal: SPACING.s2,
    paddingVertical: 1.5,
  },
  selectedLabelText: {
    fontSize: TYPOGRAPHY.overline.fontSize,
    lineHeight: 13,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
});

function createSlotStyles(theme: Theme) {
  return StyleSheet.create({
    modeHexBase: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: 4,
      backgroundColor: theme.surface,
    },
    idleLabelText: {
      fontSize: TYPOGRAPHY.overline.fontSize,
      lineHeight: 13,
      fontWeight: '700',
      color: theme.textPrimary,
      letterSpacing: 0.4,
    },
  });
}
