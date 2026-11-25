import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar as RNStatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import type {
  IAssetResolver,
  IHomeController,
  ITextCatalog,
  SupportedLocale,
} from '../application/ports';
import type { HomeModeDTO, HomeViewDTO } from '../application/value-objects';
import { HexModeSelector, type ExtendedHomeModeDTO } from './HexModeSelector';
import type { HomePreviewAsset } from './home-previews';
import { HomeBottomMenu, type HomeMenuItemKey } from './home/HomeBottomMenu';
import { HomeHeader } from './home/HomeHeader';
import { HomeModeCard } from './home/HomeModeCard';
import { HomeSessionBar } from './home/HomeSessionBar';
import { computeHomeLayoutMetrics } from './homeLayout';
import type { ModeIconComponent } from './mode-icons';
import { MOTION, RADIUS, SPACING, TYPOGRAPHY, useTheme, type Theme } from './theme';

export type { ExtendedHomeModeDTO };

const USE_NATIVE_DRIVER = Platform.OS !== 'web';

export interface HomeScreenProps {
  readonly view: HomeViewDTO;
  readonly controller: IHomeController;
  readonly textCatalog: ITextCatalog;
  readonly locale?: SupportedLocale;
  readonly modeIconResolver?: IAssetResolver<ModeIconComponent>;
  readonly previewResolver?: IAssetResolver<HomePreviewAsset>;
}

