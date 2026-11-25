import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BORDER_WIDTH, RADIUS, SPACING, TYPOGRAPHY, type Theme } from '../theme';
import { ThemeToggleIcon } from '../ui-icons/MenuIcons';
import { SettingsToggleRow } from './SettingsToggleRow';

export interface SettingsAppearanceCardProps {
  readonly sectionLabel: string;
  readonly darkModeLabel: string;
  readonly isDarkMode: boolean;
  readonly theme: Theme;
  readonly isDark: boolean;
  readonly onToggleDarkMode: (enabled: boolean) => void;
}

export function SettingsAppearanceCard({
  sectionLabel,
  darkModeLabel,
  isDarkMode,
  theme,
  isDark,
  onToggleDarkMode,
}: SettingsAppearanceCardProps) {
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.card}>
      <Text style={styles.eyebrow}>{sectionLabel}</Text>
      <SettingsToggleRow
        testID="settings-dark-mode-switch"
        label={darkModeLabel}
        value={isDarkMode}
        icon={<ThemeToggleIcon isDark={isDarkMode} color={theme.primary} size={22} />}
        theme={theme}
        isDark={isDark}
        onToggle={onToggleDarkMode}
      />
    </View>
  );
}

function createStyles(theme: Theme) {
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
    eyebrow: {
      fontSize: TYPOGRAPHY.overline.fontSize + 1,
      lineHeight: TYPOGRAPHY.overline.lineHeight,
      fontWeight: '800',
      letterSpacing: 1,
      textTransform: 'uppercase',
      color: theme.textSecondary,
    },
  });
}
