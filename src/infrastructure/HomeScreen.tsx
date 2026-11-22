import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  LayoutAnimation,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  UIManager,
  View,
  useWindowDimensions,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import { StatusBar } from 'expo-status-bar';
import type { HomeModeDTO, HomeViewDTO } from '../application/value-objects';
import {
  BORDER_WIDTH,
  MOTION,
  RADIUS,
  SPACING,
  TYPOGRAPHY,
  useTheme,
} from '../adapters/presentation';
import type {
  HomeController,
  HomePresenter,
  HomeSelectionPreference,
  Theme,
} from '../adapters/presentation';
import { BlockIcon, type ModeIconCatalog } from './mode-icons';

export type ExtendedHomeModeDTO = HomeModeDTO & {
  readonly shortName?: string;
};

interface HomeScreenProps {
  readonly view: HomeViewDTO;
  readonly presenter: HomePresenter;
  readonly controller: HomeController;
  readonly preference: HomeSelectionPreference;
  readonly modeIcons?: ModeIconCatalog;
  readonly onNavigate: (destination: 'DIRECT' | 'LEVELS' | 'SETTINGS' | 'LOGIN' | 'RANKING') => void;
}

const catalog: Record<string, { readonly es: string; readonly en: string }> = {
  'app.title': { es: 'HexaBlock', en: 'HexaBlock' },
  'home.settings': { es: 'Ajustes', en: 'Settings' },
  'home.play': { es: 'Jugar', en: 'Play' },
  'home.points': { es: 'Puntos', en: 'Points' },
  'home.hero_title': { es: '¿A qué jugamos hoy?', en: 'What shall we play today?' },
  'home.hero_subtitle': { es: 'Cuatro formas de encontrar tu equilibrio.', en: 'Four ways to find your balance.' },
  'game.lines.name': { es: 'Hexa Lines', en: 'Hexa Lines' },
  'game.lines.desc': { es: 'Conecta líneas hexagonales continuas y despeja el tablero.', en: 'Connect continuous hexagonal lines and clear the board.' },
  'game.fit.name': { es: 'Hexa Fit', en: 'Hexa Fit' },
  'game.fit.desc': { es: 'Encaja todas las piezas en la figura.', en: 'Fit every piece into the shape.' },
  'game.sort.name': { es: 'Hexa Sort', en: 'Hexa Sort' },
  'game.sort.desc': { es: 'Apila y reúne fichas del mismo color.', en: 'Stack and gather tiles of the same color.' },
  'game.merge.name': { es: 'Hexa Merge', en: 'Hexa Merge' },
  'game.merge.desc': { es: 'Fusiona fichas hasta llegar a la meta.', en: 'Merge tiles until you reach the goal.' },
  'common.sign_in': { es: 'Iniciar sesión', en: 'Sign in' },
  'common.best_none': { es: 'Sin récord aún', en: 'No best score yet' },
  'common.best_value': { es: 'Mejor récord', en: 'Best score' },
  'home.error_progress': { es: 'No se pudo cargar tu progreso', en: "Couldn't load your progress" },
  'home.empty': { es: 'No hay juegos disponibles', en: 'No games available' },
};

function text(key: string, locale: 'es' | 'en'): string {
  return catalog[key]?.[locale] ?? key;
}

function withAlpha(hex: string, alphaHex: string): string {
  if (/^#[0-9A-Fa-f]{6}$/.test(hex)) return `${hex}${alphaHex}`;
  return hex;
}

function renderModeIcon(
  mode: ExtendedHomeModeDTO,
  color: string,
  size: number,
  isSelected: boolean,
  modeIcons: ModeIconCatalog | undefined,
) {
  const Icon = modeIcons?.[mode.iconKey];
  if (Icon) {
    return <Icon color={color} size={size} isSelected={isSelected} />;
  }

  const initial = (mode.shortName ?? mode.id ?? 'G').slice(0, 1).toUpperCase();
  return (
    <Text style={{ color, fontSize: Math.max(12, size * 0.42), fontWeight: '800' }}>
      {initial}
    </Text>
  );
}

interface CentralIsoCubeProps {
  readonly color: string;
  readonly size: number;
  readonly styles: ReturnType<typeof createStyles>;
}

function CentralIsoCube({ color, size, styles }: CentralIsoCubeProps) {
  const face = size * 0.42;
  return (
    <View style={[styles.isoCubeContainer, { width: size, height: size }]}>
      <View
        style={[
          styles.isoCubeFaceBack,
          {
            width: face,
            height: face,
            backgroundColor: withAlpha(color, '66'),
          },
        ]}
      />
      <View
        style={[
          styles.isoCubeFace,
          {
            width: face,
            height: face,
            backgroundColor: color,
          },
        ]}
      />
    </View>
  );
}

function BrandMark({ size }: { size: number }) {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <BlockIcon color="#13968A" size={size} isSelected />
    </View>
  );
}

