export function canonicalWheelDeg(modeIndex: number, totalModes: number): number {
  if (totalModes <= 0) return 0;
  const value = -(360 * modeIndex) / totalModes;
  return value === 0 ? 0 : value;
}

export function computeShortestWheelTargetDeg(
  currentDeg: number,
  targetIndex: number,
  totalModes: number,
): number {
  if (totalModes <= 0) return currentDeg;
  const canonical = canonicalWheelDeg(targetIndex, totalModes);
  const delta = ((((canonical - currentDeg) % 360) + 540) % 360) - 180;
  return currentDeg + delta;
}

export function indexAtTopForRotationDeg(rotationDeg: number, totalModes: number): number {
  if (totalModes <= 0) return -1;
  return ((Math.round((-rotationDeg * totalModes) / 360) % totalModes) + totalModes) % totalModes;
}

export function wrapAngleDeltaRad(deltaRad: number): number {
  let wrapped = deltaRad;
  while (wrapped > Math.PI) wrapped -= Math.PI * 2;
  while (wrapped <= -Math.PI) wrapped += Math.PI * 2;
  return wrapped;
}

export function modeBaseAngleRad(modeIndex: number, totalModes: number): number {
  if (totalModes <= 0) return -Math.PI / 2;
  return (2 * Math.PI * modeIndex) / totalModes - Math.PI / 2;
}
