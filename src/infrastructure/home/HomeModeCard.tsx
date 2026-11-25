import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { IAssetResolver, ITextCatalog, SupportedLocale } from '../../application/ports';
import type { I18nKeyDTO } from '../../application/value-objects';
import type { HomeLayoutMetrics } from '../homeLayout';
import type { ModeIconComponent } from '../mode-icons';
import { AnimatedFade, MOTION_TIMINGS } from '../motion';
import { BORDER_WIDTH, RADIUS, SPACING, TYPOGRAPHY, type Theme } from '../theme';
import {
  formatHomeProgress,
  type HomeProgressFormatterMap,
} from './progressFormatters';
import { renderModeIcon, withAlpha, type ExtendedHomeModeDTO } from './shared';

export interface HomeModeCardProps {
  readonly mode: ExtendedHomeModeDTO;
  readonly shortLabel: string;
  readonly errorMessage: I18nKeyDTO | null;
  readonly transitionKey: string;
  readonly reduceMotion: boolean;
  readonly layout: HomeLayoutMetrics;
  readonly theme: Theme;
  readonly isDark: boolean;
  readonly textCatalog: ITextCatalog;
  readonly locale: SupportedLocale;
  readonly modeIconResolver?: IAssetResolver<ModeIconComponent>;
  readonly progressFormatters?: HomeProgressFormatterMap;
}

export function HomeModeCard({
  mode,
  shortLabel,
  errorMessage,
  transitionKey,
  reduceMotion,
  layout,
  theme,
  isDark,
  textCatalog,
  locale,
  modeIconResolver,
  progressFormatters,
}: HomeModeCardProps) {
  const styles = useMemo(() => createStyles(theme), [theme]);
  const entryKindLabel = textCatalog.resolve(mode.entryKindLabel, locale);
  const progressLabel = formatHomeProgress(
    mode.progress,
    textCatalog,
    locale,
    progressFormatters,
  );
  const resolvedError =
    errorMessage ?? (mode.progress.kind === 'ERROR' ? mode.progress.message : null);

  return (
    <AnimatedFade
      triggerKey={transitionKey}
      durationMs={MOTION_TIMINGS.cardFade.durationMs}
      reduceMotion={reduceMotion}
      style={styles.container}
    >
      <View
        testID="home-selected-mode-pill"
        style={[
          styles.modePill,
          {
            minHeight: layout.modePillMinHeight,
            borderColor: theme.borderDefault,
          },
        ]}
      >
        {renderModeIcon(
          mode,
          theme.primary,
          Math.round(20 * layout.fontScale),
          true,
          modeIconResolver,
        )}
        <Text
          style={[
            styles.modePillText,
            {
              fontSize: Math.round(16 * layout.fontScale),
              lineHeight: Math.round(20 * layout.fontScale),
            },
          ]}
          numberOfLines={1}
        >
          {shortLabel}
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

      <View style={[styles.metadataRow, { minHeight: layout.metadataRowHeight }]}>
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

        {progressLabel ? (
          <View
            testID="home-progress-badge"
            style={[
              styles.progressBadge,
              {
                minHeight: layout.progressBadgeMinHeight,
                backgroundColor: withAlpha(theme.primary, isDark ? '2B' : '1A'),
              },
            ]}
          >
            <Text
              style={[
                styles.progressBadgeText,
                { color: isDark ? theme.primaryHover : theme.primary, fontSize: 11 * layout.fontScale },
              ]}
              numberOfLines={1}
            >
              {progressLabel}
            </Text>
          </View>
        ) : null}
      </View>

      {resolvedError ? (
        <Text testID="home-progress-error" style={styles.errorHint}>
          {textCatalog.resolve(resolvedError, locale)}
        </Text>
      ) : null}
    </AnimatedFade>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      width: '100%',
      alignItems: 'center',
    },
    modePill: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: SPACING.s2,
      paddingHorizontal: SPACING.s5,
      paddingVertical: SPACING.s1 + 2,
      borderRadius: RADIUS.full,
      backgroundColor: theme.surface,
      borderWidth: BORDER_WIDTH.thin,
      ...theme.shadowLow,
    },
    modePillText: {
      color: theme.textPrimary,
      fontWeight: '700',
      letterSpacing: -0.2,
    },
    description: {
      marginTop: SPACING.s1,
      color: theme.textSecondary,
      textAlign: 'center',
      paddingHorizontal: SPACING.s2,
    },
    metadataRow: {
      marginTop: SPACING.s1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      flexWrap: 'wrap',
      gap: SPACING.s2,
    },
    entryKindBadge: {
      paddingHorizontal: SPACING.s2 + 2,
      paddingVertical: 2,
      borderRadius: RADIUS.full,
      borderWidth: BORDER_WIDTH.thin,
    },
    entryKindText: {
      color: theme.textSecondary,
      fontWeight: '600',
    },
    progressBadge: {
      borderRadius: RADIUS.full,
      paddingHorizontal: SPACING.s3,
      paddingVertical: 2,
      justifyContent: 'center',
    },
    progressBadgeText: {
      fontWeight: '700',
    },
    errorHint: {
      marginTop: SPACING.s1,
      color: theme.danger,
      fontSize: TYPOGRAPHY.caption.fontSize,
      fontWeight: '600',
      textAlign: 'center',
    },
  });
}
