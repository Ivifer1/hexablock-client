import type { IRandom } from './irandom';

/**
 * SeededRandom is a pure domain service implementation of IRandom
 * based on the 32-bit Mulberry32 pseudo-random number generator algorithm.
 *
 * Characteristics:
 * - 100% deterministic given the same initial seed (NFR-001).
 * - Zero external npm or platform dependencies (pure TypeScript).
 * - Fast 32-bit integer arithmetic with bitwise operators.
 * - Single 32-bit unsigned integer state for compact snapshotting and exact restore.
 */
export class SeededRandom implements IRandom {
  private state: number;

  public constructor(seed: number) {
    if (!Number.isFinite(seed) || !Number.isInteger(seed)) {
      throw new Error(`SeededRandom seed must be a finite integer, received: ${seed}`);
    }
    // Coerce to 32-bit unsigned integer
    this.state = seed >>> 0;
  }

  /**
   * Generates a pseudo-random floating point number in [0, 1).
   */
  public nextDouble(): number {
    this.state = (this.state + 0x6d2b79f5) >>> 0;
    let t = this.state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /**
   * Generates a pseudo-random integer index in [0, bound - 1].
   */
  public nextIndex(bound: number): number {
    if (!Number.isInteger(bound) || bound <= 0) {
      throw new Error(`nextIndex bound must be a positive integer (> 0), received: ${bound}`);
    }
    return Math.floor(this.nextDouble() * bound);
  }

  /**
   * Generates a pseudo-random integer in [min, max] (inclusive).
   */
  public nextInt(min: number, max: number): number {
    if (!Number.isInteger(min) || !Number.isInteger(max)) {
      throw new Error(`nextInt min and max must be integers, received min: ${min}, max: ${max}`);
    }
    if (min > max) {
      throw new Error(`nextInt min (${min}) cannot be greater than max (${max})`);
    }
    const range = max - min + 1;
    return min + Math.floor(this.nextDouble() * range);
  }

  /**
   * Returns the current internal 32-bit state for snapshotting.
   */
  public snapshot(): number {
    return this.state;
  }

  /**
   * Restores a previously captured PRNG state.
   */
  public restore(state: number): void {
    if (!Number.isFinite(state) || !Number.isInteger(state)) {
      throw new Error(`restore state must be a finite integer, received: ${state}`);
    }
    this.state = state >>> 0;
  }
}
