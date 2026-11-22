import { HexBoard } from '../../src/domain/board/hex-board';
import { BoardShape } from '../../src/domain/topology/board-shape';
import { HexCoord } from '../../src/domain/topology/hex-coord';
import { FakeCell, createFakeCell } from './fake-cell';

/**
 * BoardMother (Object Mother / Test Data Builder)
 *
 * Centralizes creation of HexBoard instances in unit tests so that changes
 * to constructors never break multiple test files.
 */
export class BoardMother {
  /**
   * Creates an empty radius 2 board (19 cells) as used in Hexa Sort and Hexa Merge.
   */
  public static aRadius2Board<T = FakeCell>(): HexBoard<T> {
    return new HexBoard<T>(BoardShape.hexagonal(2));
  }

  /**
   * Creates an empty radius 4 board (61 cells) as used in Hexa Lines.
   */
  public static aRadius4Board<T = FakeCell>(): HexBoard<T> {
    return new HexBoard<T>(BoardShape.hexagonal(4));
  }

  /**
   * Creates an arbitrary custom board from given coordinates (for Hexa Fit testing).
   */
  public static aCustomBoard<T = FakeCell>(coords: HexCoord[]): HexBoard<T> {
    return new HexBoard<T>(BoardShape.fromCoords(coords));
  }

  /**
   * Creates a radius 2 board pre-populated with FakeCells.
   */
  public static aPopulatedRadius2Board(): HexBoard<FakeCell> {
    let board = BoardMother.aRadius2Board<FakeCell>();
    const coords = board.shape.allCoords();
    for (let i = 0; i < coords.length; i++) {
      board = board.setCell(coords[i], createFakeCell(`cell-${i}`, i + 1));
    }
    return board;
  }
}
