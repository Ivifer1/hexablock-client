import type { ComponentType, ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export interface MotionSpringConfig {
  readonly stiffness: number;
  readonly damping: number;
  readonly mass: number;
}

export interface MotionTimingConfig {
  readonly durationMs: number;
}

export interface MotionRootProps {
  readonly children: ReactNode;
  readonly style?: StyleProp<ViewStyle>;
}

export interface AnimatedScaleProps {
  readonly scale: number;
  readonly spring?: MotionSpringConfig;
  readonly reduceMotion?: boolean;
  readonly style?: StyleProp<ViewStyle>;
  readonly testID?: string;
  readonly children: ReactNode;
}

export interface AnimatedPulseProps {
  readonly triggerKey: string;
  readonly fromScale?: number;
  readonly spring?: MotionSpringConfig;
  readonly reduceMotion?: boolean;
  readonly style?: StyleProp<ViewStyle>;
  readonly testID?: string;
  readonly children: ReactNode;
}

export interface AnimatedFadeProps {
  readonly triggerKey: string;
  readonly fromOpacity?: number;
  readonly durationMs?: number;
  readonly reduceMotion?: boolean;
  readonly style?: StyleProp<ViewStyle>;
  readonly testID?: string;
  readonly children: ReactNode;
}

export interface SwipeableSurfaceProps {
  readonly onSwipeLeft?: () => void;
  readonly onSwipeRight?: () => void;
  readonly enabled?: boolean;
  readonly thresholdPx?: number;
  readonly style?: StyleProp<ViewStyle>;
  readonly testID?: string;
  readonly children: ReactNode;
}

/**
 * ISP-compliant adapter port for UI motion and gesture primitives inside infrastructure.
 * Screens and components depend on this contract rather than concrete animation packages.
 */
export interface IMotionAdapter {
  readonly Root: ComponentType<MotionRootProps>;
  readonly Scale: ComponentType<AnimatedScaleProps>;
  readonly Pulse: ComponentType<AnimatedPulseProps>;
  readonly Fade: ComponentType<AnimatedFadeProps>;
  readonly Swipeable: ComponentType<SwipeableSurfaceProps>;
}
