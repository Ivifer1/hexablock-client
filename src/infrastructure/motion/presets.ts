import { MOTION } from '../theme';
import type { MotionSpringConfig, MotionTimingConfig } from './types';

export const MOTION_SPRINGS: Readonly<
  Record<'tileSelection' | 'corePulse' | 'snappy' | 'gentle', MotionSpringConfig>
> = {
  tileSelection: {
    stiffness: 220,
    damping: 18,
    mass: 0.85,
  },
  corePulse: {
    stiffness: 220,
    damping: 16,
    mass: 0.8,
  },
  snappy: {
    stiffness: 300,
    damping: 22,
    mass: 0.8,
  },
  gentle: {
    stiffness: 150,
    damping: 18,
    mass: 1,
  },
} as const;

export const MOTION_TIMINGS: Readonly<
  Record<'press' | 'selection' | 'cardFade', MotionTimingConfig>
> = {
  press: {
    durationMs: MOTION.pressMs,
  },
  selection: {
    durationMs: MOTION.selectionMs,
  },
  cardFade: {
    durationMs: Math.round(MOTION.selectionMs * 0.7),
  },
} as const;
