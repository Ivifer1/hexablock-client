import { SvgXml } from 'react-native-svg';

export interface MenuIconSvgOptions {
  readonly color: string;
  readonly cutoutColor: string;
  readonly size: number;
  readonly filled: boolean;
}

function hexPoints(cx: number, cy: number, radius: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 6; i += 1) {
    const rad = ((-90 + i * 60) * Math.PI) / 180;
    const x = (cx + radius * Math.cos(rad)).toFixed(2);
    const y = (cy + radius * Math.sin(rad)).toFixed(2);
    pts.push(`${x},${y}`);
  }
  return pts.join(' ');
}

function sixToothGearPoints(
  cx: number,
  cy: number,
  innerRadius: number,
  outerRadius: number,
): string {
  const offsets = [
    { deg: -17, r: innerRadius },
    { deg: -10, r: outerRadius },
    { deg: 10, r: outerRadius },
    { deg: 17, r: innerRadius },
  ];
  const pts: string[] = [];
  for (let i = 0; i < 6; i += 1) {
    const baseDeg = -90 + i * 60;
    for (const { deg, r } of offsets) {
      const rad = ((baseDeg + deg) * Math.PI) / 180;
      const x = (cx + r * Math.cos(rad)).toFixed(2);
      const y = (cy + r * Math.sin(rad)).toFixed(2);
      pts.push(`${x},${y}`);
    }
  }
  return pts.join(' ');
}

export function buildPointsIconSvg({
  color,
  cutoutColor,
  size,
  filled,
}: MenuIconSvgOptions): string {
  const cupFill = filled ? color : 'none';
  const strokeWidth = filled ? '1.6' : '1.85';
  const innerHex = filled
    ? `<polygon points="${hexPoints(12, 8.6, 1.8)}" fill="${cutoutColor}"/>`
    : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none">
    <path d="M7 4h10v5.5L14.5 13.5h-5L7 9.5V4Z" fill="${cupFill}" stroke="${color}" stroke-width="${strokeWidth}" stroke-linejoin="round"/>
    <path d="M7 5.5H4.5v2.2a2.6 2.6 0 0 0 2.5 2.6" fill="none" stroke="${color}" stroke-width="${filled ? '2' : '1.85'}" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M17 5.5h2.5v2.2a2.6 2.6 0 0 1-2.5 2.6" fill="none" stroke="${color}" stroke-width="${filled ? '2' : '1.85'}" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M12 13.5v4" fill="none" stroke="${color}" stroke-width="${filled ? '2' : '1.85'}" stroke-linecap="round"/>
    <path d="M8.5 20.5l1-3h5l1 3h-7Z" fill="${cupFill}" stroke="${color}" stroke-width="${strokeWidth}" stroke-linejoin="round"/>
    ${innerHex}
  </svg>`;
}

export function buildPlayHexIconSvg({
  color,
  cutoutColor,
  size,
  filled,
}: MenuIconSvgOptions): string {
  const hexPath =
    'M10.64 2.98Q12 2.2 13.36 2.98L19.13 6.32Q20.49 7.1 20.49 8.67L20.49 15.33Q20.49 16.9 19.13 17.68L13.36 21.02Q12 21.8 10.64 21.02L4.87 17.68Q3.51 16.9 3.51 15.33L3.51 8.67Q3.51 7.1 4.87 6.32Z';
  const playPath =
    'M9.5 9.41Q9.5 8.4 10.37 8.9L14.83 11.5Q15.7 12 14.83 12.5L10.37 15.1Q9.5 15.6 9.5 14.59Z';

  if (filled) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none">
      <path d="${hexPath}" fill="${color}"/>
      <path d="${playPath}" fill="${cutoutColor}"/>
    </svg>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none">
    <path d="${hexPath}" fill="none" stroke="${color}" stroke-width="1.85" stroke-linejoin="round"/>
    <path d="${playPath}" fill="none" stroke="${color}" stroke-width="1.75" stroke-linejoin="round"/>
  </svg>`;
}

