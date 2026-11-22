/**
 * FakeCell (Test Double)
 *
 * Neutral dummy cell type used exclusively in engine unit tests to prove
 * that HexBoard<TCell> and generic engine components do not depend on
 * any of the four concrete game variants.
 */
export interface FakeCell {
  readonly id: string;
  readonly value: number;
  readonly tag?: string;
}

export function createFakeCell(id: string, value = 1, tag?: string): FakeCell {
  return Object.freeze({ id, value, tag });
}
