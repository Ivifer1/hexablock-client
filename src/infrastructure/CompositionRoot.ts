import { GameModeRegistry } from '../adapters/GameModeRegistry';
import { StaticTextCatalog } from '../adapters/i18n';
import {
  DefeatOutputStore,
  GameControlsOutputStore,
  GameHudOutputStore,
  HomeOutputStore,
  LevelSelectionOutputStore,
  VictoryOutputStore,
} from '../adapters/state';
import {
  HomeController,
  HomePresenter,
  HomeSelectionPreference,
  type IHomePresenter,
} from '../adapters/presentation';
import type { GameModeDescriptor } from '../application/modes';
import type {
  IGameModeRegistry,
  IHomeController,
  IHomeNavigationPort,
  IHomeSelectionPreference,
  ITextCatalog,
} from '../application/ports';
import type { ScreenLoadState } from '../application/value-objects';
import { HOME_TEXT_CATALOG } from './i18n/homeTranslations';

const NOOP_NAVIGATOR: IHomeNavigationPort = {
  navigate: () => undefined,
};

export class CompositionRoot {
  public readonly modeRegistry: IGameModeRegistry;
  public readonly homeOutput: HomeOutputStore;
  public readonly hudOutput: GameHudOutputStore;
  public readonly controlsOutput: GameControlsOutputStore;
  public readonly levelSelectionOutput: LevelSelectionOutputStore;
  public readonly victoryOutput: VictoryOutputStore;
  public readonly defeatOutput: DefeatOutputStore;
  public readonly homeSelectionPreference: IHomeSelectionPreference;
  public readonly homePresenter: IHomePresenter;
  public readonly homeController: IHomeController;
  public readonly textCatalog: ITextCatalog;

  public constructor(
    modeDescriptors: readonly GameModeDescriptor[] = [],
    navigator: IHomeNavigationPort = NOOP_NAVIGATOR,
    textCatalog: ITextCatalog = new StaticTextCatalog(HOME_TEXT_CATALOG, 'es'),
  ) {
    this.modeRegistry = new GameModeRegistry(modeDescriptors);
    this.homeOutput = new HomeOutputStore();
    this.hudOutput = new GameHudOutputStore();
    this.controlsOutput = new GameControlsOutputStore();
    this.levelSelectionOutput = new LevelSelectionOutputStore();
    this.victoryOutput = new VictoryOutputStore();
    this.defeatOutput = new DefeatOutputStore();
    this.homeSelectionPreference = new HomeSelectionPreference();
    this.homePresenter = new HomePresenter(this.homeOutput, this.modeRegistry);
    this.homeController = new HomeController(
      this.modeRegistry,
      navigator,
      this.homeSelectionPreference,
      this.homePresenter,
    );
    this.textCatalog = textCatalog;
  }

  public initializeHome(state: ScreenLoadState = 'NORMAL'): void {
    this.homePresenter.present({
      selectedModeId: this.homeSelectionPreference.load(),
      state,
    });
  }
}
