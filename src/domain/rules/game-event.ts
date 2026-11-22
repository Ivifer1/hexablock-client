/**
 * GameEvent (Domain Event)
 *
 * Represents an immutable domain event emitted during turn resolution
 * (e.g. LINES_CLEARED, TILES_MERGED, STACK_REMOVED, COMBO_TRIGGERED).
 */
export interface GameEvent {
  /** The semantic event type identifier. */
  readonly type: string;
  /** Optional metadata payload describing the event. */
  readonly payload?: Readonly<Record<string, unknown>>;
}
