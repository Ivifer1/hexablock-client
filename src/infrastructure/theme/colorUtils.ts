export function withAlpha(hex: string, alphaHex: string): string {
  if (/^#[0-9A-Fa-f]{6}$/.test(hex)) return `${hex}${alphaHex}`;
  return hex;
}
