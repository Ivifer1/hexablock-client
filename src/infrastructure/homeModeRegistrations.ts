import type { GameModeDescriptor } from '../application/modes';
import {
  HEXA_FIT_PREVIEW_SVG,
  HEXA_LINES_PREVIEW_SVG,
  HEXA_MERGE_PREVIEW_SVG,
  HEXA_SORT_PREVIEW_SVG,
  SvgHomePreview,
  type IHomePreview,
} from './home-previews';
import {
  FitIcon,
  LinesIcon,
  MergeIcon,
  SortIcon,
  type ModeIconComponent,
} from './mode-icons';

export interface GameModeRegistration {
  readonly descriptor: GameModeDescriptor;
  readonly icon: ModeIconComponent;
  readonly preview: IHomePreview;
}

/**
 * Unified variant registrations: each variant defines its descriptor, icon, and preview in one place (OCP).
 * Registered in launch order; the first entry becomes the initial default selection (BR-005-14).
 */
export const DEFAULT_HOME_MODE_REGISTRATIONS: readonly GameModeRegistration[] = [
  {
    descriptor: {
      id: 'lines',
      nameKey: 'game.lines.name',
      shortNameKey: 'game.lines.short_name',
      descriptionKey: 'game.lines.desc',
      entryKind: 'DIRECT',
      progressDescriptor: 'best',
      previewKey: 'lines',
      iconKey: 'lines',
      accentColor: '#0891B2',
      hudComponents: ['score'],
      controls: ['pause'],
    },
    icon: LinesIcon,
    preview: new SvgHomePreview(HEXA_LINES_PREVIEW_SVG),
  },
  {
    descriptor: {
      id: 'merge',
      nameKey: 'game.merge.name',
      shortNameKey: 'game.merge.short_name',
      descriptionKey: 'game.merge.desc',
      entryKind: 'DIRECT',
      progressDescriptor: 'best',
      previewKey: 'merge',
      iconKey: 'merge',
      accentColor: '#059669',
      hudComponents: ['score'],
      controls: ['pause'],
    },
    icon: MergeIcon,
    preview: new SvgHomePreview(HEXA_MERGE_PREVIEW_SVG),
  },
  {
    descriptor: {
      id: 'sort',
      nameKey: 'game.sort.name',
      shortNameKey: 'game.sort.short_name',
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
    icon: SortIcon,
    preview: new SvgHomePreview(HEXA_SORT_PREVIEW_SVG),
  },
  {
    descriptor: {
      id: 'fit',
      nameKey: 'game.fit.name',
      shortNameKey: 'game.fit.short_name',
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
    icon: FitIcon,
    preview: new SvgHomePreview(HEXA_FIT_PREVIEW_SVG),
  },
];
