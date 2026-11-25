import type { GameModeDescriptor } from '../application/modes';

/**
 * Registered in launch order; the first entry becomes the initial default selection (BR-005-14).
 */
export const DEFAULT_HOME_MODE_DESCRIPTORS: readonly GameModeDescriptor[] = [
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
    previewKey: 'sort',
    iconKey: 'sort',
    accentColor: '#7C3AED',
    hudComponents: ['score'],
    controls: ['pause'],
  },
];
