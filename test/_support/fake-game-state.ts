import { BaseGameState } from '../../src/domain/rules/game-state';
import { GameStatus } from '../../src/domain/rules/game-status';
import { HexBoard } from '../../src/domain/board/hex-board';
import { HexCoord } from '../../src/domain/topology/hex-coord';
import { FakeCell } from './fake-cell';

export interface FakeMove {
  readonly coord: HexCoord;
  readonly cell: FakeCell;
}

export interface FakeGameState extends BaseGameState<FakeCell> {
  readonly targetScore?: number;
  readonly extraFlag?: string;
}

export function createFakeGameState(params: {
  board: HexBoard<FakeCell>;
  score?: number;
  moveCount?: number;
  status?: GameStatus;
  targetScore?: number;
}): FakeGameState {
  return Object.freeze({
    board: params.board,
    score: params.score ?? 0,
    moveCount: params.moveCount ?? 0,
    status: params.status ?? GameStatus.PLAYING,
    targetScore: params.targetScore,
  });
}
