import { HexCoord } from '../../../src/domain/topology/hex-coord';
import { BoardShape } from '../../../src/domain/topology/board-shape';

describe('BoardShape (Value Object)', () => {
  describe('standard hexagonal boards', () => {
    it('should_generate_exactly_1_cell_when_creating_radius_0_hexagonal_shape', () => {
      // Act
      const shape = BoardShape.hexagonal(0);

      // Assert
      expect(shape.cellCount).toBe(1);
      expect(shape.contains(HexCoord.ORIGIN)).toBe(true);
      expect(shape.contains(new HexCoord(1, 0))).toBe(false);
    });

    it('should_generate_exactly_19_cells_when_creating_radius_2_hexagonal_shape', () => {
      // Act (FR-014, FR-019: Sort and Merge use radius 2 = 19 cells)
      const shape = BoardShape.hexagonal(2);

      // Assert: Formula for hex of radius R: 3 * R * (R + 1) + 1 => 3 * 2 * 3 + 1 = 19
      expect(shape.cellCount).toBe(19);
      expect(shape.radius).toBe(2);

      // Origin and extremes are inside
      expect(shape.contains(HexCoord.ORIGIN)).toBe(true);
      expect(shape.contains(new HexCoord(2, 0))).toBe(true);
      expect(shape.contains(new HexCoord(0, -2))).toBe(true);
      expect(shape.contains(new HexCoord(-2, 2))).toBe(true);

      // Outside radius 2
      expect(shape.contains(new HexCoord(3, 0))).toBe(false);
      expect(shape.contains(new HexCoord(2, 1))).toBe(false); // distance = max(|2|, |1|, |3|) = 3 > 2
    });

    it('should_generate_exactly_61_cells_when_creating_radius_4_hexagonal_shape', () => {
      // Act (FR-003: Hexa Lines uses radius 4 = 61 cells)
      const shape = BoardShape.hexagonal(4);

      // Assert: 3 * 4 * 5 + 1 = 61 cells
      expect(shape.cellCount).toBe(61);
      expect(shape.radius).toBe(4);

      expect(shape.contains(new HexCoord(4, 0))).toBe(true);
      expect(shape.contains(new HexCoord(5, 0))).toBe(false);
    });

    it('should_throw_error_when_negative_radius_provided', () => {
      // Act & Assert
      expect(() => BoardShape.hexagonal(-1)).toThrow(/radius.*positive/i);
    });
  });

  describe('custom arbitrary figures (for Hexa Fit)', () => {
    it('should_create_custom_shape_from_coordinates_when_provided', () => {
      // Arrange (A 3-cell tri-hex)
      const coords = [new HexCoord(0, 0), new HexCoord(1, 0), new HexCoord(0, 1)];

      // Act
      const shape = BoardShape.fromCoords(coords);

      // Assert
      expect(shape.cellCount).toBe(3);
      expect(shape.contains(new HexCoord(0, 0))).toBe(true);
      expect(shape.contains(new HexCoord(1, 0))).toBe(true);
      expect(shape.contains(new HexCoord(0, 1))).toBe(true);
      expect(shape.contains(new HexCoord(1, 1))).toBe(false);
    });

    it('should_deduplicate_coordinates_when_duplicates_passed', () => {
      // Arrange
      const coords = [
        new HexCoord(1, 1),
        new HexCoord(1, 1),
        new HexCoord(0, 0),
      ];

      // Act
      const shape = BoardShape.fromCoords(coords);

      // Assert
      expect(shape.cellCount).toBe(2);
    });

    it('should_throw_error_when_empty_coordinates_array_provided', () => {
      // Act & Assert
      expect(() => BoardShape.fromCoords([])).toThrow(/empty/i);
    });
  });

  describe('immutability and iteration', () => {
    it('should_be_immutable_and_prevent_external_modification_when_shape_created', () => {
      // Arrange
      const shape = BoardShape.hexagonal(1);

      // Act
      const coords = shape.allCoords();

      // Assert: coordinates array should be a copy or readonly
      expect(coords).toHaveLength(7);
      coords.push(new HexCoord(99, 99)); // mutating local array
      expect(shape.cellCount).toBe(7); // internal shape remains 7
      expect(shape.contains(new HexCoord(99, 99))).toBe(false);
    });
  });
});
