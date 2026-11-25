import { useEffect, useMemo, useRef, useState, type ComponentRef } from 'react';
import {
  Animated,
  Platform,
  StyleSheet,
  View,
  type GestureResponderEvent,
} from 'react-native';
import type { IAssetResolver } from '../application/ports';
import { HomePreviewVisual, type HomePreviewAsset } from './home-previews';
import {
  CentralIsoCube,
  WheelModeSlot,
  type ExtendedHomeModeDTO,
} from './home/WheelModeSlot';
import type { ModeIconComponent } from './mode-icons';
import { BORDER_WIDTH, RADIUS, SPACING, type Theme } from './theme';
import {
  canonicalWheelDeg,
  computeShortestWheelTargetDeg,
  indexAtTopForRotationDeg,
  wrapAngleDeltaRad,
} from './wheelMath';

export type { ExtendedHomeModeDTO };

export interface HexModeSelectorProps {
  readonly modes: readonly ExtendedHomeModeDTO[];
  readonly selectedId: string | null;
  readonly onSelectMode: (mode: ExtendedHomeModeDTO) => void;
  readonly wheelSize: number;
  readonly selectorHeight: number;
  readonly modeIconSize: number;
  readonly selectedModeIconSize: number;
  readonly marginTop: number;
  readonly theme: Theme;
  readonly isDark: boolean;
  readonly reduceMotion: boolean;
  readonly modeIconResolver?: IAssetResolver<ModeIconComponent>;
  readonly previewResolver?: IAssetResolver<HomePreviewAsset>;
  readonly resolveModeName: (mode: ExtendedHomeModeDTO) => string;
  readonly resolveShortLabel: (mode: ExtendedHomeModeDTO) => string;
}

const USE_NATIVE_DRIVER = Platform.OS !== 'web';
const DIAL_TICK_COUNT = 12;

