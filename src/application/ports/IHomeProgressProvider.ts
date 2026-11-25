import type { GameModeDescriptor } from '../modes/game-mode-descriptor';
import type { HomeProgressDTO } from '../value-objects/home.dto';

export interface IHomeProgressProvider {
  getProgress(descriptor: GameModeDescriptor): HomeProgressDTO;
}
