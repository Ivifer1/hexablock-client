import { BoardMother } from '../../_support/board-mother';
import { createFakeCell } from '../../_support/fake-cell';
import { FakeGameRules } from '../../_support/fake-game-rules';
import { createFakeGameState, FakeGameState, FakeMove } from '../../_support/fake-game-state';
import { FakeScoringPolicy } from '../../_support/fake-scoring-policy';
import { GameStatus } from '../../../src/domain/rules/game-status';
import { HexCoord } from '../../../src/domain/topology/hex-coord';

describe('IGameRules & Turn Lifecycle (Domain Strategy Contracts)', () => {
  let rules: FakeGameRules;
  let scoring: FakeScoringPolicy;

  beforeEach(() => {
    rules = new FakeGameRules();
    scoring = new FakeScoringPolicy();
  });

  describe('Phase 1: Validation (isValidMove)', () => {
    it('should_validate_legal_moves_and_reject_illegal_moves', () => {
      // Arrange
      const board = BoardMother.aRadius2Board().setCell(
        new HexCoord(0, 0),
        createFakeCell('occupied', 5),
      );
      const state = createFakeGameState({ board });

      const legalMove: FakeMove = {
        coord: new HexCoord(1, 0),
        cell: createFakeCell('new-cell', 10),
      };
      const occupiedMove: FakeMove = {
        coord: new HexCoord(0, 0),
        cell: createFakeCell('colliding', 10),
      };
      const outsideMove: FakeMove = {
        coord: new HexCoord(99, 99),
        cell: createFakeCell('outside', 10),
      };

      // Act & Assert
      expect(rules.isValidMove(state, legalMove)).toBe(true);
      expect(rules.isValidMove(state, occupiedMove)).toBe(false);
      expect(rules.isValidMove(state, outsideMove)).toBe(false);
    });
  });

  describe('Phase 2: Application (applyMove)', () => {
    it('should_produce_new_immutable_state_when_applying_move', () => {
      // Arrange
      const initialBoard = BoardMother.aRadius2Board();
      const initialState = createFakeGameState({ board: initialBoard, score: 0, moveCount: 0 });
      const move: FakeMove = {
        coord: new HexCoord(1, -1),
        cell: createFakeCell('c1', 15),
      };

      // Act
      const nextState = rules.applyMove(initialState, move);

      // Assert: immutability & values
      expect(nextState).not.toBe(initialState);
      expect(initialState.moveCount).toBe(0);
      expect(initialState.score).toBe(0);
      expect(initialState.board.occupiedCount).toBe(0);

      expect(nextState.moveCount).toBe(1);
      expect(nextState.score).toBe(15);
      expect(nextState.board.occupiedCount).toBe(1);
      expect(nextState.board.getCell(move.coord)?.value).toBe(15);
    });

    it('should_throw_domain_error_when_applying_invalid_move', () => {
      // Arrange
      const state = createFakeGameState({ board: BoardMother.aRadius2Board() });
      const invalidMove: FakeMove = {
        coord: new HexCoord(99, 99),
        cell: createFakeCell('invalid', 5),
      };

      // Act & Assert
      expect(() => rules.applyMove(state, invalidMove)).toThrow(/illegal/i);
    });
  });

  describe('Phase 3: Resolution (resolve)', () => {
    it('should_resolve_cascades_and_emit_game_events_when_resolved', () => {
      // Arrange: create a board with 3 occupied cells to trigger COMBO_TRIGGERED
      let board = BoardMother.aRadius2Board();
      board = board.setCell(new HexCoord(0, 0), createFakeCell('c1', 5));
      board = board.setCell(new HexCoord(1, 0), createFakeCell('c2', 5));
      board = board.setCell(new HexCoord(0, 1), createFakeCell('c3', 5));
      const state = createFakeGameState({ board, score: 15 });

      // Act
      const resolution = rules.resolve(state);

      // Assert
      expect(resolution.nextState).toBe(state);
      expect(resolution.events).toHaveLength(1);
      expect(resolution.events[0].type).toBe('COMBO_TRIGGERED');
      expect(resolution.events[0].payload).toEqual({ count: 3 });
    });
  });

  describe('Phase 4: Evaluation (evaluateStatus & hasValidMoves)', () => {
    it('should_transition_status_to_won_when_victory_condition_is_met', () => {
      // Arrange: target score is 50, current score reaches 50
      const board = BoardMother.aRadius2Board();
      const stateWon = createFakeGameState({
        board,
        score: 50,
        targetScore: 50,
      });

      // Act
      const status = rules.evaluateStatus(stateWon);

      // Assert
      expect(status).toBe(GameStatus.WON);
    });

    it('should_transition_status_to_lost_when_no_valid_moves_remain', () => {
      // Arrange: fully populated board (0 empty cells)
      const fullBoard = BoardMother.aPopulatedRadius2Board();
      const stateLost = createFakeGameState({ board: fullBoard });

      // Act
      const hasMoves = rules.hasValidMoves(stateLost);
      const status = rules.evaluateStatus(stateLost);

      // Assert
      expect(hasMoves).toBe(false);
      expect(status).toBe(GameStatus.LOST);
    });

    it('should_keep_status_playing_when_game_is_in_progress', () => {
      // Arrange
      const board = BoardMother.aRadius2Board();
      const statePlaying = createFakeGameState({ board, score: 10, targetScore: 100 });

      // Act & Assert
      expect(rules.evaluateStatus(statePlaying)).toBe(GameStatus.PLAYING);
      expect(rules.hasValidMoves(statePlaying)).toBe(true);
    });
  });

  describe('IScoringPolicy Integration', () => {
    it('should_calculate_score_and_multipliers_from_turn_events', () => {
      // Arrange
      const board = BoardMother.aRadius2Board();
      const beforeState: FakeGameState = createFakeGameState({ board, score: 10, moveCount: 1 });
      const afterState: FakeGameState = createFakeGameState({
        board: board.setCell(new HexCoord(0, 0), createFakeCell('c1', 10)),
        score: 20, // base points = 10
        moveCount: 2,
        status: GameStatus.WON,
      });

      const events = [
        { type: 'COMBO_TRIGGERED', payload: { count: 3 } },
      ];

      // Act
      const result = scoring.calculateTurnScore({
        beforeState,
        afterState,
        events,
        moveNumber: 2,
      });

      // Assert: (base 10 + bonus 20) * multiplier 2 = 60 points earned
      expect(result.pointsEarned).toBe(60);
      expect(result.newTotalScore).toBe(70); // 10 before + 60
      expect(result.multiplier).toBe(2);
      expect(result.starsEarned).toBe(3); // WON awards 3 stars
      expect(result.breakdown).toEqual({
        basePoints: 10,
        bonus: 20,
        multiplier: 2,
      });
    });
  });
});
