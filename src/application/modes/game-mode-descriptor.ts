import type { GameId } from '../value-objects';

export type GameEntryKind = 'DIRECT' | 'LEVELS';

export interface GameModeDescriptor {
  readonly id: GameId;
  readonly nameKey: string;
  readonly descriptionKey: string;
  readonly entryKind: GameEntryKind;
  readonly progressDescriptor: string;
  readonly previewKey: string;
  /** Key resolved by the home icon catalog to an SVG (or image) component. */
  readonly iconKey: string;
  readonly accentColor: string;
  readonly hudComponents: readonly string[];
  readonly controls: readonly string[];
}
