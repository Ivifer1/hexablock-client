import { HexCoord } from './hex-coord';

/**
 * HexDirection (Value Object / Domain Enum)
 *
 * Represents one of the 6 hexagonal neighbor directions on a grid.
 * Ordered in a 60-degree cyclical progression:
 * EAST -> NORTHEAST -> NORTHWEST -> WEST -> SOUTHWEST -> SOUTHEAST
 */
export enum HexDirection {
  EAST = 'EAST',
  NORTHEAST = 'NORTHEAST',
  NORTHWEST = 'NORTHWEST',
  WEST = 'WEST',
  SOUTHWEST = 'SOUTHWEST',
  SOUTHEAST = 'SOUTHEAST',
}

/**
 * HexAxis (Value Object / Domain Enum)
 *
 * Represents one of the 3 line axes of a hexagonal grid.
 * - Q_AXIS: Constant r line (e.g. EAST / WEST).
 * - R_AXIS: Constant q line (e.g. NORTHWEST / SOUTHEAST).
 * - S_AXIS: Constant q + r line (e.g. NORTHEAST / SOUTHWEST).
 */
export enum HexAxis {
  Q_AXIS = 'Q_AXIS',
  R_AXIS = 'R_AXIS',
  S_AXIS = 'S_AXIS',
}

const DIRECTION_CYCLE: readonly HexDirection[] = Object.freeze([
  HexDirection.EAST,
  HexDirection.NORTHEAST,
  HexDirection.NORTHWEST,
  HexDirection.WEST,
  HexDirection.SOUTHWEST,
  HexDirection.SOUTHEAST,
]);

const DIRECTION_OFFSETS: Readonly<Record<HexDirection, HexCoord>> = Object.freeze({
  [HexDirection.EAST]: new HexCoord(1, 0),
  [HexDirection.NORTHEAST]: new HexCoord(1, -1),
  [HexDirection.NORTHWEST]: new HexCoord(0, -1),
  [HexDirection.WEST]: new HexCoord(-1, 0),
  [HexDirection.SOUTHWEST]: new HexCoord(-1, 1),
  [HexDirection.SOUTHEAST]: new HexCoord(0, 1),
});

const DIRECTION_OPPOSITES: Readonly<Record<HexDirection, HexDirection>> = Object.freeze({
  [HexDirection.EAST]: HexDirection.WEST,
  [HexDirection.WEST]: HexDirection.EAST,
  [HexDirection.NORTHEAST]: HexDirection.SOUTHWEST,
  [HexDirection.SOUTHWEST]: HexDirection.NORTHEAST,
  [HexDirection.NORTHWEST]: HexDirection.SOUTHEAST,
  [HexDirection.SOUTHEAST]: HexDirection.NORTHWEST,
});

const DIRECTION_AXES: Readonly<Record<HexDirection, HexAxis>> = Object.freeze({
  [HexDirection.EAST]: HexAxis.Q_AXIS,
  [HexDirection.WEST]: HexAxis.Q_AXIS,
  [HexDirection.NORTHWEST]: HexAxis.R_AXIS,
  [HexDirection.SOUTHEAST]: HexAxis.R_AXIS,
  [HexDirection.NORTHEAST]: HexAxis.S_AXIS,
  [HexDirection.SOUTHWEST]: HexAxis.S_AXIS,
});

/**
 * Domain service helpers for HexDirection calculations.
 */
export class HexDirections {
  public static readonly ALL: readonly HexDirection[] = DIRECTION_CYCLE;

  public static toOffset(direction: HexDirection): HexCoord {
    return DIRECTION_OFFSETS[direction];
  }

  public static opposite(direction: HexDirection): HexDirection {
    return DIRECTION_OPPOSITES[direction];
  }

  public static getAxis(direction: HexDirection): HexAxis {
    return DIRECTION_AXES[direction];
  }

  public static rotate(direction: HexDirection, steps: number): HexDirection {
    const currentIndex = DIRECTION_CYCLE.indexOf(direction);
    const normalizedSteps = ((steps % 6) + 6) % 6;
    const newIndex = (currentIndex + normalizedSteps) % 6;
    return DIRECTION_CYCLE[newIndex];
  }
}
