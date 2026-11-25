/** Raw SVG markup matching `assets/ui/home-previews/*.svg` for Expo Go / Web / Jest. */

const HONEYCOMB_CELLS = [
  '62.3,25.5 74.86,32.75 74.86,47.25 62.3,54.5 49.74,47.25 49.74,32.75',
  '90,25.5 102.56,32.75 102.56,47.25 90,54.5 77.44,47.25 77.44,32.75',
  '117.7,25.5 130.26,32.75 130.26,47.25 117.7,54.5 105.14,47.25 105.14,32.75',
  '48.45,49.5 61.01,56.75 61.01,71.25 48.45,78.5 35.89,71.25 35.89,56.75',
  '76.15,49.5 88.71,56.75 88.71,71.25 76.15,78.5 63.59,71.25 63.59,56.75',
  '103.85,49.5 116.41,56.75 116.41,71.25 103.85,78.5 91.29,71.25 91.29,56.75',
  '131.55,49.5 144.11,56.75 144.11,71.25 131.55,78.5 118.99,71.25 118.99,56.75',
  '34.6,73.5 47.16,80.75 47.16,95.25 34.6,102.5 22.04,95.25 22.04,80.75',
  '62.3,73.5 74.86,80.75 74.86,95.25 62.3,102.5 49.74,95.25 49.74,80.75',
  '90,73.5 102.56,80.75 102.56,95.25 90,102.5 77.44,95.25 77.44,80.75',
  '117.7,73.5 130.26,80.75 130.26,95.25 117.7,102.5 105.14,95.25 105.14,80.75',
  '145.4,73.5 157.96,80.75 157.96,95.25 145.4,102.5 132.84,95.25 132.84,80.75',
  '48.45,97.5 61.01,104.75 61.01,119.25 48.45,126.5 35.89,119.25 35.89,104.75',
  '76.15,97.5 88.71,104.75 88.71,119.25 76.15,126.5 63.59,119.25 63.59,104.75',
  '103.85,97.5 116.41,104.75 116.41,119.25 103.85,126.5 91.29,119.25 91.29,104.75',
  '131.55,97.5 144.11,104.75 144.11,119.25 131.55,126.5 118.99,119.25 118.99,104.75',
  '62.3,121.5 74.86,128.75 74.86,143.25 62.3,150.5 49.74,143.25 49.74,128.75',
  '90,121.5 102.56,128.75 102.56,143.25 90,150.5 77.44,143.25 77.44,128.75',
  '117.7,121.5 130.26,128.75 130.26,143.25 117.7,150.5 105.14,143.25 105.14,128.75',
]
  .map((pts) => `<polygon points="${pts}"/>`)
  .join('');

const HONEYCOMB_GROUP = `<g fill="#1C2233" stroke="#2E3750" stroke-width="1.2" stroke-linejoin="round">${HONEYCOMB_CELLS}</g>`;

function beveledHex(cx: number, cy: number, top: string, bevel: string, stroke: string): string {
  const rx = 12.56;
  const ry = 7.25;
  const r = 14.5;
  const d = 5;
  const x0 = (cx - rx).toFixed(2);
  const x1 = cx.toFixed(2);
  const x2 = (cx + rx).toFixed(2);
  const yTop = (cy - r).toFixed(2);
  const yUpper = (cy - ry).toFixed(2);
  const yLower = (cy + ry).toFixed(2);
  const yBottom = (cy + r).toFixed(2);
  const yLowerBevel = (cy + ry + d).toFixed(2);
  const yBottomBevel = (cy + r + d).toFixed(2);

  return (
    `<path d="M${x2},${yLower} L${x2},${yLowerBevel} L${x1},${yBottomBevel} L${x0},${yLowerBevel} L${x0},${yLower} L${x1},${yBottom} Z" fill="${bevel}"/>` +
    `<polygon points="${x1},${yTop} ${x2},${yUpper} ${x2},${yLower} ${x1},${yBottom} ${x0},${yLower} ${x0},${yUpper}" fill="${top}" stroke="${stroke}" stroke-width="1.3" stroke-linejoin="round"/>`
  );
}

export const HEXA_LINES_PREVIEW_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180" fill="none">${HONEYCOMB_GROUP}${beveledHex(62.3, 40, '#7B4BC9', '#552F96', '#9F75E8')}${beveledHex(90, 40, '#7B4BC9', '#552F96', '#9F75E8')}${beveledHex(117.7, 40, '#7B4BC9', '#552F96', '#9F75E8')}${beveledHex(131.55, 64, '#7B4BC9', '#552F96', '#9F75E8')}${beveledHex(48.45, 64, '#14B8A6', '#0E7490', '#22D3EE')}${beveledHex(34.6, 88, '#0891B2', '#0E7490', '#22D3EE')}${beveledHex(62.3, 88, '#14B8A6', '#0E7490', '#22D3EE')}${beveledHex(48.45, 112, '#0891B2', '#0E7490', '#22D3EE')}${beveledHex(117.7, 88, '#F59E0B', '#B45309', '#FCD34D')}${beveledHex(103.85, 112, '#E8A200', '#B45309', '#FCD34D')}${beveledHex(131.55, 112, '#F59E0B', '#B45309', '#FCD34D')}${beveledHex(117.7, 136, '#E8A200', '#B45309', '#FCD34D')}</svg>`;

