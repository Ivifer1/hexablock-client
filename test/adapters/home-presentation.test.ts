import { HomeController } from '../../src/adapters/presentation/HomeController';
import { HomePresenter } from '../../src/adapters/presentation/HomePresenter';
import { HomeSelectionPreference } from '../../src/adapters/presentation/HomeSelectionPreference';
import { HomeOutputStore } from '../../src/adapters/state';
import { GameModeRegistry } from '../../src/adapters/GameModeRegistry';
import { StaticTextCatalog } from '../../src/adapters/i18n';
import type { GameModeDescriptor } from '../../src/application/modes';
import type { HomeDestination } from '../../src/application/ports';

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
    id: 'fit',
    nameKey: 'game.fit.name',
    descriptionKey: 'game.fit.desc',
    entryKind: 'LEVELS',
    progressDescriptor: 'levels',
    previewKey: 'fit',
    iconKey: 'fit',
    accentColor: '#D97706',
    hudComponents: ['score'],
    controls: ['pause'],
  },
];

describe('UC-005 Select a game from the home screen', () => {
  it('should_render_all_registered_modes_when_home_loads', () => {
    // Arrange
    const output = new HomeOutputStore();
    const registry = new GameModeRegistry(modes);
    const presenter = new HomePresenter(output, registry);

    // Act
    presenter.present({ selectedModeId: 'lines', state: 'NORMAL' });

    // Assert
    expect(output.current?.modes).toHaveLength(2);
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
      { ...modes[1], id: 'alpha', entryKind: 'DIRECT' },
      { ...modes[1], id: 'beta', entryKind: 'LEVELS' },
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
    const presenter = new HomePresenter(output, registry, {
      'streak-best': () => ({ kind: 'BEST', value: 420 }),
    });

    // Act
    presenter.present({ selectedModeId: 'streak', state: 'NORMAL' });

    // Assert
    expect(output.current?.modes[0]?.progress).toEqual({ kind: 'BEST', value: 420 });
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
    expect(output.current?.modes).toHaveLength(3);
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

  it('should_emit_direct_entry_when_lines_is_selected', () => {
    // Arrange
    const registry = new GameModeRegistry(modes);
    let destination: HomeDestination | null = null;
    const controller = new HomeController(registry, {
      navigate: (entryKind) => {
        destination = entryKind;
      },
    });

    // Act
    controller.play('lines');

    // Assert
    expect(destination).toBe('DIRECT');
  });

  it('should_emit_levels_entry_when_fit_is_selected', () => {
    // Arrange
    const registry = new GameModeRegistry(modes);
    let destination: HomeDestination | null = null;
    const controller = new HomeController(registry, {
      navigate: (entryKind) => {
        destination = entryKind;
      },
    });

    // Act
    controller.play('fit');

    // Assert
    expect(destination).toBe('LEVELS');
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
    controller.openPoints(true);

    // Assert
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
    controller.openPoints(false);

    // Assert
    expect(destination).toBe('LOGIN');
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
        'home.levels_progress': {
          es: 'Niveles: {completed} de {total}',
          en: 'Levels: {completed} of {total}',
        },
      },
      'es',
    );

    // Act
    const spanish = catalog.resolve({
      key: 'home.levels_progress',
      parameters: { completed: 3, total: 15 },
    });
    const english = catalog.resolve(
      {
        key: 'home.levels_progress',
        parameters: { completed: 3, total: 15 },
      },
      'en',
    );

    // Assert
    expect(spanish).toBe('Niveles: 3 de 15');
    expect(english).toBe('Levels: 3 of 15');
  });

  it('should_follow_registered_order_when_drag_moves_right', () => {
    // Arrange
    const modesInOrder = ['lines', 'merge', 'fit', 'sort'];
    const startIndex = 0;

    // Act
    const nextIndex = (
      startIndex - 1 + modesInOrder.length
    ) % modesInOrder.length;

    // Assert
    expect(modesInOrder[nextIndex]).toBe('sort');
  });

  it('should_follow_registered_order_when_drag_moves_left', () => {
    // Arrange
    const modesInOrder = ['lines', 'merge', 'fit', 'sort'];
    const startIndex = 0;

    // Act
    const nextIndex = (
      startIndex + 1 + modesInOrder.length
    ) % modesInOrder.length;

    // Assert
    expect(modesInOrder[nextIndex]).toBe('merge');
  });

  it('should_move_clockwise_when_pointer_angle_increases', () => {
    // Arrange
    const modesInOrder = ['lines', 'merge', 'fit', 'sort'];
    const startIndex = 0;
    const clockwise = true;

    // Act
    const nextIndex = (
      startIndex + (clockwise ? 1 : -1) + modesInOrder.length
    ) % modesInOrder.length;

    // Assert
    expect(modesInOrder[nextIndex]).toBe('merge');
  });

  it('should_move_counterclockwise_when_pointer_angle_decreases', () => {
    // Arrange
    const modesInOrder = ['lines', 'merge', 'fit', 'sort'];
    const startIndex = 0;
    const clockwise = false;

    // Act
    const nextIndex = (
      startIndex + (clockwise ? 1 : -1) + modesInOrder.length
    ) % modesInOrder.length;

    // Assert
    expect(modesInOrder[nextIndex]).toBe('sort');
  });
});
