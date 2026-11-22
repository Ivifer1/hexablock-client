import { HexCoord } from '../../../src/domain/topology/hex-coord';
import {
  HexDirection,
  HexDirections,
  HexAxis,
} from '../../../src/domain/topology/hex-direction';
import { HexTopology } from '../../../src/domain/topology/hex-topology';

describe('HexTopology (Domain Service & Strategy)', () => {
  let topology: HexTopology;

  beforeEach(() => {
    topology = new HexTopology();
  });

  describe('directions and orientation', () => {
    it('should_provide_six_distinct_unit_directions_when_querying_hex_directions', () => {
      // Act
      const directions = HexDirections.ALL;

      // Assert
      expect(directions).toHaveLength(6);
      const keys = directions.map((d) => HexDirections.toOffset(d).key);
      const uniqueKeys = new Set(keys);
      expect(uniqueKeys.size).toBe(6);
    });

    it('should_return_opposite_direction_when_inverting_direction', () => {
      // Arrange & Act & Assert
      expect(HexDirections.opposite(HexDirection.EAST)).toBe(HexDirection.WEST);
      expect(HexDirections.opposite(HexDirection.WEST)).toBe(HexDirection.EAST);
      expect(HexDirections.opposite(HexDirection.NORTHEAST)).toBe(HexDirection.SOUTHWEST);
      expect(HexDirections.opposite(HexDirection.SOUTHWEST)).toBe(HexDirection.NORTHEAST);
      expect(HexDirections.opposite(HexDirection.NORTHWEST)).toBe(HexDirection.SOUTHEAST);
      expect(HexDirections.opposite(HexDirection.SOUTHEAST)).toBe(HexDirection.NORTHWEST);
    });
  });

  describe('rotations (60-degree increments)', () => {
    it('should_rotate_sixty_degrees_clockwise_and_counter_clockwise_when_rotating_coords', () => {
      // Arrange
      const start = new HexCoord(1, 0); // East unit vector

      // Act: 60° CW rotation: (q, r, s) -> (-s, -q, -r) = (q+r, -q)
      const rotatedCW = topology.rotate60(start, 1);
      const rotatedCCW = topology.rotate60(start, -1);

      // Assert
      // (1, 0) rotated 60° CW should land on (1, -1) [Northeast] or (0, 1) [Southeast] depending on convention.
      // Standard clockwise convention: (q, r) -> (q+r, -q) => (1+0, -1) = (1, -1) [Northeast]
      expect(rotatedCW.q).toBe(1);
      expect(rotatedCW.r).toBe(-1);

      // 6 full 60° steps CW brings it back to start
      const fullCircle = topology.rotate60(start, 6);
      expect(fullCircle.equals(start)).toBe(true);

      // 1 step CCW is 5 steps CW
      expect(rotatedCCW.equals(topology.rotate60(start, 5))).toBe(true);
    });

    it('should_preserve_distance_to_origin_when_rotated', () => {
      // Arrange
      const coord = new HexCoord(3, -2);
      const initialDistance = topology.getDistance(HexCoord.ORIGIN, coord);

      // Act
      for (let step = 1; step <= 6; step++) {
        const rotated = topology.rotate60(coord, step);
        const dist = topology.getDistance(HexCoord.ORIGIN, rotated);
        // Assert
        expect(dist).toBe(initialDistance);
      }
    });
  });

  describe('distance and neighborhood', () => {
    it('should_calculate_manhattan_distance_correctly_when_measuring_between_cells', () => {
      // Arrange
      const origin = HexCoord.ORIGIN;
      const neighbor = new HexCoord(1, 0);
      const far = new HexCoord(3, -3);

      // Act & Assert
      expect(topology.getDistance(origin, origin)).toBe(0);
      expect(topology.getDistance(origin, neighbor)).toBe(1);
      expect(topology.getDistance(neighbor, origin)).toBe(1); // symmetry
      expect(topology.getDistance(origin, far)).toBe(3);
    });

    it('should_return_six_neighbors_when_querying_interior_hex_coordinate', () => {
      // Arrange
      const center = new HexCoord(1, 2);

      // Act
      const neighbors = topology.getNeighbors(center);

      // Assert
      expect(neighbors).toHaveLength(6);
      neighbors.forEach((n) => {
        expect(topology.getDistance(center, n)).toBe(1);
        expect(topology.areNeighbors(center, n)).toBe(true);
      });
    });

    it('should_get_specific_neighbor_when_direction_provided', () => {
      // Arrange
      const center = new HexCoord(0, 0);

      // Act
      const east = topology.getNeighbor(center, HexDirection.EAST);
      const northwest = topology.getNeighbor(center, HexDirection.NORTHWEST);

      // Assert
      expect(east.equals(new HexCoord(1, 0))).toBe(true);
      expect(northwest.equals(new HexCoord(0, -1))).toBe(true);
    });
  });

  describe('line projection (for 3 axes)', () => {
    it('should_generate_straight_lines_along_each_of_the_three_axes_when_projecting_rays', () => {
      // Arrange
      const start = HexCoord.ORIGIN;

      // Act: line of 4 cells heading EAST (Q axis line, constant r = 0)
      const lineEast = topology.getLine(start, HexDirection.EAST, 4);

      // Assert
      expect(lineEast).toHaveLength(4);
      expect(lineEast[0].equals(new HexCoord(0, 0))).toBe(true);
      expect(lineEast[1].equals(new HexCoord(1, 0))).toBe(true);
      expect(lineEast[2].equals(new HexCoord(2, 0))).toBe(true);
      expect(lineEast[3].equals(new HexCoord(3, 0))).toBe(true);

      // Verify all have constant r = 0 (Q axis)
      expect(lineEast.every((c) => c.r === 0)).toBe(true);
    });

    it('should_classify_lines_into_the_three_hex_axes', () => {
      // Arrange & Act & Assert
      expect(HexDirections.getAxis(HexDirection.EAST)).toBe(HexAxis.Q_AXIS);
      expect(HexDirections.getAxis(HexDirection.WEST)).toBe(HexAxis.Q_AXIS);

      expect(HexDirections.getAxis(HexDirection.NORTHWEST)).toBe(HexAxis.R_AXIS);
      expect(HexDirections.getAxis(HexDirection.SOUTHEAST)).toBe(HexAxis.R_AXIS);

      expect(HexDirections.getAxis(HexDirection.NORTHEAST)).toBe(HexAxis.S_AXIS);
      expect(HexDirections.getAxis(HexDirection.SOUTHWEST)).toBe(HexAxis.S_AXIS);
    });
  });
});
