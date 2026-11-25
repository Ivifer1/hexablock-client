import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { RADIUS, withAlpha, type Theme } from '../theme';

export interface MenuBackgroundProps {
  readonly theme: Theme;
  readonly isDark: boolean;
  readonly testID?: string;
}

export function buildMenuHexPatternSvg(color: string, isDark: boolean): string {
  const fillOpacity = isDark ? '0.06' : '0.05';
  const strokeOpacity = isDark ? '0.1' : '0.08';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="800" viewBox="0 0 400 800" fill="none">
    <polygon points="44,195 72,211 72,243 44,259 16,243 16,211" fill="${color}" fill-opacity="${fillOpacity}" stroke="${color}" stroke-opacity="${strokeOpacity}" stroke-width="1"/>
    <polygon points="88,225 110,238 110,264 88,277 66,264 66,238" fill="${color}" fill-opacity="${fillOpacity}"/>
    <polygon points="356,220 390,240 390,280 356,300 322,280 322,240" fill="${color}" fill-opacity="${fillOpacity}" stroke="${color}" stroke-opacity="${strokeOpacity}" stroke-width="1"/>
    <polygon points="318,292 344,307 344,337 318,352 292,337 292,307" fill="${color}" fill-opacity="${fillOpacity}"/>
    <polygon points="36,560 66,577 66,611 36,628 6,611 6,577" fill="${color}" fill-opacity="${fillOpacity}"/>
    <polygon points="364,530 392,546 392,578 364,594 336,578 336,546" fill="${color}" fill-opacity="${fillOpacity}"/>
  </svg>`;
}

/**
 * Standardized decorative background shared across primary menu screens
 * (radial atmosphere blobs plus subtle hexagonal vector overlay).
 */
export function MenuBackground({
  theme,
  isDark,
  testID = 'menu-background',
}: MenuBackgroundProps) {
  const patternSvg = useMemo(
    () => buildMenuHexPatternSvg(theme.primary, isDark),
    [theme.primary, isDark],
  );

  return (
    <View testID={testID} style={styles.atmosphere} pointerEvents="none">
      <View
        style={[
          styles.atmosphereBlob,
          styles.atmosphereBlobTop,
          { backgroundColor: withAlpha(theme.primary, isDark ? '18' : '12') },
        ]}
      />
      <View
        style={[
          styles.atmosphereBlob,
          styles.atmosphereBlobBottom,
          { backgroundColor: withAlpha(theme.primary, isDark ? '10' : '0A') },
        ]}
      />
      <View testID={`${testID}-hex-pattern`} style={styles.hexOverlay}>
        <SvgXml xml={patternSvg} width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  atmosphere: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
  },
  atmosphereBlob: {
    position: 'absolute',
    borderRadius: RADIUS.full,
  },
  atmosphereBlobTop: {
    width: 300,
    height: 300,
    top: -90,
    right: -70,
  },
  atmosphereBlobBottom: {
    width: 260,
    height: 260,
    bottom: 70,
    left: -90,
  },
  hexOverlay: {
    ...StyleSheet.absoluteFill,
  },
});
