import { useMemo } from 'react';
import {
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import { HomePreviewVisual, type IHomePreview } from '../home-previews';
import { AnimatedPulse, MOTION_SPRINGS, SwipeableSurface } from '../motion';
import { BORDER_WIDTH, RADIUS, type Theme } from '../theme';
import { ChevronIcon } from '../ui-icons/MenuIcons';
import { withAlpha } from './shared';

export interface HexShowcaseFrameProps {
  readonly showcaseSize: number;
  readonly arrowButtonSize: number;
  readonly arrowGap: number;
  readonly activePreview: IHomePreview | null;
  readonly pulseKey: string;
  readonly reduceMotion?: boolean;
  readonly totalModes: number;
  readonly prevModeLabel: string;
  readonly nextModeLabel: string;
  readonly theme: Theme;
  readonly isDark: boolean;
  readonly onPrevMode: () => void;
  readonly onNextMode: () => void;
}

const HEX_PATH =
  'M 99.61,22 Q 110,16 120.39,22 L 181.02,57 Q 191.41,63 191.41,75 L 191.41,145 Q 191.41,157 181.02,163 L 120.39,198 Q 110,204 99.61,198 L 38.98,163 Q 28.59,157 28.59,145 L 28.59,75 Q 28.59,63 38.98,57 Z';

function buildHexShowcaseFrameSvg(
  fillColor: string,
  primaryColor: string,
  highlightColor: string,
): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220" viewBox="0 0 220 220" fill="none">
    <defs>
      <linearGradient id="hexBorderGrad" x1="30" y1="20" x2="190" y2="200" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="${highlightColor}"/>
        <stop offset="55%" stop-color="${primaryColor}"/>
        <stop offset="100%" stop-color="${highlightColor}"/>
      </linearGradient>
    </defs>
    <path d="${HEX_PATH}" stroke="${primaryColor}" stroke-opacity="0.28" stroke-width="8" stroke-linejoin="round"/>
    <path d="${HEX_PATH}" fill="${fillColor}" stroke="url(#hexBorderGrad)" stroke-width="4" stroke-linejoin="round"/>
    <g stroke="#FFFFFF" stroke-opacity="0.06" stroke-width="1">
      <line x1="110" y1="28" x2="110" y2="192"/>
      <line x1="38" y1="70" x2="182" y2="150"/>
      <line x1="182" y1="70" x2="38" y2="150"/>
    </g>
  </svg>`;
}

function buildFallbackPreviewSvg(color: string, size: number): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64" fill="none">
    <polygon points="32,8 52,20 52,44 32,56 12,44 12,20" fill="${color}" fill-opacity="0.25" stroke="${color}" stroke-width="2.5" stroke-linejoin="round"/>
    <polygon points="32,18 44,25 44,39 32,46 20,39 20,25" fill="${color}"/>
  </svg>`;
}

export function HexShowcaseFrame({
  showcaseSize,
  arrowButtonSize,
  arrowGap,
  activePreview,
  pulseKey,
  reduceMotion,
  totalModes,
  prevModeLabel,
  nextModeLabel,
  theme,
  isDark,
  onPrevMode,
  onNextMode,
}: HexShowcaseFrameProps) {
  const styles = useMemo(() => createStyles(theme), [theme]);
  const frameSvg = useMemo(
    () => buildHexShowcaseFrameSvg(theme.centerSurface, theme.primary, theme.primaryHover),
    [theme.centerSurface, theme.primary, theme.primaryHover],
  );
  const fallbackSvg = useMemo(
    () => buildFallbackPreviewSvg(theme.primary, Math.round(showcaseSize * 0.45)),
    [theme.primary, showcaseSize],
  );

  const arrowSurface = isDark ? withAlpha(theme.surface, 'E6') : theme.surface;

  return (
    <View style={[styles.row, { gap: arrowGap }]}>
      {totalModes > 1 ? (
        <Pressable
          testID="home-prev-mode-button"
          accessibilityRole="button"
          accessibilityLabel={prevModeLabel}
          onPress={onPrevMode}
          hitSlop={8}
          style={({ pressed }) => [
            styles.arrowButton,
            {
              width: arrowButtonSize,
              height: arrowButtonSize,
              backgroundColor: arrowSurface,
              borderColor: theme.borderDefault,
            },
            pressed && styles.arrowButtonPressed,
          ]}
        >
          <ChevronIcon direction="left" color={theme.textPrimary} size={18} />
        </Pressable>
      ) : null}

      <SwipeableSurface
        testID="home-hex-showcase"
        enabled={totalModes > 1}
        onSwipeLeft={onNextMode}
        onSwipeRight={onPrevMode}
        style={[
          styles.showcaseContainer,
          { width: showcaseSize, height: showcaseSize },
        ]}
      >
        <View
          pointerEvents="none"
          style={[
            styles.showcaseAura,
            {
              width: showcaseSize * 0.96,
              height: showcaseSize * 0.96,
              borderRadius: (showcaseSize * 0.96) / 2,
              backgroundColor: withAlpha(theme.primary, isDark ? '24' : '18'),
            },
          ]}
        />
        <View pointerEvents="none" style={styles.frameSvgLayer}>
          <SvgXml xml={frameSvg} width={showcaseSize} height={showcaseSize} />
        </View>

        <AnimatedPulse
          triggerKey={pulseKey}
          spring={MOTION_SPRINGS.corePulse}
          reduceMotion={reduceMotion}
          style={styles.previewLayer}
        >
          {activePreview ? (
            <HomePreviewVisual
              preview={activePreview}
              size={Math.round(showcaseSize * 0.72)}
              testID="home-center-preview"
              reduceMotion={reduceMotion}
            />
          ) : (
            <SvgXml
              xml={fallbackSvg}
              width={Math.round(showcaseSize * 0.45)}
              height={Math.round(showcaseSize * 0.45)}
              testID="home-center-preview"
            />
          )}
        </AnimatedPulse>
      </SwipeableSurface>

      {totalModes > 1 ? (
        <Pressable
          testID="home-next-mode-button"
          accessibilityRole="button"
          accessibilityLabel={nextModeLabel}
          onPress={onNextMode}
          hitSlop={8}
          style={({ pressed }) => [
            styles.arrowButton,
            {
              width: arrowButtonSize,
              height: arrowButtonSize,
              backgroundColor: arrowSurface,
              borderColor: theme.borderDefault,
            },
            pressed && styles.arrowButtonPressed,
          ]}
        >
          <ChevronIcon direction="right" color={theme.textPrimary} size={18} />
        </Pressable>
      ) : null}
    </View>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
    },
    arrowButton: {
      borderRadius: RADIUS.full,
      borderWidth: BORDER_WIDTH.thin,
      alignItems: 'center',
      justifyContent: 'center',
      ...theme.shadowLow,
    },
    arrowButtonPressed: {
      opacity: 0.85,
      transform: [{ scale: 0.94 }],
    },
    showcaseContainer: {
      position: 'relative',
      alignItems: 'center',
      justifyContent: 'center',
    },
    showcaseAura: {
      position: 'absolute',
      ...theme.shadowGlowPrimary,
    },
    frameSvgLayer: {
      ...StyleSheet.absoluteFill,
      alignItems: 'center',
      justifyContent: 'center',
    },
    previewLayer: {
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2,
    },
  });
}
