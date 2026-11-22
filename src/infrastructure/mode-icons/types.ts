import type { ComponentType } from 'react';

export interface ModeIconProps {
  readonly color: string;
  readonly size: number;
  readonly isSelected: boolean;
}

/** SVG (or vector) icon component registered for a mode `iconKey`. */
export type ModeIconComponent = ComponentType<ModeIconProps>;

/** Map of `GameModeDescriptor.iconKey` → icon component. */
export type ModeIconCatalog = Readonly<Record<string, ModeIconComponent>>;
