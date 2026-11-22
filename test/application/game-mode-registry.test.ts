import { GameModeRegistry } from '../../src/adapters/GameModeRegistry';
import type { GameModeDescriptor } from '../../src/application/modes';

const descriptor: GameModeDescriptor = {
  id: 'hexa-lines',
  nameKey: 'games.lines.name',
  descriptionKey: 'games.lines.description',
  entryKind: 'LEVELS',
  progressDescriptor: 'stars',
  previewKey: 'lines',
  iconKey: 'lines',
  accentColor: '#0891B2',
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

  it('should_return_all_registered_modes_when_home_loads', () => {
    // Arrange
    const mergeDescriptor: GameModeDescriptor = {
      ...descriptor,
      id: 'hexa-merge',
      entryKind: 'DIRECT',
    };
    const registry = new GameModeRegistry([descriptor, mergeDescriptor]);

    // Act
    const result = registry.findAll();

    // Assert
    expect(result).toEqual([descriptor, mergeDescriptor]);
  });

  it('should_return_added_fifth_mode_when_descriptor_is_registered', () => {
    // Arrange
    const fifthDescriptor: GameModeDescriptor = {
      ...descriptor,
      id: 'hexa-fill',
      entryKind: 'DIRECT',
    };
    const registry = new GameModeRegistry([descriptor]);

    // Act
    registry.register(fifthDescriptor);
    const result = registry.findAll();

    // Assert
    expect(result).toContain(fifthDescriptor);
  });

  it.each(['DIRECT', 'LEVELS'] as const)(
    'should_keep_entry_kind_%s_when_descriptor_is_registered',
    (entryKind) => {
      // Arrange
      const modeDescriptor: GameModeDescriptor = {
        ...descriptor,
        id: `mode-${entryKind.toLowerCase()}`,
        entryKind,
      };
      const registry = new GameModeRegistry([modeDescriptor]);

      // Act
      const result = registry.findById(modeDescriptor.id);

      // Assert
      expect(result?.entryKind).toBe(entryKind);
    },
  );
});
