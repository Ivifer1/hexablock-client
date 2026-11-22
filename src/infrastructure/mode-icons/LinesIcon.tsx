import { SvgIcon } from './SvgIcon';
import { HEXA_LINES_SVG } from './svgSources';
import type { ModeIconProps } from './types';

export function LinesIcon(props: ModeIconProps) {
  return <SvgIcon {...props} xml={HEXA_LINES_SVG} />;
}
