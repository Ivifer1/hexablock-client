import { StaticAssetResolver } from '../../src/adapters/assets';
import { GameModeRegistry } from '../../src/adapters/GameModeRegistry';
import { StaticTextCatalog } from '../../src/adapters/i18n';
import {
  DefaultHomeProgressProvider,
  HomeController,
  HomePresenter,
  HomeSelectionPreference,
  InMemoryHomeSessionReader,
  InMemoryThemePreference,
  ThemeController,
} from '../../src/adapters/presentation';
import { HomeOutputStore } from '../../src/adapters/state';
import type { GameModeDescriptor } from '../../src/application/modes';
import type { HomeDestination, IThemeController, ThemeMode } from '../../src/application/ports';

const modes: readonly GameModeDescriptor[] = [
  {
    id: 'lines',
    nameKey: 'game.lines.name',
    descriptionKey: 'game.lines.desc',
    entryKind: 'DIRECT',
    progressDescriptor: 'best',
    previewKey: 'lines',
    iconKey: 'lines',
    accentColor: '#0891B2',
    hudComponents: ['score'],
    controls: ['pause'],
  },
  {
    id: 'merge',
    nameKey: 'game.merge.name',
    descriptionKey: 'game.merge.desc',
    entryKind: 'DIRECT',
    progressDescriptor: 'best',
    previewKey: 'merge',
    iconKey: 'merge',
    accentColor: '#059669',
    hudComponents: ['score'],
    controls: ['pause'],
  },
  {
    id: 'fit',
    nameKey: 'game.fit.name',
    descriptionKey: 'game.fit.desc',
    entryKind: 'LEVELS',
    progressDescriptor: 'levels',
    totalLevels: 15,
    previewKey: 'fit',
    iconKey: 'fit',
    accentColor: '#D97706',
    hudComponents: ['score'],
    controls: ['pause'],
  },
  {
    id: 'sort',
    nameKey: 'game.sort.name',
    descriptionKey: 'game.sort.desc',
    entryKind: 'LEVELS',
    progressDescriptor: 'levels',
    totalLevels: 10,
    previewKey: 'sort',
    iconKey: 'sort',
    accentColor: '#7C3AED',
    hudComponents: ['score'],
    controls: ['pause'],
  },
];

