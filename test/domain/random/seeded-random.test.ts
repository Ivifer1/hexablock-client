import { SeededRandom } from '../../../src/domain/random/seeded-random';

describe('SeededRandom', () => {
  describe('determinism (NFR-001)', () => {
    it('should_generate_identical_sequence_given_the_same_seed', () => {
      const prng1 = new SeededRandom(12345);
      const prng2 = new SeededRandom(12345);

      const sequence1 = Array.from({ length: 10 }, () => prng1.nextDouble());
      const sequence2 = Array.from({ length: 10 }, () => prng2.nextDouble());

      expect(sequence1).toEqual(sequence2);
    });

    it('should_generate_different_sequences_for_different_seeds', () => {
      const prng1 = new SeededRandom(12345);
      const prng2 = new SeededRandom(54321);

      const sequence1 = Array.from({ length: 10 }, () => prng1.nextDouble());
      const sequence2 = Array.from({ length: 10 }, () => prng2.nextDouble());

      expect(sequence1).not.toEqual(sequence2);
    });
  });

  describe('nextDouble', () => {
    it('should_generate_floats_within_zero_to_one_for_nextDouble', () => {
      const prng = new SeededRandom(42);

      for (let i = 0; i < 100; i++) {
        const val = prng.nextDouble();
        expect(val).toBeGreaterThanOrEqual(0);
        expect(val).toBeLessThan(1);
      }
    });
  });

  describe('nextIndex', () => {
    it('should_generate_integers_strictly_within_bounds_for_nextIndex', () => {
      const prng = new SeededRandom(999);
      const bound = 6;
      const seen = new Set<number>();

      for (let i = 0; i < 200; i++) {
        const idx = prng.nextIndex(bound);
        expect(Number.isInteger(idx)).toBe(true);
        expect(idx).toBeGreaterThanOrEqual(0);
        expect(idx).toBeLessThan(bound);
        seen.add(idx);
      }

      // Over 200 draws with bound 6, every index should appear
      expect(seen.size).toBe(bound);
    });

    it('should_throw_when_nextIndex_bound_is_not_a_positive_integer', () => {
      const prng = new SeededRandom(1);

      expect(() => prng.nextIndex(0)).toThrow('positive integer (> 0)');
      expect(() => prng.nextIndex(-5)).toThrow('positive integer (> 0)');
      expect(() => prng.nextIndex(3.14)).toThrow('positive integer (> 0)');
    });
  });

  describe('nextInt', () => {
    it('should_generate_integers_strictly_within_bounds_for_nextInt', () => {
      const prng = new SeededRandom(777);
      const min = -3;
      const max = 3;

      for (let i = 0; i < 100; i++) {
        const val = prng.nextInt(min, max);
        expect(Number.isInteger(val)).toBe(true);
        expect(val).toBeGreaterThanOrEqual(min);
        expect(val).toBeLessThanOrEqual(max);
      }
    });

    it('should_throw_when_min_is_greater_than_max_or_not_integers', () => {
      const prng = new SeededRandom(1);

      expect(() => prng.nextInt(10, 5)).toThrow('cannot be greater than max');
      expect(() => prng.nextInt(1.5, 5)).toThrow('must be integers');
      expect(() => prng.nextInt(1, 5.5)).toThrow('must be integers');
    });
  });

  describe('snapshot and restore (UC-003, Anti-cheat)', () => {
    it('should_reproduce_exact_same_future_numbers_after_restoring_snapshot', () => {
      const prng = new SeededRandom(8888);

      // Advance generator by 5 numbers
      for (let i = 0; i < 5; i++) {
        prng.nextDouble();
      }

      // Capture snapshot
      const snapshot = prng.snapshot();

      // Draw next 10 numbers
      const expectedFuture = Array.from({ length: 10 }, () => prng.nextDouble());

      // Advance further by 20 random numbers to simulate game progression
      for (let i = 0; i < 20; i++) {
        prng.nextDouble();
      }

      // Restore to snapshot (simulating Undo)
      prng.restore(snapshot);

      // Verify future numbers match exactly
      const restoredFuture = Array.from({ length: 10 }, () => prng.nextDouble());
      expect(restoredFuture).toEqual(expectedFuture);
    });

    it('should_throw_when_restoring_invalid_state', () => {
      const prng = new SeededRandom(1);

      expect(() => prng.restore(NaN)).toThrow('must be a finite integer');
      expect(() => prng.restore(1.23)).toThrow('must be a finite integer');
    });
  });

  describe('validation', () => {
    it('should_throw_when_constructor_seed_is_not_a_finite_integer', () => {
      expect(() => new SeededRandom(NaN)).toThrow('must be a finite integer');
      expect(() => new SeededRandom(Infinity)).toThrow('must be a finite integer');
      expect(() => new SeededRandom(2.718)).toThrow('must be a finite integer');
    });
  });
});
