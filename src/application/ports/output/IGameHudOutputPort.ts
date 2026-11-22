import type { GameHudDTO } from '../../value-objects/game-hud.dto';

export interface IGameHudOutputPort {
  presentHud(view: GameHudDTO): void;
}