function withAlpha(hex: string, alphaHex: string): string {
  if (/^#[0-9A-Fa-f]{6}$/.test(hex)) return `${hex}${alphaHex}`;
  return hex;
}

export function HomeScreen({
  view,
  controller,
  textCatalog,
  locale = 'es',
  modeIconResolver,
  previewResolver,
}: HomeScreenProps) {
  const { theme, isDark, toggleTheme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { width: viewportWidth, height: viewportHeight } = useWindowDimensions();
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (mounted) setReduceMotion(enabled);
    });
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReduceMotion,
    );
    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  const layout = computeHomeLayoutMetrics(
    viewportWidth,
    viewportHeight,
    Platform.OS,
    Platform.OS === 'android' ? (RNStatusBar.currentHeight ?? 0) : 0,
  );

  const modesList = view.modes as readonly ExtendedHomeModeDTO[];
  const selectedId = view.selectedModeId ?? modesList[0]?.id ?? null;
  const [selectedMenu, setSelectedMenu] = useState<HomeMenuItemKey>('PLAY');
  const [cardOpacity] = useState(() => new Animated.Value(1));
  const isCardInitialMount = useRef(true);

  const selected = useMemo(
    () =>
      modesList.find((mode) => mode.id === selectedId) ??
      modesList.find((mode) => mode.isSelected) ??
      null,
    [modesList, selectedId],
  );

  useEffect(() => {
    if (isCardInitialMount.current) {
      isCardInitialMount.current = false;
      return;
    }
    if (reduceMotion) {
      cardOpacity.setValue(1);
      return;
    }

    cardOpacity.setValue(0.72);
    Animated.timing(cardOpacity, {
      toValue: 1,
      duration: Math.round(MOTION.selectionMs * 0.7),
      useNativeDriver: USE_NATIVE_DRIVER,
    }).start();
  }, [selectedId, reduceMotion, cardOpacity]);

  const handleSelectMode = (mode: HomeModeDTO) => {
    controller.selectMode(mode.id);
  };

  return (
    <SafeAreaView style={styles.page}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View style={styles.atmosphere} pointerEvents="none">
        <View
          style={[
            styles.atmosphereBlob,
            styles.atmosphereBlobTop,
            { backgroundColor: withAlpha(theme.primary, isDark ? '22' : '14') },
          ]}
        />
        <View
          style={[
            styles.atmosphereBlob,
            styles.atmosphereBlobBottom,
            { backgroundColor: withAlpha(theme.primary, isDark ? '14' : '0A') },
          ]}
        />
      </View>

      <View style={styles.content}>
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingHorizontal: layout.horizontalPadding,
              paddingTop: layout.topSafeInset,
              paddingBottom: layout.compact ? SPACING.s2 : SPACING.s3,
            },
          ]}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <HomeHeader
            title={textCatalog.resolve(view.title, locale)}
            toggleLabel={textCatalog.resolve(
              isDark ? 'home.theme_toggle_light' : 'home.theme_toggle_dark',
              locale,
            )}
            fontScale={layout.fontScale}
            theme={theme}
            isDark={isDark}
            onToggleTheme={toggleTheme}
          />

          <View style={[styles.mainBody, layout.compact && styles.mainBodyCompact]}>
            <Text
              accessibilityRole="header"
              style={[
                styles.heroTitle,
                {
                  fontSize: (layout.narrow ? 22 : 26) * layout.fontScale,
                  lineHeight: (layout.narrow ? 28 : 34) * layout.fontScale,
                },
              ]}
            >
              {textCatalog.resolve(view.heroTitle, locale)}
            </Text>
            <Text
              style={[
                styles.heroSubtitle,
                layout.narrow && styles.heroSubtitleNarrow,
                layout.compact && styles.heroSubtitleCompact,
              ]}
            >
              {textCatalog.resolve(view.heroSubtitle, locale)}
            </Text>

            {view.state === 'EMPTY' ? (
              <View style={styles.empty}>
                <Text style={styles.emptyText}>
                  {textCatalog.resolve('home.empty', locale)}
                </Text>
              </View>
            ) : (
              <>
                <HexModeSelector
                  modes={modesList}
                  selectedId={selectedId}
                  onSelectMode={handleSelectMode}
                  wheelSize={layout.wheelSize}
                  selectorHeight={layout.selectorHeight}
                  modeIconSize={layout.modeIconSize}
                  selectedModeIconSize={layout.selectedModeIconSize}
                  marginTop={layout.narrow || layout.compact ? SPACING.s2 : SPACING.s4}
                  theme={theme}
                  isDark={isDark}
                  reduceMotion={reduceMotion}
                  modeIconResolver={modeIconResolver}
                  previewResolver={previewResolver}
                  resolveModeName={(mode) => textCatalog.resolve(mode.name, locale)}
                  resolveShortLabel={(mode) =>
                    mode.shortName ??
                    textCatalog.resolve(mode.name, locale).replace(/^Hexa\s+/i, '').toUpperCase()
                  }
                />

                {selected ? (
                  <HomeModeCard
                    mode={selected}
                    errorMessage={view.errorMessage}
                    cardOpacity={cardOpacity}
                    layout={layout}
                    theme={theme}
                    isDark={isDark}
                    textCatalog={textCatalog}
                    locale={locale}
                    onPlay={() => controller.play(selected.id)}
                  />
                ) : null}
              </>
            )}

            <HomeSessionBar
              label={textCatalog.resolve(view.sessionLabel, locale)}
              hasSession={view.hasSession}
              theme={theme}
              isDark={isDark}
              fontScale={layout.fontScale}
              onPress={() => controller.openSession(view.hasSession)}
            />
          </View>
        </ScrollView>

        <HomeBottomMenu
          selectedMenu={selectedMenu}
          isPointsAvailable={view.isPointsAvailable}
          menuHeight={layout.menuHeight}
          bottomSafeInset={layout.bottomSafeInset}
          menuIconSize={layout.menuIconSize}
          theme={theme}
          textCatalog={textCatalog}
          locale={locale}
          onPressPoints={() => {
            const navigated = controller.openPoints(
              view.hasSession,
              view.isPointsAvailable,
            );
            if (navigated) {
              setSelectedMenu('POINTS');
            }
          }}
          onPressPlay={() => {
            setSelectedMenu('PLAY');
            if (selected) {
              controller.play(selected.id);
            }
          }}
          onPressSettings={() => {
            setSelectedMenu('SETTINGS');
            controller.openSettings();
          }}
        />
      </View>
    </SafeAreaView>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    page: { flex: 1, backgroundColor: theme.bg },
    atmosphere: {
      ...StyleSheet.absoluteFill,
      overflow: 'hidden',
    },
    atmosphereBlob: {
      position: 'absolute',
      borderRadius: RADIUS.full,
    },
    atmosphereBlobTop: {
      width: 280,
      height: 280,
      top: -80,
      right: -60,
    },
    atmosphereBlobBottom: {
      width: 240,
      height: 240,
      bottom: 80,
      left: -80,
    },
    content: {
      flex: 1,
      width: '100%',
      alignSelf: 'center',
    },
    mainBody: {
      flex: 1,
      width: '100%',
      maxWidth: 480,
      alignSelf: 'center',
      justifyContent: 'center',
      paddingVertical: SPACING.s3,
    },
    mainBodyCompact: {
      paddingVertical: SPACING.s2,
    },
    scrollArea: { flex: 1, width: '100%' },
    scrollContent: { flexGrow: 1 },
    heroTitle: {
      marginTop: 0,
      textAlign: 'center',
      fontWeight: '700',
      color: theme.textPrimary,
      letterSpacing: -0.4,
      fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', default: undefined }),
    },
    heroSubtitle: {
      marginTop: SPACING.s1,
      textAlign: 'center',
      fontSize: TYPOGRAPHY.body.fontSize,
      lineHeight: TYPOGRAPHY.body.lineHeight,
      color: theme.textSecondary,
      paddingHorizontal: SPACING.s4,
    },
    heroSubtitleNarrow: {
      fontSize: TYPOGRAPHY.caption.fontSize,
      lineHeight: TYPOGRAPHY.caption.lineHeight,
    },
    heroSubtitleCompact: { marginTop: SPACING.s1 / 2 },
    empty: { height: 220, alignItems: 'center', justifyContent: 'center' },
    emptyText: { color: theme.textSecondary, fontSize: TYPOGRAPHY.subtitle.fontSize },
  });
}
