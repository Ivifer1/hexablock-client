import { SeededRandom } from '../../../src/domain/random/seeded-random';
import { PredefinedPieceSource } from '../../../src/domain/pieces/predefined-piece-source';
import { RandomPieceSource } from '../../../src/domain/pieces/random-piece-source';
import { takeBatch } from '../../../src/domain/pieces/ipiece-source';

describe('Piece Sources', () => {
  describe('RandomPieceSource (C-001, FR-003, NFR-001)', () => {
    it('should_supply_pieces_randomly_from_candidates_using_random_source', () => {
      const candidates = ['piece-A', 'piece-B', 'piece-C'] as const;
      const random = new SeededRandom(12345);
      const source = new RandomPieceSource(candidates, random);

      expect(source.hasNext()).toBe(true);

      const drawn: string[] = [];
      for (let i = 0; i < 30; i++) {
        expect(source.hasNext()).toBe(true);
        drawn.push(source.next());
      }

      // Every candidate should be drawn and belong to candidates set
      const uniqueDrawn = new Set(drawn);
      expect(uniqueDrawn.size).toBe(candidates.length);
      drawn.forEach((piece) => expect(candidates).toContain(piece));
    });

    it('should_throw_when_candidate_pool_is_empty', () => {
      const random = new SeededRandom(1);
      expect(() => new RandomPieceSource([], random)).toThrow(
        'non-empty array of candidate pieces'
      );
    });
  });

  describe('PredefinedPieceSource (C-001, FR-008)', () => {
    it('should_supply_predefined_pieces_in_exact_order_and_exhaust_cleanly', () => {
      const pieces = ['tile-1', 'tile-2', 'tile-3'];
      const source = new PredefinedPieceSource(pieces);

      expect(source.remainingCount).toBe(3);
      expect(source.hasNext()).toBe(true);

      expect(source.next()).toBe('tile-1');
      expect(source.remainingCount).toBe(2);
      expect(source.hasNext()).toBe(true);

      expect(source.next()).toBe('tile-2');
      expect(source.remainingCount).toBe(1);
      expect(source.hasNext()).toBe(true);

      expect(source.next()).toBe('tile-3');
      expect(source.remainingCount).toBe(0);
      expect(source.hasNext()).toBe(false);
    });

    it('should_throw_when_predefined_source_is_exhausted', () => {
      const source = new PredefinedPieceSource(['only-one']);
      expect(source.next()).toBe('only-one');
      expect(source.hasNext()).toBe(false);
      expect(() => source.next()).toThrow('exhausted all available pieces');
    });
  });

  describe('takeBatch helper (SRP/ISP decoupling, FR-003, FR-006)', () => {
    it('should_extract_requested_batch_size_using_takeBatch_helper', () => {
      const candidates = [1, 2, 3, 4, 5];
      const random = new SeededRandom(42);
      const source = new RandomPieceSource(candidates, random);

      const batch = takeBatch(source, 3);

      expect(batch).toHaveLength(3);
      expect(Object.isFrozen(batch)).toBe(true);
      batch.forEach((num) => expect(candidates).toContain(num));
    });

    it('should_extract_partial_batch_when_source_exhausts_before_requested_count', () => {
      const source = new PredefinedPieceSource(['A', 'B']);

      const batch = takeBatch(source, 5);

      expect(batch).toEqual(['A', 'B']);
      expect(source.hasNext()).toBe(false);
    });

    it('should_return_empty_frozen_array_when_requested_count_is_zero', () => {
      const source = new PredefinedPieceSource(['X', 'Y']);

      const batch = takeBatch(source, 0);

      expect(batch).toEqual([]);
      expect(source.remainingCount).toBe(2);
    });

    it('should_throw_when_count_is_negative_or_not_an_integer', () => {
      const source = new PredefinedPieceSource([1]);

      expect(() => takeBatch(source, -1)).toThrow('non-negative integer (>= 0)');
      expect(() => takeBatch(source, 2.5)).toThrow('non-negative integer (>= 0)');
    });
  });
});
