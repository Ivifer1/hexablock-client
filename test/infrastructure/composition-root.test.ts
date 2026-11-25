import { CompositionRoot } from '../../src/infrastructure/CompositionRoot';
import type { GameModeDescriptor } from '../../src/application/modes';
import type { HomeDestination } from '../../src/application/ports';

const descriptor: GameModeDescriptor = {
  id: 'hexa-fit',
  nameKey: 'games.fit.name',
  descriptionKey: 'games.fit.description',
  entryKind: 'DIRECT',
  progressDescriptor: 'best-score',
  previewKey: 'hexa-fit',
  iconKey: 'hexa-fit',
  accentColor: '#D97706',
  hudComponents: ['score', 'moves'],
  controls: ['pause', 'undo'],
};

describe('CompositionRoot', () => {
  it('should_expose_registered_modes_when_composition_root_is_created', () => {
    // Arrange
    const root = new CompositionRoot([descriptor]);

    // Act
    const modes = root.modeRegistry.findAll();

    // Assert
    expect(modes).toEqual([descriptor]);
  });

  it('should_expose_empty_output_stores_when_composition_root_is_created', () => {
    // Arrange
    const root = new CompositionRoot();

    // Act & Assert
    expect(root.homeOutput.current).toBeUndefined();
    expect(root.hudOutput.current).toBeUndefined();
    expect(root.controlsOutput.current).toBeUndefined();
    expect(root.levelSelectionOutput.current).toBeUndefined();
    expect(root.victoryOutput.current).toBeUndefined();
    expect(root.defeatOutput.current).toBeUndefined();
  });

  it('should_forward_navigation_and_selection_updates_when_home_controller_is_used', () => {
    // Arrange
    let navigatedTo: HomeDestination | null = null;
    const secondDescriptor: GameModeDescriptor = {
      ...descriptor,
      id: 'hexa-levels',
      entryKind: 'LEVELS',
    };
    const root = new CompositionRoot([descriptor, secondDescriptor], {
      navigate: (destination) => {
        navigatedTo = destination;
      },
    });
    root.initializeHome();

    // Act
    root.homeController.selectMode('hexa-levels');
    root.homeController.play('hexa-levels');

    // Assert
    expect(root.homeSelectionPreference.load()).toBe('hexa-levels');
    expect(root.homeOutput.current?.selectedModeId).toBe('hexa-levels');
    expect(navigatedTo).toBe('LEVELS');
  });
});
