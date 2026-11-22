import { HexCoord } from './hex-coord';

/**
 * BoardShape (Value Object & Factory - DDD)
 *
 * Represents an immutable set of valid coordinates that define the boundary and playable
 * cells of a game board.
 *
 * Invariants:
 * - A hexagonal shape must have an integer radius >= 0.
 * - An arbitrary shape must contain at least one coordinate.
 * - Coordinates are deduplicated and immutable.
 */
export class BoardShape {
  private readonly _coordsByKey: ReadonlyMap<string, HexCoord>;
  private readonly _coordsList: readonly HexCoord[];
  public readonly radius?: number;

  private constructor(coords: readonly HexCoord[], radius?: number) {
    const map = new Map<string, HexCoord>();
    for (const coord of coords) {
      if (!map.has(coord.key)) {
        map.set(coord.key, coord);
      }
    }
    this._coordsByKey = map;
    this._coordsList = Object.freeze(Array.from(map.values()));
    this.radius = radius;
    Object.freeze(this);
  }

  /**
   * Domain Factory: creates a standard regular hexagonal board shape centered at (0, 0).
   * Formula: cellCount = 3 * R * (R + 1) + 1
   * - Radius 2: 19 cells (Hexa Sort, Hexa Merge)
   * - Radius 4: 61 cells (Hexa Lines)
   */
  public static hexagonal(radius: number): BoardShape {
    if (!Number.isInteger(radius) || radius < 0) {
      throw new Error(`BoardShape radius must be a positive integer or zero (non-negative). Received: ${radius}`);
    }

    const coords: HexCoord[] = [];
    for (let q = -radius; q <= radius; q++) {
      const r1 = Math.max(-radius, -q - radius);
      const r2 = Math.min(radius, -q + radius);
      for (let r = r1; r <= r2; r++) {
        coords.push(new HexCoord(q, r));
      }
    }

    return new BoardShape(coords, radius);
  }

  /**
   * Domain Factory: creates an arbitrary shape from a collection of coordinates (e.g. Hexa Fit puzzles).
   */
  public static fromCoords(coords: Iterable<HexCoord>): BoardShape {
    const list = Array.from(coords);
    if (list.length === 0) {
      throw new Error('BoardShape coordinates collection cannot be empty.');
    }
    return new BoardShape(list);
  }

  /**
   * Total number of valid cells inside this board shape.
   */
  public get cellCount(): number {
    return this._coordsByKey.size;
  }

  /**
   * Checks whether a coordinate is valid and contained within this board shape.
   */
  public contains(coord: HexCoord | null | undefined): boolean {
    if (!coord) return false;
    return this._coordsByKey.has(coord.key);
  }

  /**
   * Returns a copy of all valid coordinates in this board shape.
   */
  public allCoords(): HexCoord[] {
    return [...this._coordsList];
  }
}
