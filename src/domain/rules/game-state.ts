import { HexBoard } from '../board/hex-board';
import { GameStatus } from './game-status';

/**
 * BaseGameState<TCell> (Value Object / Interface)
 *
 * The foundational contract that EVERY game state snapshot shares across all variants.
 * Specific variants extend this base with their own domain payloads (e.g. Lines tray,
 * Sort goals, Fit remaining pieces).
 */
export interface BaseGameState<TCell> {
  /** The immutable board state. */
  readonly board: HexBoard<TCell>;
  /** The cumulative score in the current session. */
  readonly score: number;
  /** The total number of executed moves. */
  readonly moveCount: number;
  /** The lifecycle status of the session. */
  readonly status: GameStatus;
}
