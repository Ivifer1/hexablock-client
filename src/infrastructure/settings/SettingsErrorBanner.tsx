import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BORDER_WIDTH, RADIUS, SPACING, TYPOGRAPHY, type Theme } from '../theme';
import { AlertCircleIcon } from '../ui-icons/SettingsIcons';

export interface SettingsErrorBannerProps {
  readonly message: string;
  readonly theme: Theme;
  readonly isDark: boolean;
}

function withAlpha(hex: string, alphaHex: string): string {
  if (/^#[0-9A-Fa-f]{6}$/.test(hex)) return `${hex}${alphaHex}`;
  return hex;
}

export function SettingsErrorBanner({
  message,
  theme,
  isDark,
}: SettingsErrorBannerProps) {
  const styles = useMemo(() => createStyles(theme, isDark), [theme, isDark]);

  return (
    <View
      testID="settings-error-banner"
      accessibilityRole="alert"
      style={styles.banner}
    >
      <AlertCircleIcon color={theme.danger} size={20} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

function createStyles(theme: Theme, isDark: boolean) {
  return StyleSheet.create({
    banner: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.s2 + 2,
      paddingHorizontal: SPACING.s4,
      paddingVertical: SPACING.s3,
      borderRadius: RADIUS.lg,
      backgroundColor: withAlpha(theme.danger, isDark ? '28' : '16'),
      borderWidth: BORDER_WIDTH.thin,
      borderColor: withAlpha(theme.danger, isDark ? '66' : '44'),
    },
    message: {
      flex: 1,
      fontSize: TYPOGRAPHY.bodyMedium.fontSize,
      lineHeight: TYPOGRAPHY.bodyMedium.lineHeight,
      fontWeight: '600',
      color: theme.danger,
    },
  });
}
