import type { GameControlsDTO } from '../../value-objects/game-controls.dto';

export interface IGameControlsOutputPort {
  presentControls(view: GameControlsDTO): void;
}
