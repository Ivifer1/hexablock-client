import type { IRandom } from '../random/irandom';
import type { IPieceSource } from './ipiece-source';

/**
 * RandomPieceSource supplies pieces pseudo-randomly from a candidate pool
 * using an injected IRandom strategy.
 *
 * Characteristics:
 * - Strategy implementation of IPieceSource.
 * - Potentially infinite source as long as candidates pool is non-empty.
 * - Deterministic and reproducible when paired with SeededRandom (NFR-001).
 */
export class RandomPieceSource<TPiece> implements IPieceSource<TPiece> {
  private readonly candidates: readonly TPiece[];
  private readonly random: IRandom;

  public constructor(candidates: readonly TPiece[], random: IRandom) {
    if (!candidates || candidates.length === 0) {
      throw new Error('RandomPieceSource requires a non-empty array of candidate pieces');
    }
    this.candidates = Object.freeze([...candidates]);
    this.random = random;
  }

  /**
   * Always true for a non-empty candidate pool.
   */
  public hasNext(): boolean {
    return this.candidates.length > 0;
  }

  /**
   * Draws a random piece from candidates using the injected IRandom.
   */
  public next(): TPiece {
    if (!this.hasNext()) {
      throw new Error('Cannot retrieve next piece: candidate pool is empty');
    }
    const index = this.random.nextIndex(this.candidates.length);
    return this.candidates[index];
  }
}
