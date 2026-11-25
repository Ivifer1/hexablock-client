import { StaticAssetResolver } from '../adapters/assets';
import { GameModeRegistry } from '../adapters/GameModeRegistry';
import { StaticLocaleCatalog, StaticTextCatalog } from '../adapters/i18n';
import {
  DefeatOutputStore,
  GameControlsOutputStore,
  GameHudOutputStore,
  HomeOutputStore,
  LevelSelectionOutputStore,
  SettingsOutputStore,
  VictoryOutputStore,
} from '../adapters/state';
import {
  DefaultHomeProgressProvider,
  HomeController,
  HomePresenter,
  HomeSelectionPreference,
  InMemoryAudioSettingsPreference,
  InMemoryHomeSessionReader,
  InMemoryLocalePreference,
  InMemorySessionActions,
  InMemoryThemePreference,
  LocaleController,
  NoopAudioEngine,
  SettingsAccountController,
  SettingsPreferencesController,
  SettingsPresenter,
  SettingsStateHolder,
  ThemeController,
  type IHomePresenter,
  type ISettingsPresenter,
} from '../adapters/presentation';
import type { GameModeDescriptor } from '../application/modes';
import type {
  IAssetResolver,
  IAudioEnginePort,
  IAudioSettingsPreference,
  IGameModeRegistry,
  IHomeController,
  IHomeNavigationPort,
  IHomeProgressProvider,
  IHomeSelectionPreference,
  IHomeSessionReader,
  ILocaleCatalog,
  ILocaleController,
  ILocalePreference,
  ISessionActionsPort,
  ISettingsAccountController,
  ISettingsNavigationPort,
  ISettingsPreferencesController,
  ITextCatalog,
  IThemeController,
  IThemePreference,
  LocaleCode,
  ThemeMode,
} from '../application/ports';
import type {
  ScreenLoadState,
  SettingsEntryOrigin,
} from '../application/value-objects';
import type { IHomePreview } from './home-previews';
import type { GameModeRegistration } from './homeModeRegistrations';
import { APP_TEXT_CATALOG, DEFAULT_LOCALES } from './i18n/settingsTranslations';
import type { ModeIconComponent } from './mode-icons';

const NOOP_NAVIGATOR: IHomeNavigationPort = {
  navigate: () => undefined,
};

const NOOP_SETTINGS_NAVIGATOR: ISettingsNavigationPort = {
  goBack: () => undefined,
  openLogin: () => undefined,
};

export interface CompositionRootOptions {
  readonly progressProvider?: IHomeProgressProvider;
  readonly sessionReader?: IHomeSessionReader;
  readonly sessionActions?: ISessionActionsPort;
  readonly themePreference?: IThemePreference;
  readonly initialThemeMode?: ThemeMode;
  readonly themeController?: IThemeController;
  readonly settingsNavigator?: ISettingsNavigationPort;
  readonly audioSettingsPreference?: IAudioSettingsPreference;
  readonly audioEngine?: IAudioEnginePort;
  readonly localeCatalog?: ILocaleCatalog;
  readonly localePreference?: ILocalePreference;
  readonly localeController?: ILocaleController;
  readonly initialLocale?: LocaleCode;
  readonly appVersion?: string | null;
  readonly isAccountSectionEnabled?: boolean;
}

function isModeRegistration(
  entry: GameModeDescriptor | GameModeRegistration,
): entry is GameModeRegistration {
  return 'descriptor' in entry;
}

export class CompositionRoot {
  public readonly modeRegistry: IGameModeRegistry;
  public readonly modeIconResolver: IAssetResolver<ModeIconComponent>;
  public readonly previewAssetResolver: IAssetResolver<IHomePreview>;
  public readonly homeOutput: HomeOutputStore;
  public readonly settingsOutput: SettingsOutputStore;
  public readonly hudOutput: GameHudOutputStore;
  public readonly controlsOutput: GameControlsOutputStore;
  public readonly levelSelectionOutput: LevelSelectionOutputStore;
  public readonly victoryOutput: VictoryOutputStore;
  public readonly defeatOutput: DefeatOutputStore;
  public readonly homeSelectionPreference: IHomeSelectionPreference;
  public readonly progressProvider: IHomeProgressProvider;
  public readonly sessionReader: IHomeSessionReader;
  public readonly sessionActions: ISessionActionsPort;
  public readonly themePreference: IThemePreference;
  public readonly themeController: IThemeController;
  public readonly audioSettingsPreference: IAudioSettingsPreference;
  public readonly audioEngine: IAudioEnginePort;
  public readonly localeCatalog: ILocaleCatalog;
  public readonly localePreference: ILocalePreference;
  public readonly localeController: ILocaleController;
  public readonly homePresenter: IHomePresenter;
  public readonly homeController: IHomeController;
  public readonly settingsNavigator: ISettingsNavigationPort;
  public readonly settingsPresenter: ISettingsPresenter;
  public readonly settingsPreferencesController: ISettingsPreferencesController;
  public readonly settingsAccountController: ISettingsAccountController;
  public readonly textCatalog: ITextCatalog;

