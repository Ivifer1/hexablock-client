import type { GameId } from '../value-objects';

export interface IHomeController {
  selectMode(modeId: GameId): void;
  play(modeId: GameId): void;
  openSettings(): void;
  openPoints(hasSession: boolean, isAvailable?: boolean): boolean;
  openSession(hasSession: boolean): void;
}