// ─── Bottom-nav SVG icons ────────────────────────────────────────────────────

function trophySvg(color: string, size: number) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none">
    <!-- cup body -->
    <path d="M6 2h12v8a6 6 0 0 1-12 0V2Z" stroke="${color}" stroke-width="1.6" stroke-linejoin="round"/>
    <!-- left handle -->
    <path d="M6 5H3a2 2 0 0 0 0 4h3" stroke="${color}" stroke-width="1.6" stroke-linecap="round"/>
    <!-- right handle -->
    <path d="M18 5h3a2 2 0 0 1 0 4h-3" stroke="${color}" stroke-width="1.6" stroke-linecap="round"/>
    <!-- stem -->
    <path d="M12 16v3" stroke="${color}" stroke-width="1.6" stroke-linecap="round"/>
    <!-- base -->
    <path d="M8 22h8" stroke="${color}" stroke-width="1.8" stroke-linecap="round"/>
    <!-- shine dot -->
    <circle cx="9.5" cy="6" r="1" fill="${color}" opacity="0.5"/>
  </svg>`;
}

function playSvg(color: string, bgColor: string, size: number) {
  const r = size / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none">
    <circle cx="${r}" cy="${r}" r="${r}" fill="${bgColor}"/>
    <polygon points="${r * 0.42},${r * 0.28} ${r * 1.68},${r} ${r * 0.42},${r * 1.72}" fill="${color}"/>
  </svg>`;
}

