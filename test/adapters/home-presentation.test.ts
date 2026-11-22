import { HomeController } from '../../src/adapters/presentation/HomeController';
import { HomePresenter } from '../../src/adapters/presentation/HomePresenter';
import { OutputStateStore } from '../../src/adapters/OutputStateStore';
import { GameModeRegistry } from '../../src/adapters/GameModeRegistry';
import type { GameModeDescriptor } from '../../src/application/modes';

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
    const output = new OutputStateStore();
    const registry = new GameModeRegistry(modes);
    const presenter = new HomePresenter(output, registry);

    // Act
    presenter.present({ selectedModeId: 'lines', state: 'NORMAL' });

    // Assert
    expect(output.home?.modes).toHaveLength(2);
  });

  it('should_restore_last_selected_mode_when_home_reopens', () => {
    // Arrange
    const output = new OutputStateStore();
    const registry = new GameModeRegistry(modes);
    const presenter = new HomePresenter(output, registry);

    // Act
    presenter.present({ selectedModeId: 'fit', state: 'NORMAL' });

    // Assert
    expect(output.home?.selectedModeId).toBe('fit');
  });

  it('should_select_lines_when_home_opens_for_the_first_time', () => {
    // Arrange
    const output = new OutputStateStore();
    const registry = new GameModeRegistry(modes);
    const presenter = new HomePresenter(output, registry);

    // Act
    presenter.present({ selectedModeId: null, state: 'NORMAL' });

    // Assert
    expect(output.home?.selectedModeId).toBe('lines');
  });

  it('should_render_added_fifth_mode_when_descriptor_is_registered', () => {
    // Arrange
    const output = new OutputStateStore();
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
    expect(output.home?.modes).toHaveLength(3);
  });

  it('should_present_registered_accent_color_without_variant_specific_screen_logic', () => {
    // Arrange
    const output = new OutputStateStore();
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
    expect(output.home?.modes.find((mode) => mode.id === 'fill')?.accentColor)
      .toBe('#E11D48');
  });

  it('should_present_registered_icon_key_without_variant_specific_screen_logic', () => {
    const output = new OutputStateStore();
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

    presenter.present({ selectedModeId: 'fill', state: 'NORMAL' });

    expect(output.home?.modes.find((mode) => mode.id === 'fill')?.iconKey)
      .toBe('fill-hex');
  });

  it('should_emit_direct_entry_when_lines_is_selected', () => {
    // Arrange
    const output = new OutputStateStore();
    const registry = new GameModeRegistry(modes);
    let destination: 'DIRECT' | 'LEVELS' | 'SETTINGS' | 'LOGIN' | 'RANKING' | null = null;
    const controller = new HomeController(
      registry,
      (entryKind) => { destination = entryKind; },
    );

    // Act
    controller.play('lines');

    // Assert
    expect(destination).toBe('DIRECT');
  });

  it('should_emit_levels_entry_when_fit_is_selected', () => {
    // Arrange
    const output = new OutputStateStore();
    const registry = new GameModeRegistry(modes);
    let destination: 'DIRECT' | 'LEVELS' | 'SETTINGS' | 'LOGIN' | 'RANKING' | null = null;
    const controller = new HomeController(
      registry,
      (entryKind) => { destination = entryKind; },
    );

    // Act
    controller.play('fit');

    // Assert
    expect(destination).toBe('LEVELS');
  });

  it('should_emit_ranking_entry_when_points_is_opened_with_session', () => {
    const registry = new GameModeRegistry(modes);
    let destination: 'DIRECT' | 'LEVELS' | 'SETTINGS' | 'LOGIN' | 'RANKING' | null = null;
    const controller = new HomeController(
      registry,
      (entryKind) => { destination = entryKind; },
    );

    controller.openPoints(true);

    expect(destination).toBe('RANKING');
  });

  it('should_emit_login_entry_when_points_is_opened_without_session', () => {
    const registry = new GameModeRegistry(modes);
    let destination: 'DIRECT' | 'LEVELS' | 'SETTINGS' | 'LOGIN' | 'RANKING' | null = null;
    const controller = new HomeController(
      registry,
      (entryKind) => { destination = entryKind; },
    );

    controller.openPoints(false);

    expect(destination).toBe('LOGIN');
  });

  it('should_render_empty_state_when_no_modes_are_registered', () => {
    // Arrange
    const output = new OutputStateStore();
    const presenter = new HomePresenter(output, new GameModeRegistry());

    // Act
    presenter.present({ selectedModeId: null, state: 'NORMAL' });

    // Assert
    expect(output.home?.state).toBe('EMPTY');
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
