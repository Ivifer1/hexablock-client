import { GameEvent } from './game-event';

/**
 * ResolutionResult<TState> (Value Object)
 *
 * Encapsulates the stable state produced after cascade resolution along with
 * any domain events emitted during the process.
 */
export interface ResolutionResult<TState> {
  /** The resulting stable state after all chain reactions settle. */
  readonly nextState: TState;
  /** The sequence of domain events emitted during cascade resolution. */
  readonly events: readonly GameEvent[];
}
