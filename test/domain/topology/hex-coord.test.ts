import { HexCoord } from '../../../src/domain/topology/hex-coord';

describe('HexCoord (Value Object)', () => {
  describe('creation and properties', () => {
    it('should_store_axial_coordinates_and_calculate_cubic_s_when_created', () => {
      // Arrange & Act
      const coord = new HexCoord(2, -3);

      // Assert
      expect(coord.q).toBe(2);
      expect(coord.r).toBe(-3);
      // In cubic coordinates: q + r + s = 0 => s = -q - r = -(2 + -3) = 1
      expect(coord.s).toBe(1);
      expect(coord.q + coord.r + coord.s).toBe(0);
    });

    it('should_provide_origin_constant_at_zero_zero', () => {
      // Arrange & Act
      const origin = HexCoord.ORIGIN;

      // Assert
      expect(origin.q).toBe(0);
      expect(origin.r).toBe(0);
      expect(origin.s).toBe(0);
      expect(origin.key).toBe('0,0');
    });

    it('should_generate_unique_string_key_when_serialized', () => {
      // Arrange
      const coord1 = new HexCoord(1, -2);
      const coord2 = new HexCoord(-1, 2);

      // Act & Assert
      expect(coord1.key).toBe('1,-2');
      expect(coord2.key).toBe('-1,2');
      expect(coord1.key).not.toBe(coord2.key);
    });
  });

  describe('equality and comparison', () => {
    it('should_return_equal_for_same_coordinates_and_distinct_key_when_compared', () => {
      // Arrange
      const coordA = new HexCoord(3, -1);
      const coordB = new HexCoord(3, -1);
      const coordC = new HexCoord(1, 3);

      // Act & Assert
      expect(coordA.equals(coordB)).toBe(true);
      expect(coordB.equals(coordA)).toBe(true);
      expect(coordA.equals(coordC)).toBe(false);
    });
  });

  describe('arithmetic operations', () => {
    it('should_add_coordinates_correctly_when_offset_applied', () => {
      // Arrange
      const a = new HexCoord(2, -1);
      const b = new HexCoord(-1, 3);

      // Act
      const result = a.add(b);

      // Assert
      expect(result.q).toBe(1);
      expect(result.r).toBe(2);
      expect(result.s).toBe(-3);
    });

    it('should_subtract_coordinates_correctly_when_difference_computed', () => {
      // Arrange
      const a = new HexCoord(4, -2);
      const b = new HexCoord(1, 1);

      // Act
      const result = a.subtract(b);

      // Assert
      expect(result.q).toBe(3);
      expect(result.r).toBe(-3);
      expect(result.s).toBe(0);
    });

    it('should_scale_coordinates_correctly_when_multiplied_by_factor', () => {
      // Arrange
      const coord = new HexCoord(1, -2);

      // Act
      const scaled = coord.scale(3);

      // Assert
      expect(scaled.q).toBe(3);
      expect(scaled.r).toBe(-6);
      expect(scaled.s).toBe(3);
    });
  });
});
