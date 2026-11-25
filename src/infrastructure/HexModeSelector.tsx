import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Animated, Platform, StyleSheet, View } from 'react-native';
import type { IAssetResolver } from '../application/ports';
import type { IHomePreview } from './home-previews';
import { HexShowcaseFrame } from './home/HexShowcaseFrame';
import { ModeSelectorTile } from './home/ModeSelectorTile';
import type { ExtendedHomeModeDTO } from './home/shared';
import type { HomeLayoutMetrics } from './homeLayout';
import type { ModeIconComponent } from './mode-icons';
import type { Theme } from './theme';

export type { ExtendedHomeModeDTO };

const USE_NATIVE_DRIVER = Platform.OS !== 'web';

export interface HexModeSelectorProps {
  readonly modes: readonly ExtendedHomeModeDTO[];
  readonly selectedId: string | null;
  readonly onSelectMode: (mode: ExtendedHomeModeDTO) => void;
  readonly layout: HomeLayoutMetrics;
  readonly theme: Theme;
  readonly isDark: boolean;
  readonly reduceMotion: boolean;
  readonly modeIconResolver?: IAssetResolver<ModeIconComponent>;
  readonly previewResolver?: IAssetResolver<IHomePreview>;
  readonly resolveModeName: (mode: ExtendedHomeModeDTO) => string;
  readonly resolveShortLabel: (mode: ExtendedHomeModeDTO) => string;
  readonly prevModeLabel: string;
  readonly nextModeLabel: string;
  readonly middleContent?: ReactNode;
}

export function HexModeSelector({
  modes,
  selectedId,
  onSelectMode,
  layout,
  theme,
  isDark,
  reduceMotion,
  modeIconResolver,
  previewResolver,
  resolveModeName,
  resolveShortLabel,
  prevModeLabel,
  nextModeLabel,
  middleContent,
}: HexModeSelectorProps) {
  const [corePulse] = useState(() => new Animated.Value(1));
  const isInitialMountRef = useRef(true);
  const prevSelectedIdRef = useRef<string | null>(selectedId);

  useEffect(() => {
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      prevSelectedIdRef.current = selectedId;
      return;
    }

    const selectionChanged = prevSelectedIdRef.current !== selectedId;
    prevSelectedIdRef.current = selectedId;

    if (!selectionChanged) return;
    if (reduceMotion) {
      corePulse.setValue(1);
      return;
    }

    corePulse.setValue(0.92);
    Animated.spring(corePulse, {
      toValue: 1,
      stiffness: 220,
      damping: 16,
      mass: 0.8,
      useNativeDriver: USE_NATIVE_DRIVER,
    }).start();
  }, [selectedId, reduceMotion, corePulse]);

  const selectedIndex = Math.max(
    0,
    modes.findIndex((mode) => mode.id === selectedId),
  );
  const selectedMode = modes[selectedIndex] ?? modes[0] ?? null;
  const activePreview = selectedMode
    ? (previewResolver?.resolve(selectedMode.previewKey) ?? null)
    : null;

  const handleStepMode = (delta: number) => {
    if (modes.length <= 1) return;
    const nextIndex = (selectedIndex + delta + modes.length) % modes.length;
    const nextMode = modes[nextIndex];
    if (nextMode) {
      onSelectMode(nextMode);
    }
  };

  return (
    <View style={styles.selectorContainer}>
      <View style={{ marginVertical: layout.showcaseMarginVertical, width: '100%' }}>
        <HexShowcaseFrame
          showcaseSize={layout.showcaseSize}
          arrowButtonSize={layout.arrowButtonSize}
          arrowGap={layout.arrowGap}
          activePreview={activePreview}
          corePulse={corePulse}
          reduceMotion={reduceMotion}
          totalModes={modes.length}
          prevModeLabel={prevModeLabel}
          nextModeLabel={nextModeLabel}
          theme={theme}
          isDark={isDark}
          onPrevMode={() => handleStepMode(-1)}
          onNextMode={() => handleStepMode(1)}
        />
      </View>

      {middleContent}

      <View
        style={[
          styles.tileRow,
          {
            gap: layout.tileGap,
            marginTop: layout.sectionGap,
          },
        ]}
      >
        {modes.map((mode) => (
          <ModeSelectorTile
            key={mode.id}
            mode={mode}
            isSelected={mode.id === (selectedMode?.id ?? null)}
            tileHeight={layout.modeTileHeight}
            iconSize={layout.modeTileIconSize}
            fontScale={layout.fontScale}
            theme={theme}
            isDark={isDark}
            reduceMotion={reduceMotion}
            modeIconResolver={modeIconResolver}
            modeName={resolveModeName(mode)}
            shortLabel={resolveShortLabel(mode)}
            onSelectMode={onSelectMode}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  selectorContainer: {
    width: '100%',
    alignItems: 'center',
  },
  tileRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
