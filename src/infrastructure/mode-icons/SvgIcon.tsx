import { SvgXml } from 'react-native-svg';
import type { ModeIconProps } from './types';

interface SvgIconProps extends ModeIconProps {
  readonly xml: string;
}

/** Renders a fixed multi-color SVG scaled to `size` (ignores theme tint). */
export function SvgIcon({ xml, size }: SvgIconProps) {
  return <SvgXml xml={xml} width={size} height={size} />;
}
