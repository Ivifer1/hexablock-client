import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { LocaleCode, LocaleOptionDTO } from '../../application/value-objects';
import { BORDER_WIDTH, RADIUS, SPACING, TYPOGRAPHY, type Theme } from '../theme';
import {
  CheckCircleIcon,
  GlobeIcon,
  LanguageBadgeIcon,
  RadioCircleIcon,
} from '../ui-icons/SettingsIcons';

export interface SettingsLanguageCardProps {
  readonly title: string;
  readonly locales: readonly LocaleOptionDTO[];
  readonly theme: Theme;
  readonly isDark: boolean;
  readonly onSelectLocale: (code: LocaleCode) => void;
}

function withAlpha(hex: string, alphaHex: string): string {
  if (/^#[0-9A-Fa-f]{6}$/.test(hex)) return `${hex}${alphaHex}`;
  return hex;
}

export function SettingsLanguageCard({
  title,
  locales,
  theme,
  isDark,
  onSelectLocale,
}: SettingsLanguageCardProps) {
  const styles = useMemo(() => createStyles(theme, isDark), [theme, isDark]);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <GlobeIcon color={theme.primary} size={20} />
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.list}>
        {locales.map((option) => {
          const selected = option.isSelected;
          return (
            <Pressable
              key={option.code}
              testID={`settings-locale-${option.code}`}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              accessibilityLabel={option.nativeName}
              onPress={() => onSelectLocale(option.code)}
              style={({ pressed }) => [
                styles.option,
                selected ? styles.optionSelected : styles.optionIdle,
                pressed && styles.optionPressed,
              ]}
            >
              <View style={styles.optionLeft}>
                <LanguageBadgeIcon
                  code={option.code}
                  color={selected ? theme.primary : theme.borderStrong}
                  fillColor={
                    selected
                      ? theme.primary
                      : withAlpha(theme.surfaceSubdued, isDark ? 'EE' : 'FF')
                  }
                  textColor={selected ? theme.primaryFg : theme.textPrimary}
                  size={28}
                />
                <Text
                  style={[
                    styles.optionLabel,
                    selected && styles.optionLabelSelected,
                  ]}
                >
                  {option.nativeName}
                </Text>
              </View>

              {selected ? (
                <CheckCircleIcon
                  color={theme.primary}
                  checkColor={theme.primaryFg}
                  size={26}
                />
              ) : (
                <RadioCircleIcon
                  borderColor={theme.borderStrong}
                  innerDotColor={theme.surface}
                  size={24}
                />
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function createStyles(theme: Theme, isDark: boolean) {
  return StyleSheet.create({
    card: {
      backgroundColor: theme.surface,
      borderRadius: RADIUS.xl,
      padding: SPACING.s5,
      borderWidth: BORDER_WIDTH.thin,
      borderColor: theme.borderDefault,
      gap: SPACING.s3,
      ...theme.shadowLow,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.s2,
    },
    title: {
      fontSize: TYPOGRAPHY.subtitle.fontSize,
      lineHeight: TYPOGRAPHY.subtitle.lineHeight,
      fontWeight: '700',
      color: theme.textPrimary,
    },
    list: {
      gap: SPACING.s2 + 2,
    },
    option: {
      minHeight: 52,
      paddingHorizontal: SPACING.s4,
      paddingVertical: SPACING.s2 + 2,
      borderRadius: RADIUS.lg,
      borderWidth: BORDER_WIDTH.thin,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: SPACING.s3,
    },
    optionSelected: {
      backgroundColor: withAlpha(theme.primary, isDark ? '26' : '14'),
      borderColor: withAlpha(theme.primary, isDark ? '88' : '45'),
    },
    optionIdle: {
      backgroundColor: theme.surfaceSubdued,
      borderColor: theme.borderDefault,
    },
    optionPressed: {
      opacity: 0.88,
      transform: [{ scale: 0.99 }],
    },
    optionLeft: {
      flex: 1,
      minWidth: 0,
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.s3,
    },
    optionLabel: {
      fontSize: 15,
      lineHeight: 20,
      fontWeight: '500',
      color: theme.textPrimary,
      flexShrink: 1,
    },
    optionLabelSelected: {
      fontWeight: '700',
      color: isDark ? theme.primaryHover : theme.primary,
    },
  });
}
