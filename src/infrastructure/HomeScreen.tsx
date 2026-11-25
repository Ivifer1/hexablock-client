import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Platform,
  StatusBar as RNStatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import type {
  IAssetResolver,
  IHomeController,
  ITextCatalog,
  IThemeController,
  SupportedLocale,
} from '../application/ports';
import type { HomeModeDTO, HomeViewDTO } from '../application/value-objects';
import { HexModeSelector, type ExtendedHomeModeDTO } from './HexModeSelector';
import type { IHomePreview } from './home-previews';
import { HomeBottomMenu, type HomeMenuItemKey } from './home/HomeBottomMenu';
import { HomeHeader } from './home/HomeHeader';
import { HomeModeCard } from './home/HomeModeCard';
import type { HomeProgressFormatterMap } from './home/progressFormatters';
import { computeHomeLayoutMetrics } from './homeLayout';
import type { ModeIconComponent } from './mode-icons';
import {
  MOTION,
  SPACING,
  TYPOGRAPHY,
  useTheme,
  type Theme,
} from './theme';
import { AppButton, MenuScreenShell } from './ui';
import { PlayGlyphIcon } from './ui-icons/MenuIcons';

export type { ExtendedHomeModeDTO };

const USE_NATIVE_DRIVER = Platform.OS !== 'web';

export interface HomeScreenProps {
  readonly view: HomeViewDTO;
  readonly controller: IHomeController;
  readonly textCatalog: ITextCatalog;
  readonly themeController?: IThemeController;
  readonly locale?: SupportedLocale;
  readonly modeIconResolver?: IAssetResolver<ModeIconComponent>;
  readonly previewResolver?: IAssetResolver<IHomePreview>;
  readonly progressFormatters?: HomeProgressFormatterMap;
}

function splitHeroTitle(title: string): { readonly lead: string; readonly tail: string | null } {
  const lastSpaceIndex = title.trim().lastIndexOf(' ');
  if (lastSpaceIndex <= 0) {
    return { lead: title, tail: null };
  }
  return {
    lead: title.slice(0, lastSpaceIndex),
    tail: title.slice(lastSpaceIndex + 1),
  };
}

export function HomeScreen({
  view,
  controller,
  textCatalog,
  themeController,
  locale = 'es',
  modeIconResolver,
  previewResolver,
  progressFormatters,
}: HomeScreenProps) {
  const { theme, isDark } = useTheme(themeController);
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

  const modesList = view.modes;
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

  const resolveShortLabel = (mode: HomeModeDTO) =>
    mode.shortName
      ? textCatalog.resolve(mode.shortName, locale)
      : textCatalog.resolve(mode.name, locale);

  const { lead: titleLead, tail: titleTail } = splitHeroTitle(
    textCatalog.resolve(view.title, locale),
  );
  const playNowText = textCatalog.resolve('home.play_now', locale);
  const selectedPlayLabel = selected
    ? textCatalog.resolve(
        {
          key: 'home.play_mode',
          parameters: { name: textCatalog.resolve(selected.name, locale) },
        },
        locale,
      )
    : playNowText;

  return (
    <MenuScreenShell
      theme={theme}
      isDark={isDark}
      horizontalPadding={layout.horizontalPadding}
      topSafeInset={layout.topSafeInset}
      bodyPaddingBottom={layout.bodyPaddingBottom}
      header={
        <HomeHeader
          sessionLabel={textCatalog.resolve(view.sessionLabel, locale)}
          hasSession={view.hasSession}
          fontScale={layout.fontScale}
          theme={theme}
          isDark={isDark}
          onPressSession={() => controller.openSession(view.hasSession)}
        />
      }
      bottomMenu={
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
      }
    >
      <View
        style={[
          styles.mainBody,
          { paddingVertical: layout.mainBodyPaddingVertical },
        ]}
      >
            <Text
              accessibilityRole="header"
              style={[
                styles.heroTitle,
                {
                  fontSize: layout.heroTitleFontSize,
                  lineHeight: layout.heroTitleLineHeight,
                },
              ]}
            >
              {titleLead}
              {titleTail ? (
                <>
                  {' '}
                  {'\n'}
                  <Text
                    style={[
                      styles.heroTitleTail,
                      {
                        fontSize: layout.heroTitleTailFontSize,
                        lineHeight: layout.heroTitleTailLineHeight,
                      },
                    ]}
                  >
                    {titleTail}
                  </Text>
                </>
              ) : null}
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
                  layout={layout}
                  theme={theme}
                  isDark={isDark}
                  reduceMotion={reduceMotion}
                  modeIconResolver={modeIconResolver}
                  previewResolver={previewResolver}
                  resolveModeName={(mode) => textCatalog.resolve(mode.name, locale)}
                  resolveShortLabel={resolveShortLabel}
                  prevModeLabel={textCatalog.resolve('home.prev_mode', locale)}
                  nextModeLabel={textCatalog.resolve('home.next_mode', locale)}
                  middleContent={
                    selected ? (
                      <HomeModeCard
                        mode={selected}
                        shortLabel={resolveShortLabel(selected)}
                        errorMessage={view.errorMessage}
                        cardOpacity={cardOpacity}
                        layout={layout}
                        theme={theme}
                        isDark={isDark}
                        textCatalog={textCatalog}
                        locale={locale}
                        modeIconResolver={modeIconResolver}
                        progressFormatters={progressFormatters}
                      />
                    ) : null
                  }
                />

                {selected ? (
                  <AppButton
                    testID="home-play-button"
                    label={playNowText}
                    accessibilityLabel={selectedPlayLabel}
                    variant="primary"
                    size="l"
                    fullWidth
                    fontScale={layout.fontScale}
                    theme={theme}
                    isDark={isDark}
                    style={{ marginTop: layout.sectionGap }}
                    leftIcon={({ color, size }) => (
                      <PlayGlyphIcon color={color} size={size} />
                    )}
                    onPress={() => controller.play(selected.id)}
                  />
                ) : null}
              </>
            )}
      </View>
    </MenuScreenShell>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    mainBody: {
      flex: 1,
      width: '100%',
      maxWidth: 480,
      alignSelf: 'center',
      justifyContent: 'center',
    },
    heroTitle: {
      marginTop: 0,
      textAlign: 'center',
      fontWeight: '800',
      color: theme.textPrimary,
      letterSpacing: -0.5,
    },
    heroTitleTail: {
      fontWeight: '500',
      color: theme.textSecondary,
      letterSpacing: -0.2,
    },
    heroSubtitle: {
      marginTop: SPACING.s1,
      textAlign: 'center',
      fontSize: TYPOGRAPHY.body.fontSize,
      lineHeight: TYPOGRAPHY.body.lineHeight,
      color: theme.textSecondary,
      paddingHorizontal: SPACING.s2,
    },
    heroSubtitleNarrow: {
      fontSize: TYPOGRAPHY.caption.fontSize,
      lineHeight: TYPOGRAPHY.caption.lineHeight,
    },
    heroSubtitleCompact: { marginTop: 2 },
    empty: { height: 220, alignItems: 'center', justifyContent: 'center' },
    emptyText: { color: theme.textSecondary, fontSize: TYPOGRAPHY.subtitle.fontSize },
  });
}
