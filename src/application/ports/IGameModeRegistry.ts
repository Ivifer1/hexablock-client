import type { GameId } from '../value-objects';
import type { GameModeDescriptor } from '../modes/game-mode-descriptor';

export interface IGameModeRegistry {
  register(descriptor: GameModeDescriptor): void;
  findById(id: GameId): GameModeDescriptor | undefined;
  findAll(): readonly GameModeDescriptor[];
}
