import { GameModeRegistry } from '../adapters/GameModeRegistry';
import { OutputStateStore } from '../adapters/OutputStateStore';
import type { GameModeDescriptor } from '../application/modes';

export class CompositionRoot {
  public readonly modeRegistry: GameModeRegistry;
  public readonly outputState: OutputStateStore;

  public constructor(modeDescriptors: readonly GameModeDescriptor[] = []) {
    this.modeRegistry = new GameModeRegistry(modeDescriptors);
    this.outputState = new OutputStateStore();
  }
}