  private readonly settingsState: SettingsStateHolder;

  public constructor(
    modes: readonly (GameModeDescriptor | GameModeRegistration)[] = [],
    navigator: IHomeNavigationPort = NOOP_NAVIGATOR,
    textCatalog: ITextCatalog = new StaticTextCatalog(APP_TEXT_CATALOG, 'es'),
    options: CompositionRootOptions = {},
  ) {
    const descriptors: GameModeDescriptor[] = [];
    const iconEntries: Record<string, ModeIconComponent> = {};
    const previewEntries: Record<string, IHomePreview> = {};

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
    this.settingsOutput = new SettingsOutputStore();
    this.hudOutput = new GameHudOutputStore();
    this.controlsOutput = new GameControlsOutputStore();
    this.levelSelectionOutput = new LevelSelectionOutputStore();
    this.victoryOutput = new VictoryOutputStore();
    this.defeatOutput = new DefeatOutputStore();
    this.homeSelectionPreference = new HomeSelectionPreference();
    this.progressProvider = options.progressProvider ?? new DefaultHomeProgressProvider();
    const defaultSessionReader = new InMemoryHomeSessionReader();
    this.sessionReader = options.sessionReader ?? defaultSessionReader;
    this.sessionActions =
      options.sessionActions ??
      new InMemorySessionActions(
        this.sessionReader instanceof InMemoryHomeSessionReader
          ? this.sessionReader
          : undefined,
      );
    this.themePreference = options.themePreference ?? new InMemoryThemePreference();
    this.themeController =
      options.themeController ??
      new ThemeController(this.themePreference, options.initialThemeMode ?? 'light');
    this.audioSettingsPreference =
      options.audioSettingsPreference ?? new InMemoryAudioSettingsPreference();
    this.audioEngine = options.audioEngine ?? new NoopAudioEngine();
    this.localeCatalog = options.localeCatalog ?? new StaticLocaleCatalog(DEFAULT_LOCALES);
    this.localePreference = options.localePreference ?? new InMemoryLocalePreference();
    this.localeController =
      options.localeController ??
      new LocaleController(
        this.localeCatalog,
        this.localePreference,
        options.initialLocale ?? 'es',
      );
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

    const initialAudio = this.audioSettingsPreference.load();
    this.audioEngine.setMusicEnabled(initialAudio.musicEnabled);
    this.audioEngine.setSfxEnabled(initialAudio.sfxEnabled);

    this.settingsState = new SettingsStateHolder({
      origin: 'HOME',
      musicEnabled: initialAudio.musicEnabled,
      sfxEnabled: initialAudio.sfxEnabled,
      isDarkMode: this.themeController.getMode() === 'dark',
      activeLocale: this.localeController.getLocale(),
      isLogoutConfirmOpen: false,
      errorKey: null,
    });
    this.settingsNavigator = options.settingsNavigator ?? NOOP_SETTINGS_NAVIGATOR;
    this.settingsPresenter = new SettingsPresenter(
      this.settingsOutput,
      this.localeCatalog,
      this.sessionReader,
      {
        appVersion: options.appVersion === undefined ? '1.0.0' : options.appVersion,
        isAccountSectionEnabled: options.isAccountSectionEnabled ?? true,
      },
    );
    this.settingsPreferencesController = new SettingsPreferencesController({
      state: this.settingsState,
      audioPreference: this.audioSettingsPreference,
      audioEngine: this.audioEngine,
      localeController: this.localeController,
      themeController: this.themeController,
      presenter: this.settingsPresenter,
    });
    this.settingsAccountController = new SettingsAccountController(
      this.settingsState,
      this.sessionActions,
      this.settingsNavigator,
      this.settingsPresenter,
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

  public initializeSettings(origin: SettingsEntryOrigin = 'HOME'): void {
    const audio = this.audioSettingsPreference.load();
    this.settingsState.update({
      origin,
      musicEnabled: audio.musicEnabled,
      sfxEnabled: audio.sfxEnabled,
      isDarkMode: this.themeController.getMode() === 'dark',
      activeLocale: this.localeController.getLocale(),
      isLogoutConfirmOpen: false,
      errorKey: null,
    });
    this.settingsPresenter.present(this.settingsState.getSnapshot());
  }
}
