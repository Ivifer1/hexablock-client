import { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  GestureDetector,
  GestureHandlerRootView,
  usePanGesture,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { MOTION_SPRINGS, MOTION_TIMINGS } from './presets';
import type {
  AnimatedFadeProps,
  AnimatedPulseProps,
  AnimatedScaleProps,
  IMotionAdapter,
  MotionRootProps,
  SwipeableSurfaceProps,
} from './types';

const DEFAULT_PULSE_FROM_SCALE = 0.92;
const DEFAULT_FADE_FROM_OPACITY = 0.72;
const DEFAULT_SWIPE_THRESHOLD_PX = 28;
const PAN_ACTIVATION_OFFSET_PX = 10;

function ReanimatedRoot({ children, style }: MotionRootProps) {
  return (
    <GestureHandlerRootView style={[styles.root, style]}>
      {children}
    </GestureHandlerRootView>
  );
}

function ReanimatedScale({
  scale,
  spring = MOTION_SPRINGS.tileSelection,
  reduceMotion = false,
  style,
  testID,
  children,
}: AnimatedScaleProps) {
  const scaleValue = useSharedValue(scale);

  useEffect(() => {
    if (reduceMotion) {
      scaleValue.value = scale;
      return;
    }
    scaleValue.value = withSpring(scale, spring);
  }, [scale, spring, reduceMotion, scaleValue]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
  }));

  return (
    <Animated.View testID={testID} style={[style, animatedStyle]}>
      {children}
    </Animated.View>
  );
}

function ReanimatedPulse({
  triggerKey,
  fromScale = DEFAULT_PULSE_FROM_SCALE,
  spring = MOTION_SPRINGS.corePulse,
  reduceMotion = false,
  style,
  testID,
  children,
}: AnimatedPulseProps) {
  const scaleValue = useSharedValue(1);
  const prevKeyRef = useRef(triggerKey);

  useEffect(() => {
    if (prevKeyRef.current === triggerKey) return;
    prevKeyRef.current = triggerKey;

    if (reduceMotion) {
      scaleValue.value = 1;
      return;
    }

    scaleValue.value = fromScale;
    scaleValue.value = withSpring(1, spring);
  }, [triggerKey, fromScale, spring, reduceMotion, scaleValue]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
  }));

  return (
    <Animated.View testID={testID} style={[style, animatedStyle]}>
      {children}
    </Animated.View>
  );
}

function ReanimatedFade({
  triggerKey,
  fromOpacity = DEFAULT_FADE_FROM_OPACITY,
  durationMs = MOTION_TIMINGS.cardFade.durationMs,
  reduceMotion = false,
  style,
  testID,
  children,
}: AnimatedFadeProps) {
  const opacityValue = useSharedValue(1);
  const prevKeyRef = useRef(triggerKey);

  useEffect(() => {
    if (prevKeyRef.current === triggerKey) return;
    prevKeyRef.current = triggerKey;

    if (reduceMotion) {
      opacityValue.value = 1;
      return;
    }

    opacityValue.value = fromOpacity;
    opacityValue.value = withTiming(1, { duration: durationMs });
  }, [triggerKey, fromOpacity, durationMs, reduceMotion, opacityValue]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacityValue.value,
  }));

  return (
    <Animated.View testID={testID} style={[style, animatedStyle]}>
      {children}
    </Animated.View>
  );
}

function ReanimatedSwipeable({
  onSwipeLeft,
  onSwipeRight,
  enabled = true,
  thresholdPx = DEFAULT_SWIPE_THRESHOLD_PX,
  style,
  testID,
  children,
}: SwipeableSurfaceProps) {
  const panGesture = usePanGesture({
    enabled,
    activeOffsetX: [-PAN_ACTIVATION_OFFSET_PX, PAN_ACTIVATION_OFFSET_PX],
    runOnJS: true,
    onDeactivate: (event) => {
      if (event.canceled) return;
      if (event.translationX <= -thresholdPx) {
        onSwipeLeft?.();
      } else if (event.translationX >= thresholdPx) {
        onSwipeRight?.();
      }
    },
  });

  return (
    <GestureDetector gesture={panGesture}>
      <View testID={testID} style={style}>
        {children}
      </View>
    </GestureDetector>
  );
}

/**
 * Concrete motion adapter backed by react-native-reanimated and react-native-gesture-handler.
 * Isolated to this module so all other files remain decoupled from third-party animation APIs.
 */
export const reanimatedMotionAdapter: IMotionAdapter = {
  Root: ReanimatedRoot,
  Scale: ReanimatedScale,
  Pulse: ReanimatedPulse,
  Fade: ReanimatedFade,
  Swipeable: ReanimatedSwipeable,
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
