import type { GameId } from '../value-objects';

export interface IHomeSelectionPreference {
  load(): GameId | null;
  save(modeId: GameId): void;
}
