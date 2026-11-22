import { BaseGameState } from './game-state';
import { GameStatus } from './game-status';
import { ResolutionResult } from './resolution-result';

/**
 * IGameRules<TCell, TMove, TState> (GoF Strategy & Domain Service)
 *
 * Defines the core rules contract governing game mechanics, move legality,
 * cascade resolution, and end-of-game conditions across all variants.
 */
export interface IGameRules<
  TCell,
  TMove,
  TState extends BaseGameState<TCell>
> {
  /**
   * Phase 1: VALIDATION
   * Checks whether the proposed move is legal in the current state.
   */
  isValidMove(state: TState, move: TMove): boolean;

  /**
   * Phase 2: APPLICATION
   * Applies the physical move action directly, returning an updated immutable state.
   */
  applyMove(state: TState, move: TMove): TState;

  /**
   * Phase 3: RESOLUTION
   * Resolves automatic chain reactions (clearing completed lines, merging tiles,
   * transferring stacks) until the board reaches a stable equilibrium.
   */
  resolve(state: TState): ResolutionResult<TState>;

  /**
   * Phase 4: EVALUATION
   * Evaluates whether the game transitioned to WON, LOST, or continues PLAYING.
   */
  evaluateStatus(state: TState): GameStatus;

  /**
   * DISCOVERY
   * Checks whether at least one legal move remains for the player.
   */
  hasValidMoves(state: TState): boolean;
}
