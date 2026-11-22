import type { IGameModeRegistry } from '../application/ports';
import type { GameModeDescriptor } from '../application/modes';
import type { GameId } from '../application/value-objects';

export class GameModeRegistry implements IGameModeRegistry {
  private readonly descriptors = new Map<GameId, GameModeDescriptor>();

  public constructor(descriptors: readonly GameModeDescriptor[] = []) {
    descriptors.forEach((descriptor) => this.register(descriptor));
  }

  public register(descriptor: GameModeDescriptor): void {
    if (this.descriptors.has(descriptor.id)) {
      throw new Error(`A game mode with id "${descriptor.id}" is already registered.`);
    }

    this.descriptors.set(descriptor.id, descriptor);
  }

  public findById(id: GameId): GameModeDescriptor | undefined {
    return this.descriptors.get(id);
  }

  public findAll(): readonly GameModeDescriptor[] {
    return [...this.descriptors.values()];
  }
}