export function buildSettingsIconSvg({
  color,
  cutoutColor,
  size,
  filled,
}: MenuIconSvgOptions): string {
  const outerPoints = sixToothGearPoints(12, 12, 7.2, 9.7);
  const innerPoints = hexPoints(12, 12, 3.3);

  if (filled) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none">
      <polygon points="${outerPoints}" fill="${color}" stroke="${color}" stroke-width="1.2" stroke-linejoin="round"/>
      <polygon points="${innerPoints}" fill="${cutoutColor}"/>
    </svg>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none">
    <polygon points="${outerPoints}" fill="none" stroke="${color}" stroke-width="1.85" stroke-linejoin="round"/>
    <polygon points="${innerPoints}" fill="none" stroke="${color}" stroke-width="1.85" stroke-linejoin="round"/>
  </svg>`;
}

export function buildPlayGlyphSvg(color: string, size: number): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none">
    <path d="M6.5 6.4Q6.5 4.8 7.9 5.6L17.9 11.2Q19.3 12 17.9 12.8L7.9 18.4Q6.5 19.2 6.5 17.6Z" fill="${color}"/>
  </svg>`;
}

export function buildThemeIconSvg(isDark: boolean, color: string, size: number): string {
  if (isDark) {
    const rays = Array.from({ length: 6 }, (_, i) => {
      const rad = ((-90 + i * 60) * Math.PI) / 180;
      const x1 = (12 + 6.8 * Math.cos(rad)).toFixed(2);
      const y1 = (12 + 6.8 * Math.sin(rad)).toFixed(2);
      const x2 = (12 + 9.6 * Math.cos(rad)).toFixed(2);
      const y2 = (12 + 9.6 * Math.sin(rad)).toFixed(2);
      return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="1.85" stroke-linecap="round"/>`;
    }).join('');
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none">
      <polygon points="${hexPoints(12, 12, 4.2)}" fill="none" stroke="${color}" stroke-width="1.85" stroke-linejoin="round"/>
      ${rays}
    </svg>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none">
    <path d="M20.2 14.5A8.2 8.2 0 0 1 9.5 3.8a8.2 8.2 0 1 0 10.7 10.7Z" fill="none" stroke="${color}" stroke-width="1.85" stroke-linejoin="round"/>
  </svg>`;
}

export function buildSessionIconSvg(
  hasSession: boolean,
  color: string,
  size: number,
): string {
  if (hasSession) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none">
      <polygon points="${hexPoints(12, 8, 3.6)}" fill="${color}"/>
      <path d="M5.5 19.5a6.5 6.5 0 0 1 13 0" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
    </svg>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none">
    <path d="M13 4h4.5a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H13" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M4.5 12h10.5" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
    <path d="M11 8.5 15 12l-4 3.5" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

export function PointsMenuIcon(props: MenuIconSvgOptions) {
  return (
    <SvgXml
      xml={buildPointsIconSvg(props)}
      width={props.size}
      height={props.size}
    />
  );
}

export function PlayMenuIcon(props: MenuIconSvgOptions) {
  return (
    <SvgXml
      xml={buildPlayHexIconSvg(props)}
      width={props.size}
      height={props.size}
    />
  );
}

export function SettingsMenuIcon(props: MenuIconSvgOptions) {
  return (
    <SvgXml
      xml={buildSettingsIconSvg(props)}
      width={props.size}
      height={props.size}
    />
  );
}

export function PlayGlyphIcon({ color, size }: { readonly color: string; readonly size: number }) {
  return <SvgXml xml={buildPlayGlyphSvg(color, size)} width={size} height={size} />;
}

export function ThemeToggleIcon({
  isDark,
  color,
  size,
}: {
  readonly isDark: boolean;
  readonly color: string;
  readonly size: number;
}) {
  return <SvgXml xml={buildThemeIconSvg(isDark, color, size)} width={size} height={size} />;
}

export function SessionActionIcon({
  hasSession,
  color,
  size,
}: {
  readonly hasSession: boolean;
  readonly color: string;
  readonly size: number;
}) {
  return <SvgXml xml={buildSessionIconSvg(hasSession, color, size)} width={size} height={size} />;
}
