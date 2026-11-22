import { SvgIcon } from './SvgIcon';
import { HEXA_SORT_SVG } from './svgSources';
import type { ModeIconProps } from './types';

export function SortIcon(props: ModeIconProps) {
  return <SvgIcon {...props} xml={HEXA_SORT_SVG} />;
}
