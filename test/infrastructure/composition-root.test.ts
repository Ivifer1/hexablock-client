import { CompositionRoot } from '../../src/infrastructure/CompositionRoot';
import type { GameModeDescriptor } from '../../src/application/modes';

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

  it('should_expose_empty_output_state_when_composition_root_is_created', () => {
    // Arrange
    const root = new CompositionRoot();

    // Act
    const outputState = root.outputState;

    // Assert
    expect(outputState.hud).toBeUndefined();
    expect(outputState.controls).toBeUndefined();
    expect(outputState.levelSelection).toBeUndefined();
    expect(outputState.victory).toBeUndefined();
    expect(outputState.defeat).toBeUndefined();
  });
});
