import { GameModeRegistry } from '../../src/adapters/GameModeRegistry';
import type { GameModeDescriptor } from '../../src/application/modes';

const descriptor: GameModeDescriptor = {
  id: 'hexa-lines',
  nameKey: 'games.lines.name',
  descriptionKey: 'games.lines.description',
  entryKind: 'LEVELS',
  progressDescriptor: 'stars',
  hudComponents: ['score'],
  controls: ['pause'],
};

describe('GameModeRegistry', () => {
  it('should_return_registered_descriptor_when_identifier_exists', () => {
    // Arrange
    const registry = new GameModeRegistry([descriptor]);

    // Act
    const result = registry.findById(descriptor.id);

    // Assert
    expect(result).toBe(descriptor);
  });

  it('should_return_none_when_identifier_is_not_registered', () => {
    // Arrange
    const registry = new GameModeRegistry();

    // Act
    const result = registry.findById('unknown-mode');

    // Assert
    expect(result).toBeUndefined();
  });

  it('should_reject_duplicate_identifier_when_registering_mode', () => {
    // Arrange
    const registry = new GameModeRegistry([descriptor]);

    // Act
    const registerDuplicate = () => registry.register(descriptor);

    // Assert
    expect(registerDuplicate).toThrow(
      'A game mode with id "hexa-lines" is already registered.',
    );
  });
});
