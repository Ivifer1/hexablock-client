import { SvgIcon } from './SvgIcon';
import { HEXA_MERGE_SVG } from './svgSources';
import type { ModeIconProps } from './types';

export function MergeIcon(props: ModeIconProps) {
  return <SvgIcon {...props} xml={HEXA_MERGE_SVG} />;
}
