import { SvgIcon } from './SvgIcon';
import { HEXA_BLOCK_SVG } from './svgSources';
import type { ModeIconProps } from './types';

export function BlockIcon(props: ModeIconProps) {
  return <SvgIcon {...props} xml={HEXA_BLOCK_SVG} />;
}
