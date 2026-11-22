import { HexCoord } from './hex-coord';
import { HexDirection, HexDirections } from './hex-direction';
import { ITopology } from './itopology';

/**
 * HexTopology (Domain Service & Strategy - DDD)
 *
 * Implements ITopology<HexCoord> for mathematical calculations on a hexagonal grid.
 * Provides distance, neighbor queries, line projections, and 60-degree rotations.
 */
export class HexTopology implements ITopology<HexCoord> {
  /**
   * Returns all 6 immediate neighbors of a coordinate.
   */
  public getNeighbors(coord: HexCoord): readonly HexCoord[] {
    return HexDirections.ALL.map((dir) => this.getNeighbor(coord, dir));
  }

  /**
   * Returns the adjacent neighbor in the specified HexDirection.
   */
  public getNeighbor(coord: HexCoord, direction: HexDirection): HexCoord {
    const offset = HexDirections.toOffset(direction);
    return coord.add(offset);
  }

  /**
   * Calculates the hexagonal Manhattan distance between two cells.
   * Formula: (|dq| + |dr| + |ds|) / 2
   */
  public getDistance(a: HexCoord, b: HexCoord): number {
    const dq = Math.abs(a.q - b.q);
    const dr = Math.abs(a.r - b.r);
    const ds = Math.abs(a.s - b.s);
    return (dq + dr + ds) / 2;
  }

  /**
   * Checks whether two coordinates are adjacent neighbors (distance === 1).
   */
  public areNeighbors(a: HexCoord, b: HexCoord): boolean {
    return this.getDistance(a, b) === 1;
  }

  /**
   * Generates a straight line of coordinates starting at origin extending in direction.
   */
  public getLine(origin: HexCoord, direction: HexDirection, length: number): readonly HexCoord[] {
    if (length <= 0) return [];
    const offset = HexDirections.toOffset(direction);
    const line: HexCoord[] = [];
    for (let i = 0; i < length; i++) {
      line.push(origin.add(offset.scale(i)));
    }
    return Object.freeze(line);
  }

  /**
   * Rotates a hexagonal coordinate around (0, 0) in steps of 60 degrees.
   * Positive steps rotate clockwise; negative steps rotate counter-clockwise.
   */
  public rotate60(coord: HexCoord, steps: number): HexCoord {
    const normalizedSteps = ((steps % 6) + 6) % 6;
    let { q, r } = coord;

    for (let i = 0; i < normalizedSteps; i++) {
      // 60-degree clockwise step: (q, r, s) -> (-s, -q, -r) = (q + r, -q, r)
      const nextQ = q + r;
      const nextR = -q;
      q = nextQ;
      r = nextR;
    }

    return new HexCoord(q, r);
  }
}
