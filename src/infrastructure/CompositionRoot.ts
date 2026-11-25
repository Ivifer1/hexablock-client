import { StaticAssetResolver } from '../adapters/assets';
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
  DefaultHomeProgressProvider,
  HomeController,
  HomePresenter,
  HomeSelectionPreference,
  InMemoryHomeSessionReader,
  type IHomePresenter,
} from '../adapters/presentation';
import type { GameModeDescriptor } from '../application/modes';
import type {
  IAssetResolver,
  IGameModeRegistry,
  IHomeController,
  IHomeNavigationPort,
  IHomeProgressProvider,
  IHomeSelectionPreference,
  IHomeSessionReader,
  ITextCatalog,
} from '../application/ports';
import type { ScreenLoadState } from '../application/value-objects';
import type { HomePreviewAsset } from './home-previews';
import type { GameModeRegistration } from './homeModeRegistrations';
import { HOME_TEXT_CATALOG } from './i18n/homeTranslations';
import type { ModeIconComponent } from './mode-icons';

const NOOP_NAVIGATOR: IHomeNavigationPort = {
  navigate: () => undefined,
};

export interface CompositionRootOptions {
  readonly progressProvider?: IHomeProgressProvider;
  readonly sessionReader?: IHomeSessionReader;
}

function isModeRegistration(
  entry: GameModeDescriptor | GameModeRegistration,
): entry is GameModeRegistration {
  return 'descriptor' in entry;
}

export class CompositionRoot {
  public readonly modeRegistry: IGameModeRegistry;
  public readonly modeIconResolver: IAssetResolver<ModeIconComponent>;
  public readonly previewAssetResolver: IAssetResolver<HomePreviewAsset>;
  public readonly homeOutput: HomeOutputStore;
  public readonly hudOutput: GameHudOutputStore;
  public readonly controlsOutput: GameControlsOutputStore;
  public readonly levelSelectionOutput: LevelSelectionOutputStore;
  public readonly victoryOutput: VictoryOutputStore;
  public readonly defeatOutput: DefeatOutputStore;
  public readonly homeSelectionPreference: IHomeSelectionPreference;
  public readonly progressProvider: IHomeProgressProvider;
  public readonly sessionReader: IHomeSessionReader;
  public readonly homePresenter: IHomePresenter;
  public readonly homeController: IHomeController;
  public readonly textCatalog: ITextCatalog;

  public constructor(
    modes: readonly (GameModeDescriptor | GameModeRegistration)[] = [],
    navigator: IHomeNavigationPort = NOOP_NAVIGATOR,
    textCatalog: ITextCatalog = new StaticTextCatalog(HOME_TEXT_CATALOG, 'es'),
    options: CompositionRootOptions = {},
  ) {
    const descriptors: GameModeDescriptor[] = [];
    const iconEntries: Record<string, ModeIconComponent> = {};
    const previewEntries: Record<string, HomePreviewAsset> = {};

    for (const entry of modes) {
      if (isModeRegistration(entry)) {
        descriptors.push(entry.descriptor);
        iconEntries[entry.descriptor.iconKey] = entry.icon;
        previewEntries[entry.descriptor.previewKey] = entry.preview;
      } else {
        descriptors.push(entry);
      }
    }

    this.modeRegistry = new GameModeRegistry(descriptors);
    this.modeIconResolver = new StaticAssetResolver(iconEntries);
    this.previewAssetResolver = new StaticAssetResolver(previewEntries);
    this.homeOutput = new HomeOutputStore();
    this.hudOutput = new GameHudOutputStore();
    this.controlsOutput = new GameControlsOutputStore();
    this.levelSelectionOutput = new LevelSelectionOutputStore();
    this.victoryOutput = new VictoryOutputStore();
    this.defeatOutput = new DefeatOutputStore();
    this.homeSelectionPreference = new HomeSelectionPreference();
    this.progressProvider = options.progressProvider ?? new DefaultHomeProgressProvider();
    this.sessionReader = options.sessionReader ?? new InMemoryHomeSessionReader();
    this.homePresenter = new HomePresenter(
      this.homeOutput,
      this.modeRegistry,
      this.progressProvider,
      this.sessionReader,
    );
    this.homeController = new HomeController(
      this.modeRegistry,
      navigator,
      this.homeSelectionPreference,
      this.homePresenter,
    );
    this.textCatalog = textCatalog;
  }

  public initializeHome(
    state: ScreenLoadState = 'NORMAL',
    isPointsAvailable = true,
  ): void {
    this.homePresenter.present({
      selectedModeId: this.homeSelectionPreference.load(),
      state,
      isPointsAvailable,
    });
  }
}
