import { IBoardShape } from '../topology/board-shape';
import { HexCoord } from '../topology/hex-coord';
import { HexAxis, HexDirection } from '../topology/hex-direction';
import { HexTopology } from '../topology/hex-topology';
import { ITopology } from '../topology/itopology';

/**
 * BoardCellEntry<TCell> (Value Object)
 *
 * Represents an occupied cell with its coordinate and content payload.
 */
export interface BoardCellEntry<TCell> {
  readonly coord: HexCoord;
  readonly content: TCell;
}

/**
 * BoardCellQuery<TCell> (Value Object)
 *
 * Represents a queried cell on the board, whether empty or occupied.
 */
export interface BoardCellQuery<TCell> {
  readonly coord: HexCoord;
  readonly content: TCell | undefined;
}

/**
 * HexBoard<TCell> (Aggregate Root & Entity - DDD)
 *
 * Manages an immutable hexagonal game board containing generic cell payloads of type TCell.
 * Protects 5 core domain invariants:
 * 1. Spatial boundary containment against IBoardShape.
 * 2. Mathematical occupancy consistency (occupiedCount + emptyCount = cellCount).
 * 3. Strict immutability and transactional snapshots for Undo/Redo.
 * 4. Confined, sorted spatial line extractions on the 3 hex axes (Q, R, S).
 * 5. Complete variant agnosticism via bounded generic TCell.
 */
export class HexBoard<TCell> {
  public readonly shape: IBoardShape<HexCoord>;
  public readonly topology: ITopology<HexCoord, HexDirection>;
  private readonly _cells: ReadonlyMap<string, TCell>;

  constructor(
    shape: IBoardShape<HexCoord>,
    cells?: ReadonlyMap<string, TCell> | Iterable<[string, TCell]>,
    topology: ITopology<HexCoord, HexDirection> = new HexTopology(),
  ) {
    this.shape = shape;
    this.topology = topology;

    const cellMap = new Map<string, TCell>(cells ? (cells instanceof Map ? cells : Array.from(cells)) : []);

    // Validate that all initial cells are within the board shape
    for (const key of cellMap.keys()) {
      const parts = key.split(',').map(Number);
      const coord = new HexCoord(parts[0], parts[1]);
      if (!this.shape.contains(coord)) {
        throw new Error(
          `Cannot create HexBoard: cell coordinate ${coord.toString()} is outside the board shape.`,
        );
      }
    }

    this._cells = Object.freeze(cellMap);
    Object.freeze(this);
  }

  /**
   * Total playable cells within the board shape.
   */
  public get cellCount(): number {
    return this.shape.cellCount;
  }

  /**
   * Number of currently occupied cells on the board.
   */
  public get occupiedCount(): number {
    return this._cells.size;
  }

  /**
   * Number of empty cells remaining on the board.
   */
  public get emptyCount(): number {
    return this.cellCount - this.occupiedCount;
  }

  /**
   * Checks whether the given coordinate exists within the board boundaries.
   */
  public hasCell(coord: HexCoord | null | undefined): boolean {
    if (!coord) return false;
    return this.shape.contains(coord);
  }

  /**
   * Retrieves the content payload of a cell, or undefined if empty or out of bounds.
   */
  public getCell(coord: HexCoord): TCell | undefined {
    return this._cells.get(coord.key);
  }

  /**
   * Checks if a cell is inside the board and occupied by content.
   */
  public isOccupied(coord: HexCoord): boolean {
    return this.hasCell(coord) && this._cells.has(coord.key);
  }

  /**
   * Checks if a cell is inside the board and empty.
   */
  public isEmpty(coord: HexCoord): boolean {
    return this.hasCell(coord) && !this._cells.has(coord.key);
  }

  /**
   * Checks whether all playable cells on the board are occupied.
   */
  public isFull(): boolean {
    return this.occupiedCount === this.cellCount;
  }

  /**
   * Returns all occupied cell entries as a readonly array.
   */
  public getOccupiedCells(): readonly BoardCellEntry<TCell>[] {
    const entries: BoardCellEntry<TCell>[] = [];
    for (const [key, content] of this._cells.entries()) {
      const parts = key.split(',').map(Number);
      entries.push({
        coord: new HexCoord(parts[0], parts[1]),
        content,
      });
    }
    return Object.freeze(entries);
  }

