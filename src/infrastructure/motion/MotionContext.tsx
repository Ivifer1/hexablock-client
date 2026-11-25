import { createContext, useContext, type ReactNode } from 'react';
import { reanimatedMotionAdapter } from './ReanimatedMotionAdapter';
import type {
  AnimatedFadeProps,
  AnimatedPulseProps,
  AnimatedScaleProps,
  IMotionAdapter,
  MotionRootProps,
  SwipeableSurfaceProps,
} from './types';

const MotionAdapterContext = createContext<IMotionAdapter>(reanimatedMotionAdapter);

export interface MotionProviderProps {
  readonly adapter?: IMotionAdapter;
  readonly children: ReactNode;
}

/**
 * Injects an IMotionAdapter strategy for descendant UI components (DIP).
 */
export function MotionProvider({
  adapter = reanimatedMotionAdapter,
  children,
}: MotionProviderProps) {
  return (
    <MotionAdapterContext.Provider value={adapter}>
      {children}
    </MotionAdapterContext.Provider>
  );
}

/**
 * Resolves the active IMotionAdapter from React context.
 */
export function useMotionAdapter(): IMotionAdapter {
  return useContext(MotionAdapterContext);
}

export function MotionRoot(props: MotionRootProps) {
  const { Root } = useMotionAdapter();
  return <Root {...props} />;
}

export function AnimatedScale(props: AnimatedScaleProps) {
  const { Scale } = useMotionAdapter();
  return <Scale {...props} />;
}

export function AnimatedPulse(props: AnimatedPulseProps) {
  const { Pulse } = useMotionAdapter();
  return <Pulse {...props} />;
}

export function AnimatedFade(props: AnimatedFadeProps) {
  const { Fade } = useMotionAdapter();
  return <Fade {...props} />;
}

export function SwipeableSurface(props: SwipeableSurfaceProps) {
  const { Swipeable } = useMotionAdapter();
  return <Swipeable {...props} />;
}
