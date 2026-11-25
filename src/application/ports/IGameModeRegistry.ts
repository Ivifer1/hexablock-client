import type { GameId } from '../value-objects';
import type { GameModeDescriptor } from '../modes/game-mode-descriptor';

export interface IGameModeCatalog {
  findById(id: GameId): GameModeDescriptor | undefined;
  findAll(): readonly GameModeDescriptor[];
}

export interface IGameModeRegistry extends IGameModeCatalog {
  register(descriptor: GameModeDescriptor): void;
}
