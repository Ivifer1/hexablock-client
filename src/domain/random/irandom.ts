/**
 * IRandom represents the domain port abstraction for deterministic
 * pseudo-random number generation.
 *
 * It decouples domain logic, scoring rules, and piece sources from
 * concrete random engines, enabling deterministic unit testing (NFR-001)
 * and reproducible game states.
 *
 * Invariants & Anti-cheat:
 * - Implementations MUST support snapshot() and restore() to enable
 *   reversible state during Undo/Redo (UC-003) and prevent save-scumming.
 */
export interface IRandom {
  /**
   * Generates a pseudo-random floating point number in [0, 1).
   */
  nextDouble(): number;

  /**
   * Generates a pseudo-random integer index in [0, bound - 1].
   * Useful for picking items from arrays.
   *
   * @param bound Strict positive upper bound (exclusive).
   * @throws Error if bound is not a positive integer (> 0).
   */
  nextIndex(bound: number): number;

  /**
   * Generates a pseudo-random integer in [min, max] (inclusive).
   *
   * @param min Inclusive minimum integer.
   * @param max Inclusive maximum integer.
   * @throws Error if min > max or if bounds are not integers.
   */
  nextInt(min: number, max: number): number;

  /**
   * Captures the current internal state of the generator.
   * Used by the engine's move history to restore PRNG state on Undo.
   */
  snapshot(): number;

  /**
   * Restores a previously captured PRNG state.
   *
   * @param state The state value previously returned by snapshot().
   */
  restore(state: number): void;
}
