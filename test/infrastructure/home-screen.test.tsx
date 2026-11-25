import { createElement } from 'react';
import { AccessibilityInfo, View as mockRNView } from 'react-native';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { StaticTextCatalog } from '../../src/adapters/i18n';
import { InMemoryHomeSessionReader } from '../../src/adapters/presentation';
import type { HomeDestination, SupportedLocale } from '../../src/application/ports';
import { CompositionRoot } from '../../src/infrastructure/CompositionRoot';
import { HomeScreen } from '../../src/infrastructure/HomeScreen';
import {
  DEFAULT_HOME_MODE_REGISTRATIONS,
  type GameModeRegistration,
} from '../../src/infrastructure/homeModeRegistrations';
import { HOME_TEXT_CATALOG } from '../../src/infrastructure/i18n/homeTranslations';
import { BlockIcon } from '../../src/infrastructure/mode-icons';

const mockCreateElement = createElement;

jest.mock('react-native-svg', () => ({
  __esModule: true,
  SvgXml: ({ xml, testID }: { readonly xml: string; readonly testID?: string }) =>
    mockCreateElement(mockRNView, {
      testID: testID ?? 'svg-xml',
      accessibilityLabel: xml,
    }),
}));

describe('HomeScreen UI (UC-005 & UC-006)', () => {
  beforeEach(() => {
    jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(true);
    jest.spyOn(AccessibilityInfo, 'addEventListener').mockReturnValue({
      remove: jest.fn(),
    } as unknown as ReturnType<typeof AccessibilityInfo.addEventListener>);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  async function renderHome(options: {
    readonly registrations?: readonly GameModeRegistration[];
    readonly locale?: SupportedLocale;
    readonly state?: 'LOADING' | 'NORMAL' | 'EMPTY' | 'ERROR';
    readonly isPointsAvailable?: boolean;
    readonly isAuthenticated?: boolean;
    readonly displayName?: string | null;
  } = {}) {
    const navigated: HomeDestination[] = [];
    const sessionReader = new InMemoryHomeSessionReader({
      isAuthenticated: options.isAuthenticated ?? false,
      displayName: options.displayName ?? null,
    });
    const root = new CompositionRoot(
      options.registrations ?? DEFAULT_HOME_MODE_REGISTRATIONS,
      { navigate: (destination) => navigated.push(destination) },
      new StaticTextCatalog(HOME_TEXT_CATALOG, options.locale ?? 'es'),
      { sessionReader },
    );
    root.initializeHome(options.state ?? 'NORMAL', options.isPointsAvailable ?? true);

    const view = root.homeOutput.current!;
    const rendered = await render(
      <HomeScreen
        view={view}
        controller={root.homeController}
        textCatalog={root.textCatalog}
        locale={options.locale ?? 'es'}
        modeIconResolver={root.modeIconResolver}
        previewResolver={root.previewAssetResolver}
      />,
    );

    const rerenderLatest = async (nextLocale?: SupportedLocale) => {
      const latestView = root.homeOutput.current!;
      await rendered.rerender(
        <HomeScreen
          view={latestView}
          controller={root.homeController}
          textCatalog={root.textCatalog}
          locale={nextLocale ?? options.locale ?? 'es'}
          modeIconResolver={root.modeIconResolver}
          previewResolver={root.previewAssetResolver}
        />,
      );
    };

    return { ...rendered, root, navigated, rerenderLatest };
  }

  it('should_render_all_registered_modes_when_home_loads', async () => {
    // Arrange & Act
    const { getByLabelText, getByText } = await renderHome();

    // Assert
    await waitFor(() => {
      expect(getByText('HexaBlock Suite')).toBeTruthy();
      expect(getByLabelText('Hexa Lines')).toBeTruthy();
      expect(getByLabelText('Hexa Merge')).toBeTruthy();
      expect(getByLabelText('Hexa Fit')).toBeTruthy();
      expect(getByLabelText('Hexa Sort')).toBeTruthy();
    });
  });

  it('should_render_added_fifth_mode_when_descriptor_is_registered', async () => {
    // Arrange
    const fifthRegistration: GameModeRegistration = {
      descriptor: {
        id: 'fill',
        nameKey: 'game.fill.name',
        descriptionKey: 'game.fill.desc',
        entryKind: 'DIRECT',
        progressDescriptor: 'best',
        previewKey: 'fill',
        iconKey: 'fill',
        accentColor: '#E11D48',
        hudComponents: ['score'],
        controls: ['pause'],
      },
      icon: BlockIcon,
      preview: { kind: 'svg', xml: '<svg data-preview="fill" />' },
    };
    const catalog = new StaticTextCatalog(
      {
        ...HOME_TEXT_CATALOG,
        'game.fill.name': { es: 'Hexa Fill', en: 'Hexa Fill' },
        'game.fill.desc': { es: 'Rellena cada hexágono del tablero.', en: 'Fill every hex on the board.' },
      },
      'es',
    );
    const root = new CompositionRoot(
      [...DEFAULT_HOME_MODE_REGISTRATIONS, fifthRegistration],
      { navigate: () => undefined },
      catalog,
    );
    root.initializeHome();

    // Act
    const { getByLabelText } = await render(
      <HomeScreen
        view={root.homeOutput.current!}
        controller={root.homeController}
        textCatalog={root.textCatalog}
        locale="es"
        modeIconResolver={root.modeIconResolver}
        previewResolver={root.previewAssetResolver}
      />,
    );

    // Assert
    await waitFor(() => {
      expect(getByLabelText('Hexa Fill')).toBeTruthy();
      expect(getByLabelText('Hexa Lines')).toBeTruthy();
      expect(getByLabelText('Hexa Sort')).toBeTruthy();
    });
  });

  it('should_render_entry_kind_badge_and_update_preview_when_mode_is_tapped', async () => {
    // Arrange
    const { getByLabelText, getByText, getByTestId, rerenderLatest } = await renderHome();

    // Assert initial
    expect(getByText('Partida directa')).toBeTruthy();
    const initialPreviewLabel = getByTestId('home-center-preview').props.accessibilityLabel;

    // Act
    await fireEvent.press(getByLabelText('Hexa Fit'));
    await rerenderLatest();

    // Assert updated
    await waitFor(() => {
      expect(getByText('Por niveles')).toBeTruthy();
      expect(getByText('Niveles: 0 de 15')).toBeTruthy();
      const updatedPreviewLabel = getByTestId('home-center-preview').props.accessibilityLabel;
      expect(updatedPreviewLabel).not.toBe(initialPreviewLabel);
    });
  });

  it('should_render_progress_placeholder_when_progress_is_loading', async () => {
    // Arrange & Act
    const { getByText } = await renderHome({ state: 'LOADING' });

    // Assert
    await waitFor(() => {
      expect(getByText('…')).toBeTruthy();
      expect(getByText('Jugar Hexa Lines')).toBeTruthy();
    });
  });

  it('should_render_error_message_once_without_progress_badge_when_progress_read_fails', async () => {
    // Arrange & Act
    const { getAllByText, queryByTestId } = await renderHome({ state: 'ERROR' });

    // Assert
    await waitFor(() => {
      expect(getAllByText('No se pudo cargar tu progreso')).toHaveLength(1);
      expect(queryByTestId('home-progress-badge')).toBeNull();
    });
  });

  it('should_render_empty_state_when_no_modes_are_registered', async () => {
    // Arrange & Act
    const { getByText } = await renderHome({ registrations: [] });

    // Assert
    await waitFor(() => {
      expect(getByText('No hay juegos disponibles')).toBeTruthy();
    });
  });

  it('should_open_login_when_session_indicator_is_tapped_without_session', async () => {
    // Arrange
    const { getByTestId, navigated } = await renderHome({ isAuthenticated: false });

    // Act
    await fireEvent.press(getByTestId('home-session-button'));

    // Assert
    await waitFor(() => {
      expect(navigated).toEqual(['LOGIN']);
    });
  });

  it('should_open_ranking_when_session_indicator_is_tapped_with_session', async () => {
    // Arrange
    const { getByText, getByTestId, navigated } = await renderHome({
      isAuthenticated: true,
      displayName: 'Leonardo',
    });

    // Assert label & Act
    expect(getByText('Hola, Leonardo')).toBeTruthy();
    await fireEvent.press(getByTestId('home-session-button'));

    await waitFor(() => {
      expect(navigated).toEqual(['RANKING']);
    });
  });

  it('should_render_points_play_settings_and_block_unavailable_points_when_menu_is_used', async () => {
    // Arrange
    const { getByLabelText, navigated } = await renderHome({ isPointsAvailable: false });

    // Act
    await fireEvent.press(getByLabelText('Puntos'));
    await fireEvent.press(getByLabelText('Jugar'));
    await fireEvent.press(getByLabelText('Ajustes'));

    // Assert
    await waitFor(() => {
      expect(navigated).toEqual(['DIRECT', 'SETTINGS']);
      expect(getByLabelText('Puntos').props.accessibilityState).toEqual({
        selected: false,
        disabled: true,
      });
    });
  });

  it('should_switch_all_visible_texts_when_locale_changes_between_spanish_and_english', async () => {
    // Arrange
    const { getByText, rerenderLatest } = await renderHome({ locale: 'es' });
    expect(getByText('¿A qué jugamos hoy?')).toBeTruthy();
    expect(getByText('Partida directa')).toBeTruthy();

    // Act
    await rerenderLatest('en');

    // Assert
    await waitFor(() => {
      expect(getByText('What shall we play today?')).toBeTruthy();
      expect(getByText('Direct play')).toBeTruthy();
      expect(getByText('Play Hexa Lines')).toBeTruthy();
      expect(getByText('Settings')).toBeTruthy();
      expect(getByText('Points')).toBeTruthy();
    });
  });
});
