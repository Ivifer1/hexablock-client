/**
 * IPieceSource represents the minimal Iterator / Strategy port
 * for supplying pieces or tiles across all game variants.
 *
 * Design principles:
 * - SRP: Strictly responsible for single-item iteration (hasNext, next).
 * - ISP: Minimal interface contract; consumers are not burdened with
 *   implementing batching or buffering logic.
 *
 * Batching logic is deliberately decoupled into the standalone pure
 * function takeBatch() to protect interface segregation.
 */
export interface IPieceSource<TPiece> {
  /**
   * Determines whether the source has any more pieces available.
   * For infinite sources (e.g. RandomPieceSource with candidates), returns true.
   * For finite sources (e.g. PredefinedPieceSource), returns false when exhausted.
   */
  hasNext(): boolean;

  /**
   * Consumes and returns the next piece from the source.
   *
   * @throws Error if hasNext() is false (source is exhausted or empty).
   */
  next(): TPiece;
}

/**
 * Pure domain utility function to consume up to count pieces from an IPieceSource
 * into an immutable array.
 *
 * Separating this function from IPieceSource preserves SRP and ISP, keeping
 * the core interface minimal while providing a standard batch extraction utility
 * for tray refill (Hexa Lines) or initial board setup (Hexa Fit).
 *
 * @param source The piece source to consume from.
 * @param count The maximum number of pieces to extract.
 * @returns A frozen array containing up to count pieces.
 * @throws Error if count is negative or not an integer.
 */
export function takeBatch<TPiece>(source: IPieceSource<TPiece>, count: number): readonly TPiece[] {
  if (!Number.isInteger(count) || count < 0) {
    throw new Error(`takeBatch count must be a non-negative integer (>= 0), received: ${count}`);
  }

  const batch: TPiece[] = [];
  for (let i = 0; i < count && source.hasNext(); i++) {
    batch.push(source.next());
  }

  return Object.freeze(batch);
}
