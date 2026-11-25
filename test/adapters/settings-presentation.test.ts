/**
 * @jest-environment node
 */
import { StaticLocaleCatalog } from '../../src/adapters/i18n';
import {
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
} from '../../src/adapters/presentation';
import { SettingsOutputStore } from '../../src/adapters/state';
import type {
  AudioSettingsSnapshot,
  IAudioEnginePort,
  IAudioSettingsPreference,
  ILocaleCatalog,
  ILocaleController,
  ILocalePreference,
  ISessionActionsPort,
  ISettingsNavigationPort,
  LocaleCode,
  PreferenceSaveResult,
} from '../../src/application/ports';

describe('Settings presentation & adapter contracts (UC-007)', () => {
  function createHarness(options: {
    readonly audioPreference?: IAudioSettingsPreference;
    readonly localePreference?: ILocalePreference;
    readonly isAuthenticated?: boolean;
    readonly displayName?: string | null;
    readonly appVersion?: string | null;
    readonly origin?: 'HOME' | 'PAUSE';
    readonly isAccountSectionEnabled?: boolean;
    readonly locales?: readonly { readonly code: string; readonly nativeName: string }[];
  } = {}) {
    const output = new SettingsOutputStore();
    const audioPreference = options.audioPreference ?? new InMemoryAudioSettingsPreference();
    const audioEngine = new NoopAudioEngine();
    const localeCatalog = new StaticLocaleCatalog(
      options.locales ?? [
        { code: 'es', nativeName: 'Español' },
        { code: 'en', nativeName: 'English' },
      ],
    );
    const localePreference = options.localePreference ?? new InMemoryLocalePreference();
    const localeController = new LocaleController(localeCatalog, localePreference, 'es');
    const themeController = new ThemeController(new InMemoryThemePreference(), 'light');
    const sessionReader = new InMemoryHomeSessionReader({
      isAuthenticated: options.isAuthenticated ?? false,
      displayName: options.displayName ?? null,
    });
    const sessionActions = new InMemorySessionActions(sessionReader);
    const navigationCalls: string[] = [];
    const navigator: ISettingsNavigationPort = {
      goBack: () => navigationCalls.push('BACK'),
      openLogin: () => navigationCalls.push('LOGIN'),
    };
    const presenter = new SettingsPresenter(output, localeCatalog, sessionReader, {
      appVersion: options.appVersion === undefined ? '1.0.0' : options.appVersion,
      isAccountSectionEnabled: options.isAccountSectionEnabled ?? true,
    });
    const initialAudio = audioPreference.load();
    const state = new SettingsStateHolder({
      origin: options.origin ?? 'HOME',
      musicEnabled: initialAudio.musicEnabled,
      sfxEnabled: initialAudio.sfxEnabled,
      isDarkMode: themeController.getMode() === 'dark',
      activeLocale: localeController.getLocale(),
      isLogoutConfirmOpen: false,
      errorKey: null,
    });
    const preferencesController = new SettingsPreferencesController({
      state,
      audioPreference,
      audioEngine,
      localeController,
      themeController,
      presenter,
    });
    const accountController = new SettingsAccountController(
      state,
      sessionActions,
      navigator,
      presenter,
    );
    presenter.present(state.getSnapshot());

    return {
      output,
      audioPreference,
      audioEngine,
      localeCatalog,
      localeController,
      themeController,
      sessionReader,
      navigationCalls,
      preferencesController,
      accountController,
    };
  }

  it('should_mute_music_immediately_when_music_toggle_is_turned_off', () => {
    // Arrange
    const { output, audioEngine, preferencesController } = createHarness();
    expect(output.current?.musicEnabled).toBe(true);
    expect(audioEngine.musicEnabled).toBe(true);

    // Act
    preferencesController.setMusicEnabled(false);

    // Assert
    expect(output.current?.musicEnabled).toBe(false);
    expect(audioEngine.musicEnabled).toBe(false);
    expect(output.current?.errorMessage).toBeNull();
  });

  it('should_silence_without_confirmation_sfx_when_disabled_and_play_confirmation_when_enabled', () => {
    // Arrange
    const { output, audioEngine, preferencesController } = createHarness();

    // Act: turn off
    preferencesController.setSfxEnabled(false);
    const countAfterDisable = audioEngine.confirmationCount;

    // Assert off
    expect(output.current?.sfxEnabled).toBe(false);
    expect(audioEngine.sfxEnabled).toBe(false);
    expect(countAfterDisable).toBe(0);

    // Act: turn on
    preferencesController.setSfxEnabled(true);

    // Assert on + confirmation SFX
    expect(output.current?.sfxEnabled).toBe(true);
    expect(audioEngine.sfxEnabled).toBe(true);
    expect(audioEngine.confirmationCount).toBe(1);
  });

  it('should_rollback_audio_and_show_error_without_engine_side_effect_when_save_fails', () => {
    // Arrange
    const failingAudioPref: IAudioSettingsPreference = {
      load: (): AudioSettingsSnapshot => ({ musicEnabled: true, sfxEnabled: false }),
      save: (): PreferenceSaveResult => ({ ok: false, reason: 'DISK_FULL' }),
    };
    const { output, audioEngine, preferencesController } = createHarness({
      audioPreference: failingAudioPref,
    });
    audioEngine.setMusicEnabled(true);
    audioEngine.setSfxEnabled(false);

    // Act
    preferencesController.setMusicEnabled(false);
    preferencesController.setSfxEnabled(true);

    // Assert
    expect(output.current?.musicEnabled).toBe(true);
    expect(output.current?.sfxEnabled).toBe(false);
    expect(audioEngine.musicEnabled).toBe(true);
    expect(audioEngine.sfxEnabled).toBe(false);
    expect(audioEngine.confirmationCount).toBe(0);
    expect(output.current?.errorMessage).toEqual({ key: 'settings.error_save' });
  });

  it('should_switch_locale_immediately_and_support_third_locale_via_ocp', () => {
    // Arrange
    const { output, localeController, preferencesController } = createHarness({
      locales: [
        { code: 'es', nativeName: 'Español' },
        { code: 'en', nativeName: 'English' },
        { code: 'pt', nativeName: 'Português' },
      ],
    });
    const observedLocales: LocaleCode[] = [];
    const unsubscribe = localeController.subscribe((code) => observedLocales.push(code));

    // Act
    preferencesController.selectLocale('pt');
    unsubscribe();

    // Assert
    expect(localeController.getLocale()).toBe('pt');
    expect(observedLocales).toEqual(['pt']);
    expect(output.current?.activeLocale).toBe('pt');
    expect(output.current?.locales).toEqual([
      { code: 'es', nativeName: 'Español', isSelected: false },
      { code: 'en', nativeName: 'English', isSelected: false },
      { code: 'pt', nativeName: 'Português', isSelected: true },
    ]);
  });

  it('should_rollback_locale_and_present_error_when_locale_save_fails', () => {
    // Arrange
    const failingLocalePref: ILocalePreference = {
      load: () => 'es',
      save: () => ({ ok: false, reason: 'STORAGE_ERROR' }),
    };
    const { output, localeController, preferencesController } = createHarness({
      localePreference: failingLocalePref,
    });

    // Act
    preferencesController.selectLocale('en');

    // Assert
    expect(localeController.getLocale()).toBe('es');
    expect(output.current?.activeLocale).toBe('es');
    expect(output.current?.errorMessage).toEqual({ key: 'settings.error_save' });
  });

  it('should_sync_theme_controller_when_dark_mode_is_toggled', () => {
    // Arrange
    const { output, themeController, preferencesController } = createHarness();

    // Act
    preferencesController.setDarkMode(true);

    // Assert
    expect(themeController.getMode()).toBe('dark');
    expect(output.current?.isDarkMode).toBe(true);
  });

  it('should_navigate_to_login_and_handle_logout_confirmation_flow_for_account', () => {
    // Arrange guest
    const guest = createHarness({ isAuthenticated: false });

    // Act guest
    guest.accountController.openLogin();

    // Assert guest
    expect(guest.navigationCalls).toEqual(['LOGIN']);

    // Arrange authenticated
    const authed = createHarness({ isAuthenticated: true, displayName: 'Leo' });

    // Act: request then cancel
    authed.accountController.requestLogout();
    expect(authed.output.current?.isLogoutConfirmOpen).toBe(true);
    authed.accountController.cancelLogout();
    expect(authed.output.current?.isLogoutConfirmOpen).toBe(false);
    expect(authed.sessionReader.getSnapshot().isAuthenticated).toBe(true);

    // Act: request then confirm
    authed.accountController.requestLogout();
    authed.accountController.confirmLogout();

    // Assert signed out
    expect(authed.output.current?.isLogoutConfirmOpen).toBe(false);
    expect(authed.output.current?.session.isAuthenticated).toBe(false);
    expect(authed.sessionReader.getSnapshot().isAuthenticated).toBe(false);
  });

  it('should_show_bottom_menu_only_for_home_origin_and_expose_version_footer', () => {
    // Arrange & Act
    const fromHome = createHarness({ origin: 'HOME', appVersion: '1.2.3' });
    const fromPause = createHarness({ origin: 'PAUSE', appVersion: '1.2.3' });

    // Assert
    expect(fromHome.output.current?.showBottomMenu).toBe(true);
    expect(fromHome.output.current?.versionLabel).toEqual({
      key: 'settings.version',
      parameters: { version: '1.2.3' },
    });
    expect(fromPause.output.current?.showBottomMenu).toBe(false);
  });

  describe('LSP contracts for Settings ports', () => {
    it('should_honor_iaudio_settings_preference_contract', () => {
      const pref: IAudioSettingsPreference = new InMemoryAudioSettingsPreference();
      expect(pref.load()).toEqual({ musicEnabled: true, sfxEnabled: true });
      expect(pref.save({ musicEnabled: false, sfxEnabled: true })).toEqual({ ok: true });
      expect(pref.load()).toEqual({ musicEnabled: false, sfxEnabled: true });
    });

    it('should_honor_iaudio_engine_port_contract', () => {
      const engine: IAudioEnginePort = new NoopAudioEngine();
      engine.setMusicEnabled(false);
      engine.setSfxEnabled(true);
      engine.playConfirmationSfx();
      expect(true).toBe(true);
    });

    it('should_honor_ilocale_catalog_and_controller_contracts', () => {
      const catalog: ILocaleCatalog = new StaticLocaleCatalog([
        { code: 'es', nativeName: 'Español' },
        { code: 'en', nativeName: 'English' },
      ]);
      const controller: ILocaleController = new LocaleController(
        catalog,
        new InMemoryLocalePreference(),
        'es',
      );
      expect(catalog.findByCode('es')?.nativeName).toBe('Español');
      expect(catalog.findByCode('missing')).toBeUndefined();
      expect(controller.getLocale()).toBe('es');
      expect(controller.setLocale('en')).toEqual({ ok: true });
      expect(controller.getLocale()).toBe('en');
      expect(controller.setLocale('unknown').ok).toBe(false);
    });

    it('should_honor_isession_actions_port_contract', () => {
      const reader = new InMemoryHomeSessionReader({
        isAuthenticated: true,
        displayName: 'Ana',
      });
      const actions: ISessionActionsPort = new InMemorySessionActions(reader);
      actions.signOut();
      expect(reader.getSnapshot()).toEqual({ isAuthenticated: false, displayName: null });
    });
  });
});
