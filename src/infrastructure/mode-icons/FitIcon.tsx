import { SvgIcon } from './SvgIcon';
import { HEXA_FIT_SVG } from './svgSources';
import type { ModeIconProps } from './types';

export function FitIcon(props: ModeIconProps) {
  return <SvgIcon {...props} xml={HEXA_FIT_SVG} />;
}