function withAlpha(hex: string, alphaHex: string): string {
  if (/^#[0-9A-Fa-f]{6}$/.test(hex)) return `${hex}${alphaHex}`;
  return hex;
}

export function HexModeSelector({
  modes,
  selectedId,
  onSelectMode,
  wheelSize,
  selectorHeight,
  modeIconSize,
  selectedModeIconSize,
  marginTop,
  theme,
  isDark,
  reduceMotion,
  modeIconResolver,
  previewResolver,
  resolveModeName,
  resolveShortLabel,
}: HexModeSelectorProps) {
  const styles = useMemo(() => createStyles(theme), [theme]);

  const initialIndex = Math.max(
    0,
    modes.findIndex((mode) => mode.id === selectedId),
  );
  const initialRotation = canonicalWheelDeg(initialIndex, modes.length);

  const [wheelRotation] = useState(() => new Animated.Value(initialRotation));
  const [corePulse] = useState(() => new Animated.Value(1));

  const currentRotationRef = useRef(initialRotation);
  const isInitialMountRef = useRef(true);
  const prevSelectedIdRef = useRef<string | null>(selectedId);
  const isDraggingRef = useRef(false);
  const lastPointerAngleRef = useRef<number | null>(null);
  const touchStartPosRef = useRef<{ x: number; y: number } | null>(null);
  const wheelFrameRef = useRef<ComponentRef<typeof View> | null>(null);
  const wheelCenterRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const listenerId = wheelRotation.addListener(({ value }) => {
      currentRotationRef.current = value;
    });
    return () => {
      wheelRotation.removeListener(listenerId);
    };
  }, [wheelRotation]);

  useEffect(() => {
    if (modes.length === 0) return;
    const targetIndex = Math.max(
      0,
      modes.findIndex((mode) => mode.id === selectedId),
    );

    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      prevSelectedIdRef.current = selectedId;
      const startDeg = canonicalWheelDeg(targetIndex, modes.length);
      currentRotationRef.current = startDeg;
      wheelRotation.setValue(startDeg);
      return;
    }

    const selectionChanged = prevSelectedIdRef.current !== selectedId;
    prevSelectedIdRef.current = selectedId;

    if (isDraggingRef.current) return;

    const targetDeg = computeShortestWheelTargetDeg(
      currentRotationRef.current,
      targetIndex,
      modes.length,
    );

    if (reduceMotion) {
      currentRotationRef.current = targetDeg;
      wheelRotation.setValue(targetDeg);
      corePulse.setValue(1);
      return;
    }

    if (Math.abs(targetDeg - currentRotationRef.current) > 0.01) {
      Animated.spring(wheelRotation, {
        toValue: targetDeg,
        stiffness: 160,
        damping: 19,
        mass: 0.95,
        useNativeDriver: USE_NATIVE_DRIVER,
      }).start();
    }

    if (selectionChanged) {
      corePulse.setValue(0.92);
      Animated.spring(corePulse, {
        toValue: 1,
        stiffness: 220,
        damping: 16,
        mass: 0.8,
        useNativeDriver: USE_NATIVE_DRIVER,
      }).start();
    }
  }, [selectedId, modes, reduceMotion, wheelRotation, corePulse]);

  const measureWheelCenter = () => {
    wheelFrameRef.current?.measureInWindow((x, y, width, height) => {
      if (width > 0 && height > 0) {
        wheelCenterRef.current = { x: x + width / 2, y: y + height / 2 };
      }
    });
  };

  const handleTouchStartCapture = (event: GestureResponderEvent) => {
    const { pageX, pageY } = event.nativeEvent;
    touchStartPosRef.current = { x: pageX, y: pageY };
  };

  const shouldClaimDrag = (event: GestureResponderEvent) => {
    if (modes.length < 2 || !touchStartPosRef.current) return false;
    const dx = event.nativeEvent.pageX - touchStartPosRef.current.x;
    const dy = event.nativeEvent.pageY - touchStartPosRef.current.y;
    return Math.hypot(dx, dy) > 8;
  };

  const handleResponderGrant = () => {
    isDraggingRef.current = true;
    lastPointerAngleRef.current = null;
    wheelRotation.stopAnimation((value) => {
      currentRotationRef.current = value;
    });
    measureWheelCenter();
  };

  const handleResponderMove = (event: GestureResponderEvent) => {
    if (modes.length < 2) return;

    const center = wheelCenterRef.current;
    if (!center) {
      measureWheelCenter();
      return;
    }

    const { pageX, pageY } = event.nativeEvent;
    const nextAngle = Math.atan2(pageY - center.y, pageX - center.x);
    if (lastPointerAngleRef.current === null) {
      lastPointerAngleRef.current = nextAngle;
      return;
    }

    const deltaRad = wrapAngleDeltaRad(nextAngle - lastPointerAngleRef.current);
    lastPointerAngleRef.current = nextAngle;
    const deltaDeg = (deltaRad * 180) / Math.PI;
    const nextRot = currentRotationRef.current + deltaDeg;

    currentRotationRef.current = nextRot;
    wheelRotation.setValue(nextRot);

    const topIndex = indexAtTopForRotationDeg(nextRot, modes.length);
    const nextMode = modes[topIndex];
    if (nextMode && nextMode.id !== selectedId) {
      onSelectMode(nextMode);
    }
  };

  const finishDrag = () => {
    isDraggingRef.current = false;
    lastPointerAngleRef.current = null;
    touchStartPosRef.current = null;

    if (modes.length === 0) return;

    const nearestIndex = indexAtTopForRotationDeg(
      currentRotationRef.current,
      modes.length,
    );
    const nearestMode = modes[nearestIndex];
    if (nearestMode && nearestMode.id !== selectedId) {
      onSelectMode(nearestMode);
    }

    const targetDeg = computeShortestWheelTargetDeg(
      currentRotationRef.current,
      nearestIndex,
      modes.length,
    );

    if (reduceMotion) {
      currentRotationRef.current = targetDeg;
      wheelRotation.setValue(targetDeg);
      return;
    }

    Animated.spring(wheelRotation, {
      toValue: targetDeg,
      stiffness: 170,
      damping: 20,
      mass: 0.9,
      useNativeDriver: USE_NATIVE_DRIVER,
    }).start();
  };

  const wheelRotateDeg = wheelRotation.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });
  const counterRotateDeg = wheelRotation.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '-360deg'],
  });

  const totalModes = modes.length;
  const selectedMode =
    modes.find((mode) => mode.id === selectedId) ?? modes[0] ?? null;
  const activePreview = selectedMode
    ? (previewResolver?.resolve(selectedMode.previewKey) ?? null)
    : null;

  return (
    <View
      style={[
        styles.selectorContainer,
        {
          minHeight: selectorHeight,
          marginTop,
          marginBottom: SPACING.s2,
        },
      ]}
    >
      <View
        style={[
          styles.pointerIndicator,
          { borderTopColor: theme.primary },
        ]}
      />

      <View
        style={[
          styles.wheelAura,
          {
            width: wheelSize * 1.08,
            height: wheelSize * 1.08,
            borderRadius: (wheelSize * 1.08) / 2,
            backgroundColor: withAlpha(theme.primary, isDark ? '14' : '10'),
          },
        ]}
      />

      <View
        ref={wheelFrameRef}
        onLayout={measureWheelCenter}
        onTouchStartCapture={handleTouchStartCapture}
        onStartShouldSetResponder={() => false}
        onMoveShouldSetResponderCapture={shouldClaimDrag}
        onMoveShouldSetResponder={shouldClaimDrag}
        onResponderTerminationRequest={() => false}
        onResponderGrant={handleResponderGrant}
        onResponderMove={handleResponderMove}
        onResponderRelease={finishDrag}
        onResponderTerminate={finishDrag}
        style={[
          styles.wheelContainer,
          {
            width: wheelSize,
            height: wheelSize,
            borderRadius: wheelSize / 2,
          },
        ]}
      >
        <View
          pointerEvents="none"
          style={[
            styles.wheelTrackRing,
            {
              width: wheelSize * 0.84,
              height: wheelSize * 0.84,
              borderRadius: (wheelSize * 0.84) / 2,
            },
          ]}
        />

        <View
          pointerEvents="none"
          style={[
            styles.wheelInnerCore,
            {
              width: wheelSize * 0.44,
              height: wheelSize * 0.44,
              borderRadius: (wheelSize * 0.44) / 2,
            },
          ]}
        >
          <Animated.View style={{ transform: [{ scale: corePulse }] }}>
            {activePreview ? (
              <HomePreviewVisual
                asset={activePreview}
                size={wheelSize * 0.3}
                testID="home-center-preview"
              />
            ) : (
              <CentralIsoCube
                color={theme.primary}
                size={wheelSize * 0.26}
              />
            )}
          </Animated.View>
        </View>

        <Animated.View
          style={[
            styles.wheelRotor,
            {
              width: wheelSize,
              height: wheelSize,
              borderRadius: wheelSize / 2,
              transform: [{ rotate: wheelRotateDeg }],
            },
          ]}
        >
          <View
            pointerEvents="none"
            style={[
              styles.wheelFrame,
              {
                width: wheelSize,
                height: wheelSize,
                borderRadius: wheelSize / 2,
              },
            ]}
          />

          <View
            pointerEvents="none"
            style={[
              styles.wheelTrackRingInner,
              {
                width: wheelSize * 0.68,
                height: wheelSize * 0.68,
                borderRadius: (wheelSize * 0.68) / 2,
              },
            ]}
          />

          {Array.from({ length: DIAL_TICK_COUNT }, (_, tickIndex) => {
            const deg = (360 / DIAL_TICK_COUNT) * tickIndex;
            const rad = (deg * Math.PI) / 180 - Math.PI / 2;
            const tickRadius = wheelSize * 0.455;
            const tickWidth = 2;
            const tickHeight = tickIndex % 3 === 0 ? 9 : 5;
            const left = wheelSize / 2 + tickRadius * Math.cos(rad) - tickWidth / 2;
            const top = wheelSize / 2 + tickRadius * Math.sin(rad) - tickHeight / 2;

            return (
              <View
                key={tickIndex}
                pointerEvents="none"
                style={[
                  styles.dialTick,
                  {
                    left,
                    top,
                    width: tickWidth,
                    height: tickHeight,
                    backgroundColor:
                      tickIndex % 3 === 0
                        ? withAlpha(theme.primary, isDark ? '66' : '55')
                        : theme.borderStrong,
                    opacity: tickIndex % 3 === 0 ? 0.85 : 0.45,
                    transform: [{ rotate: `${deg}deg` }],
                  },
                ]}
              />
            );
          })}

          {modes.map((mode, index) => (
            <WheelModeSlot
              key={mode.id}
              mode={mode}
              index={index}
              totalModes={totalModes}
              isSelected={mode.id === selectedId}
              wheelSize={wheelSize}
              modeIconSize={modeIconSize}
              selectedModeIconSize={selectedModeIconSize}
              counterRotateDeg={counterRotateDeg}
              theme={theme}
              isDark={isDark}
              reduceMotion={reduceMotion}
              modeIconResolver={modeIconResolver}
              modeName={resolveModeName(mode)}
              shortLabel={resolveShortLabel(mode)}
              onSelectMode={onSelectMode}
            />
          ))}
        </Animated.View>
      </View>
    </View>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    selectorContainer: {
      position: 'relative',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
    },
    pointerIndicator: {
      position: 'absolute',
      top: 4,
      zIndex: 5,
      width: 0,
      height: 0,
      borderLeftWidth: 7,
      borderRightWidth: 7,
      borderTopWidth: 10,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
    },
    wheelAura: {
      position: 'absolute',
    },
    wheelContainer: {
      position: 'relative',
      alignItems: 'center',
      justifyContent: 'center',
    },
    wheelRotor: {
      position: 'relative',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2,
    },
    wheelFrame: {
      position: 'absolute',
      borderWidth: BORDER_WIDTH.thin,
      borderColor: theme.borderDefault,
      borderStyle: 'dashed',
      backgroundColor: withAlpha(theme.surface, '99'),
    },
    wheelTrackRing: {
      position: 'absolute',
      borderWidth: BORDER_WIDTH.thick * 2,
      borderColor: theme.surfaceSubdued,
      opacity: 0.85,
    },
    wheelTrackRingInner: {
      position: 'absolute',
      borderWidth: BORDER_WIDTH.thin,
      borderColor: theme.borderDefault,
      borderStyle: 'dashed',
      opacity: 0.7,
    },
    dialTick: {
      position: 'absolute',
      borderRadius: RADIUS.full,
    },
    wheelInnerCore: {
      position: 'absolute',
      backgroundColor: theme.centerSurface,
      borderWidth: BORDER_WIDTH.thick,
      borderColor: theme.borderStrong,
      alignItems: 'center',
      justifyContent: 'center',
      ...theme.shadowMedium,
      zIndex: 1,
    },
  });
}
