/**
 * ITopology<TCoord, TDirection> (Domain Strategy / Abstraction - GoF & DDD)
 *
 * Defines the generic interface contract for spatial navigation, neighbor queries,
 * distance metrics, and line projection across ANY regular or irregular grid topology
 * (e.g. Hexagonal, Triangular, Square).
 *
 * Extensibility:
 * - Hexagonal: ITopology<HexCoord, HexDirection> (6 neighbors, 3 axes, 60° rotation steps)
 * - Triangular: ITopology<TriangleCoord, TriangleDirection> (3 edge neighbors, 120° rotation steps)
 * - Square: ITopology<SquareCoord, SquareDirection> (4 neighbors, 2 axes, 90° rotation steps)
 */
export interface ITopology<TCoord, TDirection = any> {
  /**
   * Returns all direct adjacent neighbors of the given coordinate.
   */
  getNeighbors(coord: TCoord): readonly TCoord[];

  /**
   * Returns the neighbor in a specific topology direction.
   */
  getNeighbor(coord: TCoord, direction: TDirection): TCoord;

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
  getLine(origin: TCoord, direction: TDirection, length: number): readonly TCoord[];

  /**
   * Rotates a coordinate around the origin (0, 0) by discrete angular steps
   * (e.g. 60° for hex, 90° for square, 120° for triangle).
   */
  rotate(coord: TCoord, steps: number): TCoord;

  /**
   * Hexagonal convenience alias for 60-degree rotation.
   */
  rotate60?(coord: TCoord, steps: number): TCoord;
}
