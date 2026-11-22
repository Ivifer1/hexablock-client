import { HexCoord } from '../../../src/domain/topology/hex-coord';
import { HexAxis } from '../../../src/domain/topology/hex-direction';
import { BoardMother } from '../../_support/board-mother';
import { createFakeCell, FakeCell } from '../../_support/fake-cell';

describe('HexBoard<TCell> (Entity & Aggregate Root)', () => {
  describe('creation and invariants', () => {
    it('should_create_empty_board_matching_shape_cell_count_when_initialized', () => {
      // Arrange & Act
      const board = BoardMother.aRadius2Board<FakeCell>();

      // Assert
      expect(board.cellCount).toBe(19);
      expect(board.occupiedCount).toBe(0);
      expect(board.emptyCount).toBe(19);
      expect(board.isFull()).toBe(false);
      expect(board.getOccupiedCells()).toHaveLength(0);
      expect(board.getEmptyCoords()).toHaveLength(19);
    });

    it('should_throw_domain_error_when_setting_cell_outside_board_shape', () => {
      // Arrange
      const board = BoardMother.aRadius2Board<FakeCell>();
      const outsideCoord = new HexCoord(99, 99);
      const cell = createFakeCell('c1');

      // Act & Assert
      expect(() => board.setCell(outsideCoord, cell)).toThrow(/outside/i);
    });
  });

  describe('immutability and state transitions (Memento / Pure State)', () => {
    it('should_return_new_board_instance_without_mutating_original_when_cell_is_set', () => {
      // Arrange
      const originalBoard = BoardMother.aRadius2Board<FakeCell>();
      const coord = new HexCoord(0, 0);
      const cell = createFakeCell('center-cell');

      // Act
      const updatedBoard = originalBoard.setCell(coord, cell);

      // Assert
      expect(updatedBoard).not.toBe(originalBoard);
      expect(originalBoard.getCell(coord)).toBeUndefined();
      expect(originalBoard.occupiedCount).toBe(0);

      expect(updatedBoard.getCell(coord)).toEqual(cell);
      expect(updatedBoard.occupiedCount).toBe(1);
      expect(updatedBoard.emptyCount).toBe(18);
    });

    it('should_return_new_board_instance_without_mutating_original_when_cell_is_cleared', () => {
      // Arrange
      const coord = new HexCoord(1, -1);
      const cell = createFakeCell('c1');
      const initialBoard = BoardMother.aRadius2Board<FakeCell>().setCell(coord, cell);

      // Act
      const clearedBoard = initialBoard.clearCell(coord);

      // Assert
      expect(clearedBoard).not.toBe(initialBoard);
      expect(initialBoard.getCell(coord)).toEqual(cell);
      expect(initialBoard.occupiedCount).toBe(1);

      expect(clearedBoard.getCell(coord)).toBeUndefined();
      expect(clearedBoard.occupiedCount).toBe(0);
      expect(clearedBoard.emptyCount).toBe(19);
    });

    it('should_return_empty_board_when_cleared', () => {
      // Arrange
      const populated = BoardMother.aPopulatedRadius2Board();
      expect(populated.isFull()).toBe(true);

      // Act
      const cleared = populated.clear();

      // Assert
      expect(cleared.occupiedCount).toBe(0);
      expect(cleared.emptyCount).toBe(19);
      expect(cleared.isFull()).toBe(false);
      expect(populated.isFull()).toBe(true); // original remains full
    });
  });

  describe('cell querying and status', () => {
    it('should_identify_empty_and_occupied_cells_accurately', () => {
      // Arrange
      const coord = new HexCoord(1, 0);
      const emptyCoord = new HexCoord(0, 1);
      const board = BoardMother.aRadius2Board<FakeCell>().setCell(coord, createFakeCell('c1'));

      // Act & Assert
      expect(board.hasCell(coord)).toBe(true);
      expect(board.hasCell(new HexCoord(5, 5))).toBe(false);

      expect(board.isOccupied(coord)).toBe(true);
      expect(board.isEmpty(coord)).toBe(false);

      expect(board.isOccupied(emptyCoord)).toBe(false);
      expect(board.isEmpty(emptyCoord)).toBe(true);
    });

    it('should_report_full_board_when_all_cells_are_occupied', () => {
      // Arrange & Act
      const fullBoard = BoardMother.aPopulatedRadius2Board();

      // Assert
      expect(fullBoard.isFull()).toBe(true);
      expect(fullBoard.occupiedCount).toBe(19);
      expect(fullBoard.emptyCount).toBe(0);
      expect(fullBoard.getEmptyCoords()).toHaveLength(0);
      expect(fullBoard.getOccupiedCells()).toHaveLength(19);
    });

    it('should_retrieve_all_occupied_cells_and_empty_coords', () => {
      // Arrange
      const c1 = new HexCoord(0, 0);
      const c2 = new HexCoord(1, -1);
      const cell1 = createFakeCell('c1');
      const cell2 = createFakeCell('c2');

      const board = BoardMother.aRadius2Board<FakeCell>()
        .setCell(c1, cell1)
        .setCell(c2, cell2);

      // Act
      const occupied = board.getOccupiedCells();
      const empty = board.getEmptyCoords();

      // Assert
      expect(occupied).toHaveLength(2);
      expect(occupied).toEqual(
        expect.arrayContaining([
          { coord: c1, content: cell1 },
          { coord: c2, content: cell2 },
        ]),
      );
      expect(empty).toHaveLength(17);
      expect(empty.some((c) => c.equals(c1))).toBe(false);
      expect(empty.some((c) => c.equals(c2))).toBe(false);
    });
  });

  describe('spatial lines extraction across 3 axes (for Hexa Lines detection)', () => {
    it('should_extract_all_parallel_lines_along_q_axis_when_querying_q_axis', () => {
      // Arrange: Radius 2 board has coordinates r in [-2, 2], so 5 parallel lines along Q-axis.
      const board = BoardMother.aRadius2Board<FakeCell>();

      // Act
      const lines = board.getLinesOnAxis(HexAxis.Q_AXIS);

      // Assert:
      // Radius 2 -> 2 * R + 1 = 5 lines.
      expect(lines).toHaveLength(5);
      // Total cells across all lines must equal total board cells (19)
      const totalCells = lines.reduce((acc, line) => acc + line.length, 0);
      expect(totalCells).toBe(19);

      // In Q-axis, each line has constant r coordinate
      lines.forEach((line) => {
        const expectedR = line[0].coord.r;
        expect(line.every((cell) => cell.coord.r === expectedR)).toBe(true);
      });
    });

    it('should_extract_all_parallel_lines_along_r_axis_when_querying_r_axis', () => {
      // Arrange: Radius 2 board has coordinates q in [-2, 2], so 5 parallel lines along R-axis.
      const board = BoardMother.aRadius2Board<FakeCell>();

      // Act
      const lines = board.getLinesOnAxis(HexAxis.R_AXIS);

      // Assert
      expect(lines).toHaveLength(5);
      const totalCells = lines.reduce((acc, line) => acc + line.length, 0);
      expect(totalCells).toBe(19);

      // In R-axis, each line has constant q coordinate
      lines.forEach((line) => {
        const expectedQ = line[0].coord.q;
        expect(line.every((cell) => cell.coord.q === expectedQ)).toBe(true);
      });
    });

    it('should_extract_all_parallel_lines_along_s_axis_when_querying_s_axis', () => {
      // Arrange: Radius 2 board has coordinates s in [-2, 2], so 5 parallel lines along S-axis.
      const board = BoardMother.aRadius2Board<FakeCell>();

      // Act
      const lines = board.getLinesOnAxis(HexAxis.S_AXIS);

      // Assert
      expect(lines).toHaveLength(5);
      const totalCells = lines.reduce((acc, line) => acc + line.length, 0);
      expect(totalCells).toBe(19);

      // In S-axis, each line has constant s coordinate (q + r)
      lines.forEach((line) => {
        const expectedS = line[0].coord.s;
        expect(line.every((cell) => cell.coord.s === expectedS)).toBe(true);
      });
    });

    it('should_return_cells_in_sorted_spatial_order_within_each_line', () => {
      // Arrange
      const board = BoardMother.aRadius2Board<FakeCell>();

      // Act
      const qLines = board.getLinesOnAxis(HexAxis.Q_AXIS);

      // Assert: Along Q-axis (constant r), q coordinates must be in ascending order
      qLines.forEach((line) => {
        for (let i = 0; i < line.length - 1; i++) {
          expect(line[i].coord.q).toBeLessThan(line[i + 1].coord.q);
        }
      });
    });
  });
});