function gearSvg(color: string, size: number) {
  // 8-tooth gear built from path + center circle
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none">
    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="${color}" stroke-width="1.6"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" stroke="${color}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export function HomeScreen(props: HomeScreenProps) {
  const { theme, isDark, toggleTheme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { width: viewportWidth, height: viewportHeight } = useWindowDimensions();
  const [reduceMotion, setReduceMotion] = useState(false);
  const modeIcons = props.modeIcons;

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

  const compact = viewportHeight < 760;
  const narrow = viewportWidth < 350;
  const wide = viewportWidth >= 600;

  const horizontalPadding = narrow ? SPACING.s3 : wide ? SPACING.s12 : SPACING.s6;
  const fontScale = Math.max(0.82, Math.min(viewportWidth / 360, 1.12));

  const modeIconSize = narrow ? 44 : wide ? 56 : 48;
  const selectedModeIconSize = narrow ? 54 : wide ? 70 : 62;
  const menuHeight = narrow ? 68 : wide ? 84 : 74;
  const topSafeInset = compact ? SPACING.s8 : wide ? SPACING.s12 : SPACING.s10;
  const bottomSafeInset = narrow ? SPACING.s1 : wide ? SPACING.s2 : SPACING.s1;
  const menuIconSize = narrow ? 22 : wide ? 28 : 24;

  const selectorHeight = narrow ? (compact ? 230 : 260) : compact ? 270 : 310;
  const wheelSize = Math.min(
    wide ? 268 : narrow ? 208 : 248,
    viewportWidth - horizontalPadding * 2,
  );
  const cardPadding = narrow ? SPACING.s4 : wide ? SPACING.s6 : SPACING.s5;

  const modesList = props.view.modes as readonly ExtendedHomeModeDTO[];

  const [selectedId, setSelectedId] = useState(
    props.preference.load() ??
      props.view.selectedModeId ??
      modesList.find((mode) => mode.id === 'lines')?.id ??
      modesList[0]?.id ??
      null,
  );
  const [selectedMenu, setSelectedMenu] = useState<'POINTS' | 'PLAY' | 'SETTINGS'>('PLAY');
  const selectorLayout = useRef({ width: 0, height: 0 });
  const dragLastAngle = useRef<number | null>(null);
  const dragAccumulatedAngle = useRef(0);

  const selected = useMemo(
    () =>
      modesList.find((mode) => mode.id === selectedId) ??
      modesList.find((mode) => mode.isSelected) ??
      null,
    [modesList, selectedId],
  );

  const selectMode = (mode: HomeModeDTO) => {
    if (!reduceMotion) {
      LayoutAnimation.configureNext({
        duration: MOTION.selectionMs,
        create: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity },
        update: { type: LayoutAnimation.Types.easeInEaseOut },
      });
    }
    setSelectedId(mode.id);
    props.preference.save(mode.id);
  };

  const angleAroundSelector = (event: import('react-native').GestureResponderEvent) => {
    const layout = selectorLayout.current;
    if (layout.width === 0 || layout.height === 0) return null;
    const x = event.nativeEvent.locationX - layout.width / 2;
    const y = event.nativeEvent.locationY - layout.height / 2;
    return Math.atan2(y, x);
  };

  const handleTouchStart = (event: import('react-native').GestureResponderEvent) => {
    dragLastAngle.current = angleAroundSelector(event);
    dragAccumulatedAngle.current = 0;
  };

  const handleTouchMove = (event: import('react-native').GestureResponderEvent) => {
    if (dragLastAngle.current === null || modesList.length < 2) return;
    const nextAngle = angleAroundSelector(event);
    if (nextAngle === null) return;

    let angleDelta = nextAngle - dragLastAngle.current;
    if (angleDelta > Math.PI) angleDelta -= Math.PI * 2;
    if (angleDelta < -Math.PI) angleDelta += Math.PI * 2;

    dragLastAngle.current = nextAngle;
    dragAccumulatedAngle.current += angleDelta;

    const modeAngleStep = (Math.PI * 2) / modesList.length;
    if (Math.abs(dragAccumulatedAngle.current) < modeAngleStep * 0.52) return;

    const currentIndex = modesList.findIndex((mode) => mode.id === selectedId);
    if (currentIndex < 0) return;
    const steps = Math.trunc(dragAccumulatedAngle.current / (modeAngleStep * 0.52));
    const nextIndex =
      (currentIndex + (steps > 0 ? 1 : -1) + modesList.length) % modesList.length;
    dragAccumulatedAngle.current %= modeAngleStep * 0.52;
    selectMode(modesList[nextIndex]);
  };

  const progressLabel = (mode: ExtendedHomeModeDTO): string => {
    if (mode.progress.kind === 'LEVELS') {
      return `Niveles: ${mode.progress.completed} de ${mode.progress.total}`;
    }
    if (mode.progress.kind === 'BEST') {
      return `${text('common.best_value', 'es')}: ${mode.progress.value.toLocaleString()} pts`;
    }
    if (mode.progress.kind === 'ERROR') {
      return text('home.error_progress', 'es');
    }
    if (mode.progress.kind === 'LOADING') {
      return '…';
    }
    return text('common.best_none', 'es');
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
              paddingHorizontal: horizontalPadding,
              paddingTop: topSafeInset,
              paddingBottom: menuHeight + bottomSafeInset + SPACING.s4,
            },
          ]}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.header}>
            <View style={styles.brand} accessibilityRole="header">
              <BrandMark size={36 * fontScale} />
              <Text
                style={[
                  styles.title,
                  {
                    fontSize: 24 * fontScale,
                    lineHeight: 32 * fontScale,
                  },
                ]}
              >
                {text(props.view.title.key, 'es')}
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              onPress={toggleTheme}
              hitSlop={8}
              style={({ pressed }) => [
                styles.themeToggle,
                pressed && styles.pressedControl,
              ]}
            >
              {isDark ? (
                <View style={styles.sunIcon}>
                  <View style={styles.sunCore} />
                  <View style={[styles.sunRay, styles.sunRayTop]} />
                  <View style={[styles.sunRay, styles.sunRayBottom]} />
                  <View style={[styles.sunRay, styles.sunRayLeft]} />
                  <View style={[styles.sunRay, styles.sunRayRight]} />
                </View>
              ) : (
                <View style={styles.moonIcon} />
              )}
            </Pressable>
          </View>

          <Text
            accessibilityRole="header"
            style={[
              styles.heroTitle,
              narrow && styles.heroTitleNarrow,
              compact && styles.heroTitleCompact,
              { fontSize: (narrow ? 22 : 26) * fontScale, lineHeight: (narrow ? 28 : 34) * fontScale },
            ]}
          >
            {text(props.view.heroTitle.key, 'es')}
          </Text>
          <Text
            style={[
              styles.heroSubtitle,
              narrow && styles.heroSubtitleNarrow,
              compact && styles.heroSubtitleCompact,
            ]}
          >
            {text(props.view.heroSubtitle.key, 'es')}
          </Text>

          {props.view.state === 'EMPTY' ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>{text('home.empty', 'es')}</Text>
            </View>
          ) : (
            <>
              <View
                onLayout={(event) => {
                  selectorLayout.current = event.nativeEvent.layout;
                }}
                style={[
                  styles.selectorContainer,
                  {
                    minHeight: selectorHeight,
                    marginTop: narrow ? SPACING.s2 : SPACING.s4,
                    marginBottom: SPACING.s2,
                  },
                ]}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={() => {
                  dragLastAngle.current = null;
                  dragAccumulatedAngle.current = 0;
                }}
              >
                <View
                  style={[
                    styles.pointerIndicator,
                    { borderTopColor: theme.primary },
                  ]}
                />

                <View
                  style={[
                    styles.wheelAura,
                    {
                      width: wheelSize * 1.08,
                      height: wheelSize * 1.08,
                      borderRadius: (wheelSize * 1.08) / 2,
                      backgroundColor: withAlpha(theme.primary, isDark ? '14' : '10'),
                    },
                  ]}
                />

                <View
                  style={[
                    styles.wheelFrame,
                    {
                      width: wheelSize,
                      height: wheelSize,
                      borderRadius: wheelSize / 2,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.wheelTrackRing,
                      {
                        width: wheelSize * 0.84,
                        height: wheelSize * 0.84,
                        borderRadius: (wheelSize * 0.84) / 2,
                      },
                    ]}
                  />
                  <View
                    style={[
                      styles.wheelTrackRingInner,
                      {
                        width: wheelSize * 0.68,
                        height: wheelSize * 0.68,
                        borderRadius: (wheelSize * 0.68) / 2,
                      },
                    ]}
                  />

                  <View
                    style={[
                      styles.wheelInnerCore,
                      {
                        width: wheelSize * 0.52,
                        height: wheelSize * 0.52,
                        borderRadius: (wheelSize * 0.52) / 2,
                      },
                    ]}
                  >
                    <CentralIsoCube
                      color={theme.primary}
                      size={wheelSize * 0.3}
                      styles={styles}
                    />
                  </View>

                  {modesList.map((mode, index) => {
                    const totalModes = modesList.length;
                    const selectedIndex = modesList.findIndex((item) => item.id === selectedId);
                    const relativeIndex = (index - selectedIndex + totalModes) % totalModes;
                    const isSelected = mode.id === selectedId;
                    const currentIconSize = isSelected ? selectedModeIconSize : modeIconSize;
                    const angle = (2 * Math.PI * relativeIndex) / totalModes - Math.PI / 2;
                    const radius = wheelSize * 0.41;
                    const centerX = wheelSize / 2;
                    const centerY = wheelSize / 2;
                    const posX = centerX + radius * Math.cos(angle) - currentIconSize / 2;
                    const posY = centerY + radius * Math.sin(angle) - currentIconSize / 2;
                    const shortLabel =
                      mode.shortName ??
                      text(mode.name.key, 'es').replace(/^Hexa\s+/i, '').toUpperCase();
                    const modeName = text(mode.name.key, 'es');

                    return (
                      <View
                        key={mode.id}
                        style={[
                          styles.modeOrbitSlot,
                          {
                            left: posX,
                            top: posY,
                            width: currentIconSize,
                            height: currentIconSize + (isSelected ? 28 : 20),
                            zIndex: isSelected ? 4 : 3,
                          },
                        ]}
                      >
                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel={modeName}
                          accessibilityState={{ selected: isSelected }}
                          onPress={() => selectMode(mode)}
                          hitSlop={6}
                          style={({ pressed }) => [
                            styles.modePressable,
                            pressed && styles.pressedScale,
                          ]}
                        >
                          <View
                            style={[
                              styles.modeHexBase,
                              isSelected ? styles.modeHexSelected : styles.modeHexIdle,
                              {
                                width: currentIconSize,
                                height: currentIconSize,
                                borderRadius: currentIconSize / 2,
                                borderColor: isSelected ? theme.primary : theme.borderDefault,
                                borderWidth: isSelected ? BORDER_WIDTH.chunky : BORDER_WIDTH.thin,
                                shadowColor: isSelected
                                  ? theme.primary
                                  : theme.shadowLow.shadowColor,
                                shadowOpacity: isSelected ? 0.35 : theme.shadowLow.shadowOpacity,
                                shadowRadius: isSelected ? 14 : theme.shadowLow.shadowRadius,
                                shadowOffset: isSelected
                                  ? { width: 0, height: 6 }
                                  : theme.shadowLow.shadowOffset,
                                elevation: isSelected ? 8 : 2,
                              },
                            ]}
                          >
                            {renderModeIcon(
                              mode,
                              isSelected ? theme.primary : theme.textSecondary,
                              currentIconSize * 0.72,
                              isSelected,
                              modeIcons,
                            )}
                          </View>

                          {isSelected ? (
                            <View
                              style={[
                                styles.selectedLabelBadge,
                                {
                                  backgroundColor: withAlpha(
                                    theme.primary,
                                    isDark ? '33' : '1F',
                                  ),
                                },
                              ]}
                            >
                              <Text
                                style={[styles.selectedLabelText, { color: theme.primary }]}
                              >
                                {shortLabel}
                              </Text>
                            </View>
                          ) : (
                            <Text style={styles.idleLabelText}>{shortLabel}</Text>
                          )}
                        </Pressable>
                      </View>
                    );
                  })}
                </View>
              </View>

              {selected ? (
                <View
                  style={[
                    styles.card,
                    compact && styles.cardCompact,
                    {
                      padding: cardPadding,
                      borderColor: withAlpha(theme.primary, isDark ? '40' : '28'),
                    },
                  ]}
                >
                  <View style={styles.cardHeaderRow}>
                    <Text
                      style={[styles.cardTitle, { fontSize: 22 * fontScale }]}
                      numberOfLines={1}
                    >
                      {text(selected.name.key, 'es')}
                    </Text>
                    <View
                      style={[
                        styles.progressBadge,
                        {
                          backgroundColor: withAlpha(theme.primary, isDark ? '33' : '1A'),
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.progressBadgeText,
                          { color: theme.primary, fontSize: 12 * fontScale },
                        ]}
                        numberOfLines={1}
                      >
                        {progressLabel(selected)}
                      </Text>
                    </View>
                  </View>

                  <Text
                    style={[
                      styles.description,
                      {
                        fontSize: Math.max(13, 15 * fontScale),
                        lineHeight: Math.max(18, 22 * fontScale),
                      },
                    ]}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {text(selected.description.key, 'es')}
                  </Text>

                  {props.view.errorMessage ? (
                    <Text style={styles.errorHint}>
                      {text(props.view.errorMessage.key, 'es')}
                    </Text>
                  ) : null}

                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Jugar ${text(selected.name.key, 'es')}`}
                    onPress={() =>
                      props.onNavigate(selected.entryKind === 'DIRECT' ? 'DIRECT' : 'LEVELS')
                    }
                    style={({ pressed }) => [
                      styles.playButton,
                      {
                        backgroundColor: theme.primary,
                        shadowColor: theme.primary,
                      },
                      pressed && styles.pressedScale,
                    ]}
                  >
                    <View style={styles.playButtonContent}>
                      <View style={styles.playTriangleIcon} />
                      <Text style={[styles.playText, { fontSize: 17 * fontScale }]}>
                        Jugar {text(selected.name.key, 'es')}
                      </Text>
                    </View>
                  </Pressable>
                </View>
              ) : null}
            </>
          )}
        </ScrollView>

        <View
          style={[
            styles.bottomMenu,
            {
              height: menuHeight + bottomSafeInset,
              paddingBottom: bottomSafeInset,
            },
          ]}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: selectedMenu === 'POINTS' }}
            accessibilityLabel={text('home.points', 'es')}
            onPress={() => {
              setSelectedMenu('POINTS');
              props.controller.openPoints(props.view.hasSession);
            }}
            style={({ pressed }) => [
              styles.bottomMenuItem,
              pressed && styles.pressedMenuItem,
            ]}
          >
            <View style={[styles.bottomMenuIcon, { width: menuIconSize, height: menuIconSize }]}>
              <SvgXml
                xml={trophySvg(
                  selectedMenu === 'POINTS' ? theme.primary : theme.textSecondary,
                  menuIconSize,
                )}
                width={menuIconSize}
                height={menuIconSize}
              />
            </View>
            <Text
              style={[
                styles.bottomMenuLabel,
                selectedMenu === 'POINTS' && styles.bottomMenuLabelSelected,
              ]}
            >
              {text('home.points', 'es')}
            </Text>
            {selectedMenu === 'POINTS' ? <View style={styles.menuActiveDot} /> : null}
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: selectedMenu === 'PLAY' }}
            accessibilityLabel={text('home.play', 'es')}
            onPress={() => {
              setSelectedMenu('PLAY');
              if (selected) {
                props.controller.play(selected.id);
              }
            }}
            style={({ pressed }) => [
              styles.bottomMenuItem,
              pressed && styles.pressedMenuItem,
            ]}
          >
            <SvgXml
              xml={playSvg(
                selectedMenu === 'PLAY' ? theme.primaryFg : theme.textSecondary,
                selectedMenu === 'PLAY' ? theme.primary : theme.surfaceSubdued,
                Math.max(SPACING.touchTargetMin, menuIconSize * 1.55),
              )}
              width={Math.max(SPACING.touchTargetMin, menuIconSize * 1.55)}
              height={Math.max(SPACING.touchTargetMin, menuIconSize * 1.55)}
            />
            <Text
              style={[
                styles.bottomMenuLabel,
                selectedMenu === 'PLAY' && styles.bottomMenuLabelSelected,
              ]}
            >
              {text('home.play', 'es')}
            </Text>
            {selectedMenu === 'PLAY' ? <View style={styles.menuActiveDot} /> : null}
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: selectedMenu === 'SETTINGS' }}
            accessibilityLabel={text('home.settings', 'es')}
            onPress={() => {
              setSelectedMenu('SETTINGS');
              props.controller.openSettings();
            }}
            style={({ pressed }) => [
              styles.bottomMenuItem,
              pressed && styles.pressedMenuItem,
            ]}
          >
            <View style={[styles.bottomMenuIcon, { width: menuIconSize, height: menuIconSize }]}>
              <SvgXml
                xml={gearSvg(
                  selectedMenu === 'SETTINGS' ? theme.primary : theme.textSecondary,
                  menuIconSize,
                )}
                width={menuIconSize}
                height={menuIconSize}
              />
            </View>
            <Text
              style={[
                styles.bottomMenuLabel,
                selectedMenu === 'SETTINGS' && styles.bottomMenuLabelSelected,
              ]}
            >
              {text('home.settings', 'es')}
            </Text>
            {selectedMenu === 'SETTINGS' ? <View style={styles.menuActiveDot} /> : null}
          </Pressable>
        </View>
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
    header: {
      minHeight: SPACING.touchTargetMin,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    scrollArea: { flex: 1, width: '100%' },
    scrollContent: { flexGrow: 1 },
    brand: { flexDirection: 'row', alignItems: 'center', gap: SPACING.s3 },
    title: {
      fontWeight: '800',
      color: theme.textPrimary,
      letterSpacing: -0.3,
    },
    themeToggle: {
      width: SPACING.touchTargetMin,
      height: SPACING.touchTargetMin,
      borderRadius: RADIUS.full,
      borderWidth: BORDER_WIDTH.thin,
      borderColor: theme.borderDefault,
      backgroundColor: theme.surface,
      alignItems: 'center',
      justifyContent: 'center',
      ...theme.shadowLow,
    },
    moonIcon: {
      width: 16,
      height: 16,
      borderRadius: RADIUS.full,
      borderWidth: BORDER_WIDTH.thick,
      borderColor: theme.textSecondary,
      borderLeftColor: 'transparent',
      borderBottomColor: 'transparent',
      transform: [{ rotate: '-30deg' }],
    },
    sunIcon: {
      width: 20,
      height: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sunCore: {
      width: 10,
      height: 10,
      borderRadius: RADIUS.full,
      borderWidth: BORDER_WIDTH.thick,
      borderColor: theme.warning,
    },
    sunRay: {
      position: 'absolute',
      width: 2,
      height: 4,
      borderRadius: RADIUS.full,
      backgroundColor: theme.warning,
    },
    sunRayTop: { top: 0 },
    sunRayBottom: { bottom: 0 },
    sunRayLeft: { left: 0, width: 4, height: 2 },
    sunRayRight: { right: 0, width: 4, height: 2 },
    heroTitle: {
      marginTop: SPACING.s3,
      textAlign: 'center',
      fontWeight: '700',
      color: theme.textPrimary,
      letterSpacing: -0.4,
      fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', default: undefined }),
    },
    heroTitleNarrow: {},
    heroTitleCompact: { marginTop: SPACING.s2 },
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

    selectorContainer: {
      position: 'relative',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
    },
    pointerIndicator: {
      position: 'absolute',
      top: 4,
      zIndex: 5,
      width: 0,
      height: 0,
      borderLeftWidth: 7,
      borderRightWidth: 7,
      borderTopWidth: 10,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
    },
    wheelAura: {
      position: 'absolute',
    },
    wheelFrame: {
      position: 'relative',
      borderWidth: BORDER_WIDTH.thin,
      borderColor: theme.borderDefault,
      borderStyle: 'dashed',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: withAlpha(theme.surface, '99'),
    },
    wheelTrackRing: {
      position: 'absolute',
      borderWidth: BORDER_WIDTH.thick * 2,
      borderColor: theme.surfaceSubdued,
      opacity: 0.85,
    },
    wheelTrackRingInner: {
      position: 'absolute',
      borderWidth: BORDER_WIDTH.thin,
      borderColor: theme.borderDefault,
      borderStyle: 'dashed',
      opacity: 0.7,
    },
    wheelInnerCore: {
      position: 'absolute',
      backgroundColor: theme.centerSurface,
      borderWidth: BORDER_WIDTH.thick,
      borderColor: theme.borderStrong,
      alignItems: 'center',
      justifyContent: 'center',
      ...theme.shadowMedium,
    },
    isoCubeContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    isoCubeFace: {
      borderRadius: RADIUS.xs,
      transform: [{ rotate: '45deg' }],
    },
    isoCubeFaceBack: {
      position: 'absolute',
      borderRadius: RADIUS.xs,
      transform: [{ rotate: '45deg' }, { translateX: 4 }, { translateY: -4 }],
    },
    modeOrbitSlot: {
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
    },
    modePressable: {
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: SPACING.touchTargetMin,
      minHeight: SPACING.touchTargetMin,
    },
    modeHexBase: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.surface,
    },
    modeHexIdle: {},
    modeHexSelected: {},
    selectedLabelBadge: {
      marginTop: SPACING.s1,
      paddingHorizontal: SPACING.s2,
      paddingVertical: 3,
      borderRadius: RADIUS.full,
    },
    selectedLabelText: {
      fontSize: TYPOGRAPHY.overline.fontSize,
      fontWeight: '800',
      letterSpacing: 0.6,
    },
    idleLabelText: {
      marginTop: SPACING.s1 / 2,
      fontSize: TYPOGRAPHY.overline.fontSize - 1,
      fontWeight: '700',
      color: theme.textSecondary,
      letterSpacing: 0.3,
    },

    card: {
      marginTop: SPACING.s3,
      borderRadius: RADIUS.xl,
      backgroundColor: theme.surface,
      borderWidth: BORDER_WIDTH.thin,
      ...theme.shadowMedium,
    },
    cardCompact: { marginTop: SPACING.s2, padding: SPACING.s3 },
    cardHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: SPACING.s2,
    },
    cardTitle: {
      fontWeight: '800',
      color: theme.textPrimary,
      flexShrink: 1,
      letterSpacing: -0.2,
    },
    progressBadge: {
      flexShrink: 1,
      maxWidth: '48%',
      borderRadius: RADIUS.full,
      paddingHorizontal: SPACING.s3,
      paddingVertical: SPACING.s1,
      overflow: 'hidden',
    },
    progressBadgeText: {
      fontWeight: '700',
    },
    description: {
      marginTop: SPACING.s2,
      color: theme.textSecondary,
    },
    errorHint: {
      marginTop: SPACING.s2,
      color: theme.danger,
      fontSize: TYPOGRAPHY.caption.fontSize,
      fontWeight: '600',
    },
    playButton: {
      minHeight: SPACING.touchTargetMin,
      marginTop: SPACING.s4,
      borderRadius: RADIUS.full,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: SPACING.s5,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.35,
      shadowRadius: 14,
      elevation: 6,
    },
    pressedControl: { opacity: 0.88 },
    pressedScale: {
      opacity: 0.92,
      transform: [{ scale: 0.97 }],
    },
    playButtonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: SPACING.s2,
      paddingVertical: SPACING.s3,
    },
    playTriangleIcon: {
      width: 0,
      height: 0,
      borderTopWidth: 5,
      borderBottomWidth: 5,
      borderLeftWidth: 9,
      borderTopColor: 'transparent',
      borderBottomColor: 'transparent',
      borderLeftColor: theme.primaryFg,
    },
    playText: {
      color: theme.primaryFg,
      fontWeight: '700',
    },

    bottomMenu: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      borderTopWidth: BORDER_WIDTH.thin,
      borderTopColor: theme.borderDefault,
      backgroundColor: theme.surface,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      ...theme.shadowLow,
    },
    bottomMenuItem: {
      flex: 1,
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
      minHeight: SPACING.touchTargetMin,
    },
    pressedMenuItem: { opacity: 0.72 },
    bottomMenuIcon: { alignItems: 'center', justifyContent: 'center' },
    bottomMenuLabel: {
      fontSize: TYPOGRAPHY.caption.fontSize,
      lineHeight: TYPOGRAPHY.caption.lineHeight,
      fontWeight: TYPOGRAPHY.caption.fontWeight,
      color: theme.textSecondary,
    },
    bottomMenuLabelSelected: {
      color: theme.primary,
      fontWeight: '700',
    },
    menuActiveDot: {
      width: 4,
      height: 4,
      borderRadius: RADIUS.full,
      backgroundColor: theme.primary,
      marginTop: 1,
    },
    trophyIcon: {
      width: 22,
      height: 17,
      borderRadius: RADIUS.xs,
      borderWidth: BORDER_WIDTH.thick,
      borderColor: theme.textSecondary,
      backgroundColor: 'transparent',
    },
    trophyStem: {
      position: 'absolute',
      width: 6,
      height: 8,
      left: 6,
      bottom: -8,
      borderLeftWidth: BORDER_WIDTH.thick,
      borderRightWidth: BORDER_WIDTH.thick,
      borderBottomWidth: BORDER_WIDTH.thick,
      borderColor: theme.textSecondary,
    },
    bottomMenuPlayIcon: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    bottomMenuPlayIconSelected: {
      backgroundColor: theme.primary,
      ...theme.shadowGlowPrimary,
    },
    bottomMenuPlayIconIdle: {
      borderWidth: BORDER_WIDTH.thick,
      borderColor: theme.textTertiary,
      backgroundColor: theme.surface,
    },
    bottomMenuPlayShape: {
      width: 0,
      height: 0,
      marginLeft: 2,
      borderTopWidth: 6,
      borderBottomWidth: 6,
      borderLeftWidth: 10,
      borderTopColor: 'transparent',
      borderBottomColor: 'transparent',
      borderLeftColor: theme.textSecondary,
    },
    bottomMenuPlayShapeSelected: { borderLeftColor: theme.primaryFg },
    settingsIcon: {
      width: 20,
      height: 20,
      borderRadius: RADIUS.full,
      borderWidth: BORDER_WIDTH.thick,
      borderColor: theme.textSecondary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    settingsCenter: {
      width: 5,
      height: 5,
      borderRadius: RADIUS.full,
      backgroundColor: theme.textSecondary,
    },
    empty: { height: 220, alignItems: 'center', justifyContent: 'center' },
    emptyText: { color: theme.textSecondary, fontSize: TYPOGRAPHY.subtitle.fontSize },
  });
}
