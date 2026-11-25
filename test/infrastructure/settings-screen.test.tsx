import { createElement } from 'react';
import { BackHandler, View as mockRNView } from 'react-native';
import { act, fireEvent, render, waitFor, within } from '@testing-library/react-native';
import { StaticLocaleCatalog, StaticTextCatalog } from '../../src/adapters/i18n';
import {
  InMemoryHomeSessionReader,
  InMemoryLocalePreference,
  LocaleController,
} from '../../src/adapters/presentation';
import type {
  AudioSettingsSnapshot,
  IAudioSettingsPreference,
  ISettingsNavigationPort,
  LocaleCode,
  PreferenceSaveResult,
} from '../../src/application/ports';
import type { SettingsEntryOrigin } from '../../src/application/value-objects';
import { CompositionRoot } from '../../src/infrastructure/CompositionRoot';
import { HomeScreen } from '../../src/infrastructure/HomeScreen';
import { DEFAULT_HOME_MODE_REGISTRATIONS } from '../../src/infrastructure/homeModeRegistrations';
import { APP_TEXT_CATALOG } from '../../src/infrastructure/i18n/settingsTranslations';
import { SettingsScreen } from '../../src/infrastructure/SettingsScreen';
import { BUTTON_SIZES, DARK_THEME, LIGHT_THEME } from '../../src/infrastructure/theme';

const mockCreateElement = createElement;

jest.mock('react-native-svg', () => ({
  __esModule: true,
  SvgXml: ({ xml, testID }: { readonly xml: string; readonly testID?: string }) =>
    mockCreateElement(mockRNView, {
      testID: testID ?? 'svg-xml',
      accessibilityLabel: xml,
    }),
}));

