import type { GameModeDescriptor } from '../application/modes';
import { DEFAULT_HOME_MODE_REGISTRATIONS } from './homeModeRegistrations';

/**
 * Registered in launch order; the first entry becomes the initial default selection (BR-005-14).
 */
export const DEFAULT_HOME_MODE_DESCRIPTORS: readonly GameModeDescriptor[] =
  DEFAULT_HOME_MODE_REGISTRATIONS.map((registration) => registration.descriptor);