describe('UC-005 & UC-006 Home presentation and navigation', () => {
  it('should_render_all_registered_modes_when_home_loads', () => {
    // Arrange
    const output = new HomeOutputStore();
    const registry = new GameModeRegistry(modes);
    const presenter = new HomePresenter(output, registry);

    // Act
    presenter.present({ selectedModeId: 'lines', state: 'NORMAL' });

    // Assert
    expect(output.current?.modes).toHaveLength(4);
  });

  it('should_restore_last_selected_mode_when_home_reopens', () => {
    // Arrange
    const output = new HomeOutputStore();
    const registry = new GameModeRegistry(modes);
    const presenter = new HomePresenter(output, registry);

    // Act
    presenter.present({ selectedModeId: 'fit', state: 'NORMAL' });

    // Assert
    expect(output.current?.selectedModeId).toBe('fit');
  });

  it('should_select_lines_when_home_opens_for_the_first_time', () => {
    // Arrange
    const output = new HomeOutputStore();
    const registry = new GameModeRegistry(modes);
    const presenter = new HomePresenter(output, registry);

    // Act
    presenter.present({ selectedModeId: null, state: 'NORMAL' });

    // Assert
    expect(output.current?.selectedModeId).toBe('lines');
  });

  it('should_select_first_registered_mode_when_no_prior_selection_exists', () => {
    // Arrange
    const output = new HomeOutputStore();
    const customModes: readonly GameModeDescriptor[] = [
      { ...modes[2], id: 'alpha', entryKind: 'DIRECT' },
      { ...modes[2], id: 'beta', entryKind: 'LEVELS' },
    ];
    const presenter = new HomePresenter(output, new GameModeRegistry(customModes));

    // Act
    presenter.present({ selectedModeId: null, state: 'NORMAL' });

    // Assert
    expect(output.current?.selectedModeId).toBe('alpha');
  });

  it('should_render_none_progress_when_best_descriptor_has_no_record_yet', () => {
    // Arrange
    const output = new HomeOutputStore();
    const presenter = new HomePresenter(output, new GameModeRegistry(modes));

    // Act
    presenter.present({ selectedModeId: 'lines', state: 'NORMAL' });

    // Assert
    expect(output.current?.modes.find((mode) => mode.id === 'lines')?.progress).toEqual({
      kind: 'NONE',
    });
  });

  it('should_use_descriptor_total_levels_when_level_mode_has_no_saved_progress', () => {
    // Arrange
    const output = new HomeOutputStore();
    const presenter = new HomePresenter(output, new GameModeRegistry(modes));

    // Act
    presenter.present({ selectedModeId: 'sort', state: 'NORMAL' });

    // Assert
    expect(output.current?.modes.find((mode) => mode.id === 'sort')?.progress).toEqual({
      kind: 'LEVELS',
      completed: 0,
      total: 10,
    });
    expect(output.current?.modes.find((mode) => mode.id === 'fit')?.progress).toEqual({
      kind: 'LEVELS',
      completed: 0,
      total: 15,
    });
  });

  it('should_support_custom_progress_mapper_when_new_progress_kind_is_added', () => {
    // Arrange
    const output = new HomeOutputStore();
    const registry = new GameModeRegistry([
      {
        ...modes[0],
        id: 'streak',
        progressDescriptor: 'streak-best',
      },
    ]);
    const progressProvider = new DefaultHomeProgressProvider({
      'streak-best': () => ({ kind: 'BEST', value: 420 }),
    });
    const presenter = new HomePresenter(output, registry, progressProvider);

    // Act
    presenter.present({ selectedModeId: 'streak', state: 'NORMAL' });

    // Assert
    expect(output.current?.modes[0]?.progress).toEqual({ kind: 'BEST', value: 420 });
  });

  it('should_render_progress_placeholder_when_progress_is_loading', () => {
    // Arrange
    const output = new HomeOutputStore();
    const presenter = new HomePresenter(output, new GameModeRegistry(modes));

    // Act
    presenter.present({ selectedModeId: 'lines', state: 'LOADING' });

    // Assert
    expect(output.current?.state).toBe('LOADING');
    expect(output.current?.modes).toHaveLength(4);
    for (const mode of output.current?.modes ?? []) {
      expect(mode.progress).toEqual({ kind: 'LOADING' });
    }
  });

  it('should_render_without_progress_and_error_message_when_progress_read_fails', () => {
    // Arrange
    const output = new HomeOutputStore();
    const presenter = new HomePresenter(output, new GameModeRegistry(modes));

    // Act
    presenter.present({ selectedModeId: 'lines', state: 'ERROR' });

    // Assert
    expect(output.current?.state).toBe('ERROR');
    expect(output.current?.errorMessage).toEqual({ key: 'home.error_progress' });
    expect(output.current?.modes).toHaveLength(4);
    for (const mode of output.current?.modes ?? []) {
      expect(mode.progress).toEqual({
        kind: 'ERROR',
        message: { key: 'home.error_progress' },
      });
    }
  });

  it('should_map_entry_kind_label_for_direct_and_levels_modes', () => {
    // Arrange
    const output = new HomeOutputStore();
    const presenter = new HomePresenter(output, new GameModeRegistry(modes));

    // Act
    presenter.present({ selectedModeId: 'lines', state: 'NORMAL' });

    // Assert
    const directMode = output.current?.modes.find((mode) => mode.id === 'lines');
    const levelsMode = output.current?.modes.find((mode) => mode.id === 'fit');
    expect(directMode?.entryKindLabel).toEqual({ key: 'home.entry_direct' });
    expect(levelsMode?.entryKindLabel).toEqual({ key: 'home.entry_levels' });
  });

  it('should_render_added_fifth_mode_when_descriptor_is_registered', () => {
    // Arrange
    const output = new HomeOutputStore();
    const registry = new GameModeRegistry(modes);
    registry.register({
      id: 'fill',
      nameKey: 'game.fill.name',
      descriptionKey: 'game.fill.desc',
      entryKind: 'DIRECT',
      progressDescriptor: 'best',
      previewKey: 'fill',
      iconKey: 'fill',
      accentColor: '#E11D48',
      hudComponents: [],
      controls: [],
    });
    const presenter = new HomePresenter(output, registry);

    // Act
    presenter.present({ selectedModeId: 'lines', state: 'NORMAL' });

    // Assert
    expect(output.current?.modes).toHaveLength(5);
  });

  it('should_present_registered_accent_color_without_variant_specific_screen_logic', () => {
    // Arrange
    const output = new HomeOutputStore();
    const registry = new GameModeRegistry(modes);
    registry.register({
      id: 'fill',
      nameKey: 'game.fill.name',
      descriptionKey: 'game.fill.desc',
      entryKind: 'DIRECT',
      progressDescriptor: 'best',
      previewKey: 'fill',
      iconKey: 'fill',
      accentColor: '#E11D48',
      hudComponents: [],
      controls: [],
    });
    const presenter = new HomePresenter(output, registry);

    // Act
    presenter.present({ selectedModeId: 'fill', state: 'NORMAL' });

    // Assert
    expect(output.current?.modes.find((mode) => mode.id === 'fill')?.accentColor)
      .toBe('#E11D48');
  });

  it('should_present_registered_icon_key_without_variant_specific_screen_logic', () => {
    // Arrange
    const output = new HomeOutputStore();
    const registry = new GameModeRegistry(modes);
    registry.register({
      id: 'fill',
      nameKey: 'game.fill.name',
      descriptionKey: 'game.fill.desc',
      entryKind: 'DIRECT',
      progressDescriptor: 'best',
      previewKey: 'fill',
      iconKey: 'fill-hex',
      accentColor: '#E11D48',
      hudComponents: [],
      controls: [],
    });
    const presenter = new HomePresenter(output, registry);

    // Act
    presenter.present({ selectedModeId: 'fill', state: 'NORMAL' });

    // Assert
    expect(output.current?.modes.find((mode) => mode.id === 'fill')?.iconKey)
      .toBe('fill-hex');
  });

  it('should_present_sign_in_label_when_no_session_is_active', () => {
    // Arrange
    const output = new HomeOutputStore();
    const sessionReader = new InMemoryHomeSessionReader({
      isAuthenticated: false,
      displayName: null,
    });
    const presenter = new HomePresenter(
      output,
      new GameModeRegistry(modes),
      new DefaultHomeProgressProvider(),
      sessionReader,
    );

    // Act
    presenter.present({ selectedModeId: 'lines', state: 'NORMAL' });

    // Assert
    expect(output.current?.hasSession).toBe(false);
    expect(output.current?.sessionLabel).toEqual({ key: 'common.sign_in' });
  });

  it('should_present_user_greeting_when_session_is_active', () => {
    // Arrange
    const output = new HomeOutputStore();
    const sessionReader = new InMemoryHomeSessionReader({
      isAuthenticated: true,
      displayName: 'Leonardo',
    });
    const presenter = new HomePresenter(
      output,
      new GameModeRegistry(modes),
      new DefaultHomeProgressProvider(),
      sessionReader,
    );

    // Act
    presenter.present({ selectedModeId: 'lines', state: 'NORMAL' });

    // Assert
    expect(output.current?.hasSession).toBe(true);
    expect(output.current?.sessionLabel).toEqual({
      key: 'home.session_user',
      parameters: { name: 'Leonardo' },
    });
  });

  it('should_save_preference_and_re_present_when_controller_selects_mode', () => {
    // Arrange
    const output = new HomeOutputStore();
    const registry = new GameModeRegistry(modes);
    const preference = new HomeSelectionPreference();
    const presenter = new HomePresenter(output, registry);
    const controller = new HomeController(
      registry,
      { navigate: () => undefined },
      preference,
      presenter,
    );

    // Act
    controller.selectMode('fit');

    // Assert
    expect(preference.load()).toBe('fit');
    expect(output.current?.selectedModeId).toBe('fit');
  });

  it('should_emit_direct_entry_when_lines_or_merge_is_selected', () => {
    // Arrange
    const registry = new GameModeRegistry(modes);
    const destinations: HomeDestination[] = [];
    const controller = new HomeController(registry, {
      navigate: (entryKind) => {
        destinations.push(entryKind);
      },
    });

    // Act
    controller.play('lines');
    controller.play('merge');

    // Assert
    expect(destinations).toEqual(['DIRECT', 'DIRECT']);
  });

  it('should_emit_levels_entry_when_fit_or_sort_is_selected', () => {
    // Arrange
    const registry = new GameModeRegistry(modes);
    const destinations: HomeDestination[] = [];
    const controller = new HomeController(registry, {
      navigate: (entryKind) => {
        destinations.push(entryKind);
      },
    });

    // Act
    controller.play('fit');
    controller.play('sort');

    // Assert
    expect(destinations).toEqual(['LEVELS', 'LEVELS']);
  });

  it('should_emit_no_navigation_when_entry_kind_is_unsupported', () => {
    // Arrange
    const invalidDescriptor = {
      ...modes[0],
      id: 'experimental',
      entryKind: 'UNSUPPORTED' as unknown as GameModeDescriptor['entryKind'],
    };
    const registry = new GameModeRegistry([invalidDescriptor]);
    let navigated = false;
    const controller = new HomeController(registry, {
      navigate: () => {
        navigated = true;
      },
    });

    // Act
    controller.play('experimental');

    // Assert
    expect(navigated).toBe(false);
  });

  it('should_open_settings_when_settings_action_is_triggered', () => {
    // Arrange
    const registry = new GameModeRegistry(modes);
    let destination: HomeDestination | null = null;
    const controller = new HomeController(registry, {
      navigate: (target) => {
        destination = target;
      },
    });

    // Act
    controller.openSettings();

    // Assert
    expect(destination).toBe('SETTINGS');
  });

  it('should_emit_ranking_entry_when_points_is_opened_with_session', () => {
    // Arrange
    const registry = new GameModeRegistry(modes);
    let destination: HomeDestination | null = null;
    const controller = new HomeController(registry, {
      navigate: (entryKind) => {
        destination = entryKind;
      },
    });

    // Act
    const navigated = controller.openPoints(true);

    // Assert
    expect(navigated).toBe(true);
    expect(destination).toBe('RANKING');
  });

  it('should_emit_login_entry_when_points_is_opened_without_session', () => {
    // Arrange
    const registry = new GameModeRegistry(modes);
    let destination: HomeDestination | null = null;
    const controller = new HomeController(registry, {
      navigate: (entryKind) => {
        destination = entryKind;
      },
    });

    // Act
    const navigated = controller.openPoints(false);

    // Assert
    expect(navigated).toBe(true);
    expect(destination).toBe('LOGIN');
  });

  it('should_not_navigate_and_return_false_when_points_is_unavailable', () => {
    // Arrange
    const registry = new GameModeRegistry(modes);
    let destination: HomeDestination | null = null;
    const controller = new HomeController(registry, {
      navigate: (target) => {
        destination = target;
      },
    });

    // Act
    const navigated = controller.openPoints(true, false);

    // Assert
    expect(navigated).toBe(false);
    expect(destination).toBeNull();
  });

  it('should_open_login_or_ranking_when_session_action_is_triggered', () => {
    // Arrange
    const registry = new GameModeRegistry(modes);
    const destinations: HomeDestination[] = [];
    const controller = new HomeController(registry, {
      navigate: (target) => {
        destinations.push(target);
      },
    });

    // Act
    controller.openSession(false);
    controller.openSession(true);

    // Assert
    expect(destinations).toEqual(['LOGIN', 'RANKING']);
  });

  it('should_render_empty_state_when_no_modes_are_registered', () => {
    // Arrange
    const output = new HomeOutputStore();
    const presenter = new HomePresenter(output, new GameModeRegistry());

    // Act
    presenter.present({ selectedModeId: null, state: 'NORMAL' });

    // Assert
    expect(output.current?.state).toBe('EMPTY');
  });

  it('should_resolve_translated_keys_and_interpolate_parameters_when_using_text_catalog', () => {
    // Arrange
    const catalog = new StaticTextCatalog(
      {
        'common.levels_progress': {
          es: 'Niveles: {done} de {total}',
          en: 'Levels: {done} of {total}',
        },
      },
      'es',
    );

    // Act
    const spanish = catalog.resolve({
      key: 'common.levels_progress',
      parameters: { done: 3, total: 15 },
    });
    const english = catalog.resolve(
      {
        key: 'common.levels_progress',
        parameters: { done: 3, total: 15 },
      },
      'en',
    );

    // Assert
    expect(spanish).toBe('Niveles: 3 de 15');
    expect(english).toBe('Levels: 3 of 15');
  });

  it('should_resolve_registered_asset_and_return_null_when_key_is_unknown', () => {
    // Arrange
    const resolver = new StaticAssetResolver<string>({
      lines: 'preview-lines',
    });

    // Act & Assert
    expect(resolver.resolve('lines')).toBe('preview-lines');
    expect(resolver.resolve('unknown')).toBeNull();
    expect(resolver.resolve('toString')).toBeNull();
  });

  it('should_share_theme_changes_across_multiple_controllers_when_using_same_theme_controller', () => {
    // Arrange
    const themePreference = new InMemoryThemePreference();
    const sharedTheme = new ThemeController(themePreference, 'light');
    const observed: ThemeMode[] = [];
    sharedTheme.subscribe((mode) => observed.push(mode));

    const settingsLikeController = {
      changeTheme(theme: IThemeController, mode: ThemeMode) {
        theme.setMode(mode);
      },
    };

    const pauseLikeController = {
      toggle(theme: IThemeController) {
        return theme.toggleTheme();
      },
    };

    // Act
    pauseLikeController.toggle(sharedTheme);
    settingsLikeController.changeTheme(sharedTheme, 'light');

    // Assert
    expect(sharedTheme.getMode()).toBe('light');
    expect(themePreference.load()).toBe('light');
    expect(observed).toEqual(['dark', 'light']);
  });
});