  /**
   * Returns all unoccupied coordinates as a readonly array.
   */
  public getEmptyCoords(): readonly HexCoord[] {
    const all = this.shape.allCoords();
    const empty = all.filter((coord) => !this._cells.has(coord.key));
    return Object.freeze(empty);
  }

  /**
   * Places a cell payload at a coordinate, returning a new immutable HexBoard instance.
   * Throws a domain error if the coordinate is outside the board shape.
   */
  public setCell(coord: HexCoord, content: TCell): HexBoard<TCell> {
    if (!this.hasCell(coord)) {
      throw new Error(
        `Cannot place cell: coordinate ${coord.toString()} is outside the board shape.`,
      );
    }

    const nextMap = new Map<string, TCell>(this._cells);
    nextMap.set(coord.key, content);
    return new HexBoard<TCell>(this.shape, nextMap, this.topology);
  }

  /**
   * Removes the content at a coordinate, returning a new immutable HexBoard instance.
   */
  public clearCell(coord: HexCoord): HexBoard<TCell> {
    if (!this._cells.has(coord.key)) {
      return this;
    }

    const nextMap = new Map<string, TCell>(this._cells);
    nextMap.delete(coord.key);
    return new HexBoard<TCell>(this.shape, nextMap, this.topology);
  }

  /**
   * Sets multiple cells atomically, returning a new immutable HexBoard instance.
   */
  public setCells(entries: Iterable<[HexCoord, TCell]>): HexBoard<TCell> {
    const nextMap = new Map<string, TCell>(this._cells);
    for (const [coord, content] of entries) {
      if (!this.hasCell(coord)) {
        throw new Error(
          `Cannot place cell: coordinate ${coord.toString()} is outside the board shape.`,
        );
      }
      nextMap.set(coord.key, content);
    }
    return new HexBoard<TCell>(this.shape, nextMap, this.topology);
  }

  /**
   * Clears all occupied cells, returning a new empty HexBoard instance.
   */
  public clear(): HexBoard<TCell> {
    if (this._cells.size === 0) {
      return this;
    }
    return new HexBoard<TCell>(this.shape, new Map(), this.topology);
  }

  /**
   * Extracts a straight line of cells from an origin heading in direction until the board boundary.
   */
  public getLine(origin: HexCoord, direction: HexDirection): readonly BoardCellQuery<TCell>[] {
    if (!this.hasCell(origin)) return [];

    const line: BoardCellQuery<TCell>[] = [];
    let current = origin;
    while (this.hasCell(current)) {
      line.push({
        coord: current,
        content: this.getCell(current),
      });
      current = this.topology.getNeighbor(current, direction);
    }
    return Object.freeze(line);
  }

  /**
   * Extracts all parallel lines across the board on the specified HexAxis (Q, R, or S).
   * Used by game rules strategies (e.g. Hexa Lines line clearance and combo detection).
   */
  public getLinesOnAxis(axis: HexAxis): readonly (readonly BoardCellQuery<TCell>[])[] {
    const allCoords = this.shape.allCoords();
    const grouped = new Map<number, HexCoord[]>();

    for (const coord of allCoords) {
      let groupKey: number;
      switch (axis) {
        case HexAxis.Q_AXIS:
          groupKey = coord.r; // Constant r line
          break;
        case HexAxis.R_AXIS:
          groupKey = coord.q; // Constant q line
          break;
        case HexAxis.S_AXIS:
          groupKey = coord.s; // Constant s line
          break;
      }

      const existing = grouped.get(groupKey);
      if (existing) {
        existing.push(coord);
      } else {
        grouped.set(groupKey, [coord]);
      }
    }

    // Sort line groups by axis key
    const sortedGroupKeys = Array.from(grouped.keys()).sort((a, b) => a - b);

    const result: (readonly BoardCellQuery<TCell>[])[] = [];

    for (const key of sortedGroupKeys) {
      const coordsInLine = grouped.get(key)!;

      // Sort coordinates spatially within the line
      coordsInLine.sort((a, b) => {
        if (axis === HexAxis.Q_AXIS) return a.q - b.q;
        if (axis === HexAxis.R_AXIS) return a.r - b.r;
        return a.q - b.q; // S_AXIS
      });

      const lineQueries: BoardCellQuery<TCell>[] = coordsInLine.map((coord) => ({
        coord,
        content: this.getCell(coord),
      }));

      result.push(Object.freeze(lineQueries));
    }

    return Object.freeze(result);
  }
}
