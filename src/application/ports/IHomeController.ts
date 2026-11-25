import type { GameId } from '../value-objects';

export interface IHomeController {
  selectMode(modeId: GameId): void;
  play(modeId: GameId): void;
  openSettings(): void;
  openPoints(hasSession: boolean): void;
}
