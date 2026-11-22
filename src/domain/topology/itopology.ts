import { HexDirection } from './hex-direction';

/**
 * ITopology<TCoord> (Domain Strategy / Abstraction)
 *
 * Defines the generic interface contract for spatial navigation, neighbor queries,
 * distance metrics, and line projection across a board topology.
 */
export interface ITopology<TCoord> {
  /**
   * Returns all direct adjacent neighbors of the given coordinate.
   */
  getNeighbors(coord: TCoord): readonly TCoord[];

  /**
   * Returns the neighbor in a specific direction.
   */
  getNeighbor(coord: TCoord, direction: HexDirection): TCoord;

  /**
   * Calculates the grid distance between two coordinates.
   */
  getDistance(a: TCoord, b: TCoord): number;

  /**
   * Checks whether two coordinates are immediate adjacent neighbors.
   */
  areNeighbors(a: TCoord, b: TCoord): boolean;

  /**
   * Projects a straight line of coordinates starting from an origin in a given direction.
   */
  getLine(origin: TCoord, direction: HexDirection, length: number): readonly TCoord[];

  /**
   * Rotates a coordinate around the origin (0, 0) by steps of 60 degrees.
   */
  rotate60(coord: TCoord, steps: number): TCoord;
}
