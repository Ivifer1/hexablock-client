import { FitIcon } from './FitIcon';
import { LinesIcon } from './LinesIcon';
import { MergeIcon } from './MergeIcon';
import { SortIcon } from './SortIcon';
import type { ModeIconCatalog } from './types';

/**
 * Mode icons keyed by `GameModeDescriptor.iconKey`.
 * Source files also live under `assets/ui/mode-icons/`.
 */
export const modeIconCatalog: ModeIconCatalog = {
  lines: LinesIcon,
  fit: FitIcon,
  sort: SortIcon,
  merge: MergeIcon,
};
