import { useMemo } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import type { ITextCatalog, SupportedLocale } from '../../application/ports';
import type { HomeProgressDTO, I18nKeyDTO } from '../../application/value-objects';
import type { HomeLayoutMetrics } from '../homeLayout';
import type { ExtendedHomeModeDTO } from '../HexModeSelector';
import { BORDER_WIDTH, RADIUS, SPACING, TYPOGRAPHY, scaleButtonSize, type Theme } from '../theme';
import { PlayGlyphIcon } from '../ui-icons/MenuIcons';

export interface HomeModeCardProps {
  readonly mode: ExtendedHomeModeDTO;
  readonly errorMessage: I18nKeyDTO | null;
  readonly cardOpacity: Animated.Value;
  readonly layout: HomeLayoutMetrics;
  readonly theme: Theme;
  readonly isDark: boolean;
  readonly textCatalog: ITextCatalog;
  readonly locale: SupportedLocale;
  readonly onPlay: () => void;
}

function withAlpha(hex: string, alphaHex: string): string {
  if (/^#[0-9A-Fa-f]{6}$/.test(hex)) return `${hex}${alphaHex}`;
  return hex;
}

function formatProgressLabel(
  progress: HomeProgressDTO,
  textCatalog: ITextCatalog,
  locale: SupportedLocale,
): string | null {
  if (progress.kind === 'LEVELS') {
    return textCatalog.resolve(
      {
        key: 'common.levels_progress',
        parameters: { done: progress.completed, total: progress.total },
      },
      locale,
    );
  }
  if (progress.kind === 'BEST') {
    const numberLocale = locale === 'es' ? 'es-ES' : 'en-US';
    return textCatalog.resolve(
      {
        key: 'common.best_value',
        parameters: { value: progress.value.toLocaleString(numberLocale) },
      },
      locale,
    );
  }
  if (progress.kind === 'ERROR') {
    return null;
  }
  if (progress.kind === 'LOADING') {
    return '…';
  }
  return textCatalog.resolve('common.best_none', locale);
}

export function HomeModeCard({
  mode,
  errorMessage,
  cardOpacity,
  layout,
  theme,
  isDark,
  textCatalog,
  locale,
  onPlay,
}: HomeModeCardProps) {
  const styles = useMemo(() => createStyles(theme), [theme]);
  const modeName = textCatalog.resolve(mode.name, locale);
  const entryKindLabel = textCatalog.resolve(mode.entryKindLabel, locale);
  const progressLabel = formatProgressLabel(mode.progress, textCatalog, locale);
  const resolvedError =
    errorMessage ?? (mode.progress.kind === 'ERROR' ? mode.progress.message : null);
  const playLabel = textCatalog.resolve(
    { key: 'home.play_mode', parameters: { name: modeName } },
    locale,
  );
  const playButton = scaleButtonSize('l', layout.fontScale);

  return (
    <Animated.View
      style={[
        styles.card,
        layout.compact && styles.cardCompact,
        {
          padding: layout.cardPadding,
          borderColor: withAlpha(theme.primary, isDark ? '40' : '28'),
          opacity: cardOpacity,
        },
      ]}
    >
      <View
        style={[
          styles.cardHeaderRow,
          { minHeight: layout.cardHeaderMinHeight },
        ]}
      >
        <Text
          style={[
            styles.cardTitle,
            {
              fontSize: layout.cardTitleFontSize,
              lineHeight: layout.cardTitleLineHeight,
            },
          ]}
          numberOfLines={1}
        >
          {modeName}
        </Text>
        {progressLabel ? (
          <View
            testID="home-progress-badge"
            style={[
              styles.progressBadge,
              {
                minHeight: layout.progressBadgeMinHeight,
                justifyContent: 'center',
                backgroundColor: withAlpha(theme.primary, isDark ? '33' : '1A'),
              },
            ]}
          >
            <Text
              style={[
                styles.progressBadgeText,
                { color: theme.primary, fontSize: 12 * layout.fontScale },
              ]}
              numberOfLines={1}
            >
              {progressLabel}
            </Text>
          </View>
        ) : null}
      </View>

      <View
        testID="home-entry-kind-badge"
        style={[
          styles.entryKindBadge,
          {
            backgroundColor: theme.surfaceSubdued,
            borderColor: theme.borderDefault,
          },
        ]}
      >
        <Text
          style={[styles.entryKindText, { fontSize: Math.round(11 * layout.fontScale) }]}
          numberOfLines={1}
        >
          {entryKindLabel}
        </Text>
      </View>

      <Text
        style={[
          styles.description,
          {
            fontSize: layout.descriptionFontSize,
            lineHeight: layout.descriptionLineHeight,
            height: layout.descriptionHeight,
          },
        ]}
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {textCatalog.resolve(mode.description, locale)}
      </Text>

      {resolvedError ? (
        <Text testID="home-progress-error" style={styles.errorHint}>
          {textCatalog.resolve(resolvedError, locale)}
        </Text>
      ) : null}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={playLabel}
        onPress={onPlay}
        style={({ pressed }) => [
          styles.playButton,
          layout.compact && styles.playButtonCompact,
          {
            minHeight: playButton.minHeight,
            paddingHorizontal: playButton.paddingHorizontal,
            backgroundColor: theme.primary,
            shadowColor: theme.primary,
          },
          pressed && styles.pressedScale,
        ]}
      >
        <View
          style={[
            styles.playButtonContent,
            {
              gap: playButton.gap,
              paddingVertical: playButton.paddingVertical,
            },
          ]}
        >
          <PlayGlyphIcon color={theme.primaryFg} size={playButton.iconSize} />
          <Text
            style={[
              styles.playText,
              {
                fontSize: playButton.fontSize,
                lineHeight: playButton.lineHeight,
              },
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {playLabel}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    card: {
      width: '100%',
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
    entryKindBadge: {
      alignSelf: 'flex-start',
      marginTop: SPACING.s1,
      paddingHorizontal: SPACING.s2,
      paddingVertical: 2,
      borderRadius: RADIUS.full,
      borderWidth: BORDER_WIDTH.thin,
    },
    entryKindText: {
      color: theme.textSecondary,
      fontWeight: '600',
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
      marginTop: SPACING.s4,
      borderRadius: RADIUS.full,
      alignItems: 'center',
      justifyContent: 'center',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.35,
      shadowRadius: 14,
      elevation: 6,
    },
    playButtonCompact: {
      marginTop: SPACING.s3,
    },
    pressedScale: {
      opacity: 0.92,
      transform: [{ scale: 0.97 }],
    },
    playButtonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    playText: {
      color: theme.primaryFg,
      fontWeight: '700',
    },
  });
}
