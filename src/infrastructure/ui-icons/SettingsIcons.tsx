import { SvgXml } from 'react-native-svg';

export interface SettingsIconProps {
  readonly color: string;
  readonly size: number;
}

function escapeXmlText(value: string): string {
  return value.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 2);
}

export function buildBackArrowSvg(color: string, size: number): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none">
    <path d="M19 12H5" stroke="${color}" stroke-width="2.1" stroke-linecap="round"/>
    <path d="M11 6l-6 6 6 6" stroke="${color}" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

export function buildMusicNoteSvg(color: string, size: number): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none">
    <path d="M10 17V6.5l8-2V15" stroke="${color}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="7.5" cy="17.5" r="2.5" stroke="${color}" stroke-width="1.9"/>
    <circle cx="15.5" cy="15.5" r="2.5" stroke="${color}" stroke-width="1.9"/>
  </svg>`;
}

export function buildSoundEffectsSvg(color: string, size: number): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none">
    <path d="M5 9.5h3.5L13.5 5v14l-5-4.5H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1Z" stroke="${color}" stroke-width="1.9" stroke-linejoin="round"/>
    <path d="M16.8 8.8a4.5 4.5 0 0 1 0 6.4" stroke="${color}" stroke-width="1.9" stroke-linecap="round"/>
    <path d="M19.4 6.2a8.2 8.2 0 0 1 0 11.6" stroke="${color}" stroke-width="1.9" stroke-linecap="round"/>
  </svg>`;
}

export function buildGlobeSvg(color: string, size: number): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="8.5" stroke="${color}" stroke-width="1.85"/>
    <ellipse cx="12" cy="12" rx="3.8" ry="8.5" stroke="${color}" stroke-width="1.65"/>
    <path d="M3.8 12h16.4" stroke="${color}" stroke-width="1.65" stroke-linecap="round"/>
  </svg>`;
}

export function buildLanguageBadgeSvg(
  code: string,
  color: string,
  fillColor: string,
  textColor: string,
  size: number,
): string {
  const monogram = escapeXmlText(code) || 'LN';
  const hexPath =
    'M10.64 2.98Q12 2.2 13.36 2.98L19.13 6.32Q20.49 7.1 20.49 8.67L20.49 15.33Q20.49 16.9 19.13 17.68L13.36 21.02Q12 21.8 10.64 21.02L4.87 17.68Q3.51 16.9 3.51 15.33L3.51 8.67Q3.51 7.1 4.87 6.32Z';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none">
    <path d="${hexPath}" fill="${fillColor}" stroke="${color}" stroke-width="1.6" stroke-linejoin="round"/>
    <text x="12" y="14.7" text-anchor="middle" font-family="sans-serif" font-size="7.6" font-weight="700" fill="${textColor}">${monogram}</text>
  </svg>`;
}

export function buildCheckCircleSvg(
  color: string,
  checkColor: string,
  size: number,
): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill="${color}"/>
    <path d="M7.5 12.2l3 3 6-6.2" stroke="${checkColor}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

export function buildRadioCircleSvg(
  borderColor: string,
  innerDotColor: string,
  size: number,
): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="${borderColor}" stroke-width="1.8"/>
    <circle cx="12" cy="12" r="3" fill="${innerDotColor}"/>
  </svg>`;
}

export function buildLogoutSvg(color: string, size: number): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none">
    <path d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4" stroke="${color}" stroke-width="1.95" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M19.5 12H9" stroke="${color}" stroke-width="1.95" stroke-linecap="round"/>
    <path d="M15.5 8.5 19.5 12l-4 3.5" stroke="${color}" stroke-width="1.95" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

export function buildAlertCircleSvg(color: string, size: number): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9.5" stroke="${color}" stroke-width="1.9"/>
    <path d="M12 7.8v5.2" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
    <circle cx="12" cy="16.2" r="1.1" fill="${color}"/>
  </svg>`;
}

export function BackArrowIcon({ color, size }: SettingsIconProps) {
  return <SvgXml xml={buildBackArrowSvg(color, size)} width={size} height={size} />;
}

export function MusicNoteIcon({ color, size }: SettingsIconProps) {
  return <SvgXml xml={buildMusicNoteSvg(color, size)} width={size} height={size} />;
}

export function SoundEffectsIcon({ color, size }: SettingsIconProps) {
  return <SvgXml xml={buildSoundEffectsSvg(color, size)} width={size} height={size} />;
}

export function GlobeIcon({ color, size }: SettingsIconProps) {
  return <SvgXml xml={buildGlobeSvg(color, size)} width={size} height={size} />;
}

export function LanguageBadgeIcon({
  code,
  color,
  fillColor,
  textColor,
  size,
}: {
  readonly code: string;
  readonly color: string;
  readonly fillColor: string;
  readonly textColor: string;
  readonly size: number;
}) {
  return (
    <SvgXml
      xml={buildLanguageBadgeSvg(code, color, fillColor, textColor, size)}
      width={size}
      height={size}
    />
  );
}

export function CheckCircleIcon({
  color,
  checkColor,
  size,
}: {
  readonly color: string;
  readonly checkColor: string;
  readonly size: number;
}) {
  return (
    <SvgXml xml={buildCheckCircleSvg(color, checkColor, size)} width={size} height={size} />
  );
}

export function RadioCircleIcon({
  borderColor,
  innerDotColor,
  size,
}: {
  readonly borderColor: string;
  readonly innerDotColor: string;
  readonly size: number;
}) {
  return (
    <SvgXml
      xml={buildRadioCircleSvg(borderColor, innerDotColor, size)}
      width={size}
      height={size}
    />
  );
}

export function LogoutIcon({ color, size }: SettingsIconProps) {
  return <SvgXml xml={buildLogoutSvg(color, size)} width={size} height={size} />;
}

export function AlertCircleIcon({ color, size }: SettingsIconProps) {
  return <SvgXml xml={buildAlertCircleSvg(color, size)} width={size} height={size} />;
}
