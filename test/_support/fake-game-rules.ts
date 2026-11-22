import { IGameRules } from '../../src/domain/rules/igame-rules';
import { GameStatus } from '../../src/domain/rules/game-status';
import { ResolutionResult } from '../../src/domain/rules/resolution-result';
import { FakeCell } from './fake-cell';
import { FakeGameState, FakeMove, createFakeGameState } from './fake-game-state';

/**
 * FakeGameRules (Test Double)
 *
 * Implements IGameRules for testing the generic turn lifecycle independently
 * of the 4 concrete game variants.
 */
export class FakeGameRules
  implements IGameRules<FakeCell, FakeMove, FakeGameState>
{
  public isValidMove(state: FakeGameState, move: FakeMove): boolean {
    if (state.status !== GameStatus.PLAYING) return false;
    return state.board.hasCell(move.coord) && state.board.isEmpty(move.coord);
  }

  public applyMove(state: FakeGameState, move: FakeMove): FakeGameState {
    if (!this.isValidMove(state, move)) {
      throw new Error(`Illegal move attempted at ${move.coord.toString()}`);
    }

    const nextBoard = state.board.setCell(move.coord, move.cell);
    return createFakeGameState({
      board: nextBoard,
      score: state.score + move.cell.value,
      moveCount: state.moveCount + 1,
      status: state.status,
      targetScore: state.targetScore,
    });
  }

  public resolve(state: FakeGameState): ResolutionResult<FakeGameState> {
    const events = [];

    // Trigger dummy event if occupied cells exceed 3
    if (state.board.occupiedCount >= 3) {
      events.push({
        type: 'COMBO_TRIGGERED',
        payload: { count: state.board.occupiedCount },
      });
    }

    return Object.freeze({
      nextState: state,
      events: Object.freeze(events),
    });
  }

  public evaluateStatus(state: FakeGameState): GameStatus {
    if (state.targetScore && state.score >= state.targetScore) {
      return GameStatus.WON;
    }
    if (!this.hasValidMoves(state)) {
      return GameStatus.LOST;
    }
    return GameStatus.PLAYING;
  }

  public hasValidMoves(state: FakeGameState): boolean {
    return state.board.emptyCount > 0;
  }
}
