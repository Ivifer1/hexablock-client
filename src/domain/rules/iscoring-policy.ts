import { BaseGameState } from './game-state';
import { GameEvent } from './game-event';

/**
 * TurnScoreContext<TState> (Value Object)
 *
 * Encapsulates the complete context of a turn transition for scoring calculation.
 */
export interface TurnScoreContext<TState> {
  /** The state snapshot before the move was applied. */
  readonly beforeState: TState;
  /** The state snapshot after move application and cascade resolution. */
  readonly afterState: TState;
  /** Domain events emitted during resolution (e.g. LINES_CLEARED, TILES_MERGED). */
  readonly events: readonly GameEvent[];
  /** The sequential move number. */
  readonly moveNumber: number;
  /** Elapsed seconds in the level or game session. */
  readonly elapsedSeconds?: number;
}

/**
 * ScoreResult (Value Object)
 *
 * Encapsulates points, multipliers, and star ratings earned from a turn transition.
 */
export interface ScoreResult {
  /** Net points earned in this turn. */
  readonly pointsEarned: number;
  /** New total cumulative score. */
  readonly newTotalScore: number;
  /** Multiplier applied to this turn (e.g. 1, 2, 3). */
  readonly multiplier: number;
  /** Stars awarded upon level completion (0 to 3). */
  readonly starsEarned?: number;
  /** Itemized breakdown of score calculations for UI feedback. */
  readonly breakdown: Readonly<Record<string, number>>;
}

/**
 * IScoringPolicy<TState> (GoF Strategy)
 *
 * Defines the contract for pure mathematical evaluation of points, combos,
 * streaks, and stars resulting from turn transitions.
 */
export interface IScoringPolicy<TState extends BaseGameState<any>> {
  /**
   * Computes points, multipliers, and stars earned during a turn transition.
   */
  calculateTurnScore(context: TurnScoreContext<TState>): ScoreResult;
}