export const HEXA_MERGE_PREVIEW_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180" fill="none">${HONEYCOMB_GROUP}<g stroke-linejoin="round"><path d="M108.19,70.5 L108.19,76.5 L90,87 L71.81,76.5 L71.81,70.5 L90,81 Z" fill="#0E7490"/><polygon points="90,39 108.19,49.5 108.19,70.5 90,81 71.81,70.5 71.81,49.5" fill="#0891B2" stroke="#22D3EE" stroke-width="1.6"/><text x="90" y="66" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-weight="800" font-size="18" fill="#FFFFFF">16</text><path d="M74.19,120.5 L74.19,126.5 L56,137 L37.81,126.5 L37.81,120.5 L56,131 Z" fill="#065F46"/><polygon points="56,89 74.19,99.5 74.19,120.5 56,131 37.81,120.5 37.81,99.5" fill="#059669" stroke="#34D399" stroke-width="1.6"/><text x="56" y="116" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-weight="800" font-size="18" fill="#FFFFFF">4</text><path d="M142.19,120.5 L142.19,126.5 L124,137 L105.81,126.5 L105.81,120.5 L124,131 Z" fill="#906400"/><polygon points="124,89 142.19,99.5 142.19,120.5 124,131 105.81,120.5 105.81,99.5" fill="#E8A200" stroke="#FCD34D" stroke-width="1.6"/><text x="124" y="116" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-weight="800" font-size="18" fill="#1B1B1F">8</text></g></svg>`;

export const HEXA_SORT_PREVIEW_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180" fill="none">${HONEYCOMB_GROUP}<g stroke-linejoin="round" stroke-width="1.4"><polygon points="50,104 68,114.4 68,131 50,141.4 32,131 32,114.4" fill="#2F6BD6" stroke="#1D4285"/><polygon points="50,95 68,105.4 68,122 50,132.4 32,122 32,105.4" fill="#7C3AED" stroke="#4C1D95"/><polygon points="50,86 68,96.4 68,113 50,123.4 32,113 32,96.4" fill="#D9482B" stroke="#872D1B"/><polygon points="130,104 148,114.4 148,131 130,141.4 112,131 112,114.4" fill="#059669" stroke="#065F46"/><polygon points="130,95 148,105.4 148,122 130,132.4 112,122 112,105.4" fill="#E8A200" stroke="#906400"/><polygon points="130,86 148,96.4 148,113 130,123.4 112,113 112,96.4" fill="#0891B2" stroke="#0E7490"/><polygon points="90,74 110,85.5 110,104 90,115.5 70,104 70,85.5" fill="#2F6BD6" stroke="#1D4285"/><polygon points="90,64 110,75.5 110,94 90,105.5 70,94 70,75.5" fill="#2F6BD6" stroke="#60A5FA"/><polygon points="90,54 110,65.5 110,84 90,95.5 70,84 70,65.5" fill="#D9482B" stroke="#FB7185"/><polygon points="90,44 110,55.5 110,74 90,85.5 70,74 70,55.5" fill="#EF4444" stroke="#FCA5A5"/></g></svg>`;

export const HEXA_FIT_PREVIEW_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180" fill="none">${HONEYCOMB_GROUP}<polygon points="90,46 130,69 130,115 90,138 50,115 50,69" fill="none" stroke="#F59E0B" stroke-width="1.8" stroke-dasharray="4 3" stroke-linejoin="round" stroke-opacity="0.7"/>${beveledHex(76.15, 64, '#2F9A4A', '#1D5F2E', '#4ADE80')}${beveledHex(62.3, 88, '#2F9A4A', '#1D5F2E', '#4ADE80')}${beveledHex(90, 88, '#2F9A4A', '#1D5F2E', '#4ADE80')}${beveledHex(103.85, 64, '#E8A200', '#906400', '#FCD34D')}${beveledHex(117.7, 88, '#E8A200', '#906400', '#FCD34D')}${beveledHex(103.85, 112, '#E8A200', '#906400', '#FCD34D')}${beveledHex(76.15, 112, '#7B4BC9', '#552F96', '#A78BFA')}${beveledHex(90, 136, '#7B4BC9', '#552F96', '#A78BFA')}</svg>`;
