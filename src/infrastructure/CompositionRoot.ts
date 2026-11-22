import { GameModeRegistry } from '../adapters/GameModeRegistry';
import { OutputStateStore } from '../adapters/OutputStateStore';
import type { GameModeDescriptor } from '../application/modes';
import { HomeController, HomePresenter } from '../adapters/presentation';
import { HomeSelectionPreference } from '../adapters/presentation/HomeSelectionPreference';

export class CompositionRoot {
  public readonly modeRegistry: GameModeRegistry;
  public readonly outputState: OutputStateStore;
  public readonly homePresenter: HomePresenter;
  public readonly homeController: HomeController;
  public readonly homeSelectionPreference: HomeSelectionPreference;

  public constructor(modeDescriptors: readonly GameModeDescriptor[] = []) {
    this.modeRegistry = new GameModeRegistry(modeDescriptors);
    this.outputState = new OutputStateStore();
    this.homeSelectionPreference = new HomeSelectionPreference();
    this.homePresenter = new HomePresenter(this.outputState, this.modeRegistry);
    this.homeController = new HomeController(
      this.modeRegistry,
      () => undefined,
    );
  }
}