describe('SettingsScreen UI (02 · Ajustes & UC-007)', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  async function renderSettings(options: {
    readonly origin?: SettingsEntryOrigin;
    readonly isAuthenticated?: boolean;
    readonly displayName?: string | null;
    readonly appVersion?: string | null;
    readonly initialLocale?: LocaleCode;
    readonly audioSettingsPreference?: IAudioSettingsPreference;
    readonly extraLocales?: readonly { readonly code: string; readonly nativeName: string }[];
  } = {}) {
    const navCalls: string[] = [];
    const settingsNavigator: ISettingsNavigationPort = {
      goBack: () => navCalls.push('BACK'),
      openLogin: () => navCalls.push('LOGIN'),
    };
    const sessionReader = new InMemoryHomeSessionReader({
      isAuthenticated: options.isAuthenticated ?? false,
      displayName: options.displayName ?? null,
    });
    const locales = options.extraLocales ?? [
      { code: 'es', nativeName: 'Español' },
      { code: 'en', nativeName: 'English' },
    ];
    const localeCatalog = new StaticLocaleCatalog(locales);
    const localeController = new LocaleController(
      localeCatalog,
      new InMemoryLocalePreference(),
      options.initialLocale ?? 'es',
    );
    const root = new CompositionRoot(
      DEFAULT_HOME_MODE_REGISTRATIONS,
      undefined,
      new StaticTextCatalog(APP_TEXT_CATALOG, options.initialLocale ?? 'es'),
      {
        sessionReader,
        settingsNavigator,
        localeCatalog,
        localeController,
        audioSettingsPreference: options.audioSettingsPreference,
        appVersion: options.appVersion === undefined ? '1.0.0' : options.appVersion,
      },
    );
    root.initializeSettings(options.origin ?? 'HOME');

    const buildElement = (localeOverride?: LocaleCode) => (
      <SettingsScreen
        view={root.settingsOutput.current!}
        preferencesController={root.settingsPreferencesController}
        accountController={root.settingsAccountController}
        navigation={root.settingsNavigator}
        textCatalog={root.textCatalog}
        themeController={root.themeController}
        locale={localeOverride ?? root.localeController.getLocale()}
      />
    );

    const rendered = await render(buildElement());
    const rerenderLatest = async (nextLocale?: LocaleCode) => {
      await rendered.rerender(buildElement(nextLocale));
    };

    return { ...rendered, root, navCalls, rerenderLatest };
  }

  it('should_render_header_account_first_audio_theme_language_version_footer_and_bottom_menu_from_home', async () => {
    // Arrange & Act
    const { getAllByText, getByText, getByTestId, queryByTestId, queryByText, toJSON } =
      await renderSettings({
        origin: 'HOME',
        appVersion: '1.0.0',
      });
    const serializedTree = JSON.stringify(toJSON());

    // Assert
    expect(getByTestId('menu-background')).toBeTruthy();
    expect(getByTestId('menu-background-hex-pattern')).toBeTruthy();
    expect(getAllByText('Ajustes')).toHaveLength(2);
    expect(getByTestId('settings-account-card')).toBeTruthy();
    expect(serializedTree.indexOf('settings-account-card')).toBeLessThan(
      serializedTree.indexOf('Música'),
    );
    expect(queryByTestId('settings-version-badge')).toBeNull();
    expect(getByTestId('settings-version-footer')).toBeTruthy();
    expect(getByText('Versión 1.0.0')).toBeTruthy();
    expect(serializedTree.indexOf('settings-version-footer')).toBeGreaterThan(
      serializedTree.indexOf('Idioma'),
    );
    expect(getByText('Música')).toBeTruthy();
    expect(getByText('Efectos de sonido')).toBeTruthy();
    expect(getByText('Modo oscuro')).toBeTruthy();
    expect(getByText('Idioma')).toBeTruthy();
    expect(getByText('Español')).toBeTruthy();
    expect(getByText('English')).toBeTruthy();
    expect(getByText('Puntos')).toBeTruthy();
    expect(getByText('Jugar')).toBeTruthy();
    expect(queryByText('🇪🇸')).toBeNull();
    expect(queryByText('🇬🇧')).toBeNull();
    expect(queryByText('Activo')).toBeNull();
    expect(queryByText('Predeterminado')).toBeNull();
  });

  it('should_hide_bottom_menu_when_opened_from_pause', async () => {
    // Arrange & Act
    const { queryByText } = await renderSettings({ origin: 'PAUSE' });

    // Assert
    expect(queryByText('Puntos')).toBeNull();
    expect(queryByText('Jugar')).toBeNull();
  });

  it('should_toggle_music_and_sfx_and_update_switch_state', async () => {
    // Arrange
    const { getByTestId, root, rerenderLatest } = await renderSettings();

    // Act
    await fireEvent.press(getByTestId('settings-music-switch'));
    await rerenderLatest();
    await fireEvent.press(getByTestId('settings-sfx-switch'));
    await rerenderLatest();

    // Assert
    expect(getByTestId('settings-music-switch').props.accessibilityState).toEqual({
      checked: false,
    });
    expect(getByTestId('settings-sfx-switch').props.accessibilityState).toEqual({
      checked: false,
    });
    expect(root.audioSettingsPreference.load()).toEqual({
      musicEnabled: false,
      sfxEnabled: false,
    });
  });

  it('should_toggle_dark_mode_and_sync_home_screen_theme', async () => {
    // Arrange
    const { getByTestId, root, rerenderLatest, toJSON } = await renderSettings();
    const bgColor = () =>
      (toJSON() as { readonly props?: { readonly style?: { readonly backgroundColor?: string } } })
        ?.props?.style?.backgroundColor;
    expect(bgColor()).toBe(LIGHT_THEME.bg);

    // Act
    await act(async () => {
      await fireEvent.press(getByTestId('settings-dark-mode-switch'));
    });
    await rerenderLatest();

    // Assert Settings updated
    await waitFor(() => {
      expect(root.themeController.getMode()).toBe('dark');
      expect(bgColor()).toBe(DARK_THEME.bg);
    });

    // Assert Home stays synced
    root.initializeHome();
    const homeRendered = await render(
      <HomeScreen
        view={root.homeOutput.current!}
        controller={root.homeController}
        textCatalog={root.textCatalog}
        themeController={root.themeController}
        locale={root.localeController.getLocale()}
        modeIconResolver={root.modeIconResolver}
        previewResolver={root.previewAssetResolver}
      />,
    );
    const homeBg = (
      homeRendered.toJSON() as {
        readonly props?: { readonly style?: { readonly backgroundColor?: string } };
      }
    )?.props?.style?.backgroundColor;
    expect(homeBg).toBe(DARK_THEME.bg);
  });

  it('should_update_all_texts_immediately_when_language_is_selected_and_render_third_locale', async () => {
    // Arrange
    const { getAllByText, getByTestId, getByText, root, rerenderLatest } = await renderSettings({
      extraLocales: [
        { code: 'es', nativeName: 'Español' },
        { code: 'en', nativeName: 'English' },
        { code: 'pt', nativeName: 'Português' },
      ],
    });
    expect(getByText('Português')).toBeTruthy();

    // Act
    await fireEvent.press(getByTestId('settings-locale-en'));
    await rerenderLatest(root.localeController.getLocale());

    // Assert
    await waitFor(() => {
      expect(getAllByText('Settings')).toHaveLength(2);
      expect(getByText('Music')).toBeTruthy();
      expect(getByText('Sound effects')).toBeTruthy();
      expect(getByText('Dark mode')).toBeTruthy();
      expect(getByText('Language')).toBeTruthy();
      expect(getByText('Account')).toBeTruthy();
      expect(getByText('Sign in')).toBeTruthy();
      expect(getByText('Version 1.0.0')).toBeTruthy();
    });
  });

  it('should_render_home_styled_signin_button_for_guest_and_navigate_to_login', async () => {
    // Arrange
    const { getByTestId, getByText, navCalls } = await renderSettings({
      isAuthenticated: false,
    });
    const signInBtn = getByTestId('settings-signin-button');
    const flattenStyle = (style: unknown): Record<string, unknown> => {
      if (!style) return {};
      if (Array.isArray(style)) {
        return style.reduce<Record<string, unknown>>(
          (acc, entry) => ({ ...acc, ...flattenStyle(entry) }),
          {},
        );
      }
      return typeof style === 'object' ? (style as Record<string, unknown>) : {};
    };
    const btnStyle = flattenStyle(signInBtn.props.style);

    // Assert visual parity & Act
    expect(getByText('Iniciar sesión')).toBeTruthy();
    expect(btnStyle.backgroundColor).toBe(LIGHT_THEME.primary);
    expect(btnStyle.width).toBe('100%');
    expect(Number(btnStyle.minHeight)).toBeGreaterThanOrEqual(BUTTON_SIZES.m.minHeight);

    await fireEvent.press(signInBtn);
    expect(navCalls).toEqual(['LOGIN']);
  });

  it('should_confirm_before_signing_out_when_authenticated', async () => {
    // Arrange
    const { getByTestId, getByText, queryByTestId, queryByText, rerenderLatest } =
      await renderSettings({
        isAuthenticated: true,
        displayName: 'Leo',
      });
    expect(getByTestId('settings-account-avatar-icon')).toBeTruthy();
    expect(queryByText('L')).toBeNull();
    expect(getByText('Hola, Leo')).toBeTruthy();

    // Act: open dialog then cancel
    await fireEvent.press(getByTestId('settings-logout-button'));
    await rerenderLatest();
    expect(getByTestId('settings-logout-dialog')).toBeTruthy();
    expect(getByText('¿Cerrar sesión?')).toBeTruthy();

    await fireEvent.press(getByTestId('settings-logout-cancel'));
    await rerenderLatest();
    expect(queryByTestId('settings-logout-dialog')).toBeNull();
    expect(getByText('Hola, Leo')).toBeTruthy();

    // Act: open dialog then confirm
    await fireEvent.press(getByTestId('settings-logout-button'));
    await rerenderLatest();
    await fireEvent.press(getByTestId('settings-logout-confirm'));
    await rerenderLatest();

    // Assert signed out
    expect(queryByTestId('settings-logout-dialog')).toBeNull();
    expect(getByTestId('settings-signin-button')).toBeTruthy();
  });

  it('should_show_error_banner_and_keep_previous_value_when_save_fails', async () => {
    // Arrange
    const failingPref: IAudioSettingsPreference = {
      load: (): AudioSettingsSnapshot => ({ musicEnabled: true, sfxEnabled: true }),
      save: (): PreferenceSaveResult => ({ ok: false }),
    };
    const { getByTestId, getByText, rerenderLatest } = await renderSettings({
      audioSettingsPreference: failingPref,
    });

    // Act
    await fireEvent.press(getByTestId('settings-music-switch'));
    await rerenderLatest();

    // Assert
    expect(getByTestId('settings-error-banner')).toBeTruthy();
    expect(getByText('No se pudo guardar el cambio')).toBeTruthy();
    expect(getByTestId('settings-music-switch').props.accessibilityState).toEqual({
      checked: true,
    });
  });

  it('should_go_back_when_header_back_button_or_android_hardware_back_is_pressed', async () => {
    // Arrange
    let hardwareHandler: (() => boolean) | undefined;
    jest.spyOn(BackHandler, 'addEventListener').mockImplementation((_event, handler) => {
      hardwareHandler = handler as () => boolean;
      return { remove: jest.fn() };
    });

    const { getByTestId, navCalls } = await renderSettings();

    // Act
    await fireEvent.press(getByTestId('settings-back-button'));
    const handled = hardwareHandler?.();

    // Assert
    expect(handled).toBe(true);
    expect(navCalls).toEqual(['BACK', 'BACK']);
  });

  it('should_keep_fixed_header_margins_aligned_with_home_and_scroll_only_body_downward', async () => {
    // Arrange
    const settings = await renderSettings({ origin: 'HOME', appVersion: '1.0.0' });
    const root = settings.root;
    root.initializeHome();
    const home = await render(
      <HomeScreen
        view={root.homeOutput.current!}
        controller={root.homeController}
        textCatalog={root.textCatalog}
        themeController={root.themeController}
        locale={root.localeController.getLocale()}
        modeIconResolver={root.modeIconResolver}
        previewResolver={root.previewAssetResolver}
      />,
    );

    const flattenStyle = (style: unknown): Record<string, unknown> => {
      if (!style) return {};
      if (Array.isArray(style)) {
        return style.reduce<Record<string, unknown>>(
          (acc, entry) => ({ ...acc, ...flattenStyle(entry) }),
          {},
        );
      }
      return typeof style === 'object' ? (style as Record<string, unknown>) : {};
    };

    const headerSlot = settings.getByTestId('menu-screen-header-slot');
    const settingsHeaderStyle = flattenStyle(headerSlot.props.style);
    const homeHeaderStyle = flattenStyle(home.getByTestId('menu-screen-header-slot').props.style);
    const scrollView = settings.getByTestId('menu-screen-scroll');

    // Assert
    expect(settingsHeaderStyle.paddingTop).toBe(homeHeaderStyle.paddingTop);
    expect(settingsHeaderStyle.paddingHorizontal).toBe(homeHeaderStyle.paddingHorizontal);
    expect(within(headerSlot).getByTestId('settings-back-button')).toBeTruthy();
    expect(within(scrollView).queryByTestId('settings-back-button')).toBeNull();
    expect(within(scrollView).getByTestId('settings-account-card')).toBeTruthy();
    expect(within(scrollView).getByTestId('settings-version-footer')).toBeTruthy();
    expect(scrollView.props.contentInsetAdjustmentBehavior).toBe('never');
    expect(scrollView.props.automaticallyAdjustContentInsets).toBe(false);
  });
});
