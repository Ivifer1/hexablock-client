import type { IPieceSource } from './ipiece-source';

/**
 * PredefinedPieceSource supplies a fixed, finite sequence of pieces
 * in predetermined order without randomness.
 *
 * Use cases:
 * - Puzzle/level variants like Hexa Fit (FR-008) where pieces are specified by level design.
 * - Deterministic unit testing scenarios where specific piece sequences are asserted.
 */
export class PredefinedPieceSource<TPiece> implements IPieceSource<TPiece> {
  private readonly pieces: readonly TPiece[];
  private currentIndex = 0;

  public constructor(pieces: readonly TPiece[]) {
    this.pieces = Object.freeze([...pieces]);
  }

  /**
   * Returns true if there are remaining pieces in the sequence.
   */
  public hasNext(): boolean {
    return this.currentIndex < this.pieces.length;
  }

  /**
   * Returns the next piece in the predetermined sequence.
   *
   * @throws Error if the source has been exhausted.
   */
  public next(): TPiece {
    if (!this.hasNext()) {
      throw new Error('PredefinedPieceSource has exhausted all available pieces');
    }
    const piece = this.pieces[this.currentIndex];
    this.currentIndex += 1;
    return piece;
  }

  /**
   * Returns the number of unconsumed pieces remaining in the source.
   */
  public get remainingCount(): number {
    return Math.max(0, this.pieces.length - this.currentIndex);
  }
}
