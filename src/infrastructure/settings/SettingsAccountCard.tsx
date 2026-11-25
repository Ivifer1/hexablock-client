import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { SettingsSessionDTO } from '../../application/value-objects';
import {
  BORDER_WIDTH,
  RADIUS,
  SPACING,
  TYPOGRAPHY,
  scaleButtonSize,
  type Theme,
} from '../theme';
import { SessionActionIcon } from '../ui-icons/MenuIcons';
import { LogoutIcon } from '../ui-icons/SettingsIcons';

export interface SettingsAccountCardProps {
  readonly eyebrowLabel: string;
  readonly session: SettingsSessionDTO;
  readonly authenticatedTitle: string;
  readonly signInLabel: string;
  readonly logoutLabel: string;
  readonly theme: Theme;
  readonly isDark: boolean;
  readonly onPressSignIn: () => void;
  readonly onPressLogout: () => void;
}

function withAlpha(hex: string, alphaHex: string): string {
  if (/^#[0-9A-Fa-f]{6}$/.test(hex)) return `${hex}${alphaHex}`;
  return hex;
}

export function SettingsAccountCard({
  eyebrowLabel,
  session,
  authenticatedTitle,
  signInLabel,
  logoutLabel,
  theme,
  isDark,
  onPressSignIn,
  onPressLogout,
}: SettingsAccountCardProps) {
  const styles = useMemo(() => createStyles(theme, isDark), [theme, isDark]);
  const signInButton = scaleButtonSize('m');
  const initial = (session.displayName?.trim().charAt(0) || '?').toUpperCase();

  return (
    <View style={styles.card}>
      <Text style={styles.eyebrow}>{eyebrowLabel}</Text>

      {session.isAuthenticated ? (
        <View style={styles.authenticatedContent}>
          <View style={styles.profileRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarLetter}>{initial}</Text>
              <View style={styles.activeDot} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileTitle} numberOfLines={1}>
                {authenticatedTitle}
              </Text>
              {session.secondaryText ? (
                <Text style={styles.profileSecondary} numberOfLines={1}>
                  {session.secondaryText}
                </Text>
              ) : null}
            </View>
          </View>

          <Pressable
            testID="settings-logout-button"
            accessibilityRole="button"
            accessibilityLabel={logoutLabel}
            onPress={onPressLogout}
            style={({ pressed }) => [
              styles.logoutButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <LogoutIcon color={theme.danger} size={18} />
            <Text style={styles.logoutLabel}>{logoutLabel}</Text>
          </Pressable>
        </View>
      ) : (
        <Pressable
          testID="settings-signin-button"
          accessibilityRole="button"
          accessibilityLabel={signInLabel}
          onPress={onPressSignIn}
          style={({ pressed }) => [
            styles.signInButton,
            {
              minHeight: signInButton.minHeight,
              paddingHorizontal: signInButton.paddingHorizontal,
              paddingVertical: signInButton.paddingVertical,
              gap: signInButton.gap,
            },
            pressed && styles.buttonPressed,
          ]}
        >
          <SessionActionIcon
            hasSession={false}
            color={theme.primaryFg}
            size={signInButton.iconSize}
          />
          <Text
            style={[
              styles.signInLabel,
              {
                fontSize: signInButton.fontSize,
                lineHeight: signInButton.lineHeight,
              },
            ]}
          >
            {signInLabel}
          </Text>
        </Pressable>
      )}
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
    eyebrow: {
      fontSize: TYPOGRAPHY.overline.fontSize + 1,
      lineHeight: TYPOGRAPHY.overline.lineHeight,
      fontWeight: '800',
      letterSpacing: 1,
      textTransform: 'uppercase',
      color: theme.textSecondary,
    },
    authenticatedContent: {
      gap: SPACING.s4,
    },
    profileRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.s3,
    },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: RADIUS.full,
      backgroundColor: theme.primary,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      ...theme.shadowLow,
    },
    avatarLetter: {
      fontSize: 18,
      fontWeight: '800',
      color: theme.primaryFg,
    },
    activeDot: {
      position: 'absolute',
      bottom: -1,
      right: -1,
      width: 12,
      height: 12,
      borderRadius: RADIUS.full,
      backgroundColor: theme.success,
      borderWidth: BORDER_WIDTH.thick,
      borderColor: theme.surface,
    },
    profileInfo: {
      flex: 1,
      minWidth: 0,
      gap: 2,
    },
    profileTitle: {
      fontSize: TYPOGRAPHY.subtitle.fontSize,
      lineHeight: TYPOGRAPHY.subtitle.lineHeight,
      fontWeight: '700',
      color: theme.textPrimary,
    },
    profileSecondary: {
      fontSize: TYPOGRAPHY.caption.fontSize,
      lineHeight: TYPOGRAPHY.caption.lineHeight,
      color: theme.textSecondary,
    },
    logoutButton: {
      minHeight: SPACING.touchTargetMin,
      paddingHorizontal: SPACING.s4,
      paddingVertical: SPACING.s2,
      borderRadius: RADIUS.full,
      backgroundColor: theme.surfaceSubdued,
      borderWidth: BORDER_WIDTH.thin,
      borderColor: withAlpha(theme.danger, '38'),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: SPACING.s2,
    },
    logoutLabel: {
      fontSize: TYPOGRAPHY.bodyMedium.fontSize,
      lineHeight: TYPOGRAPHY.bodyMedium.lineHeight,
      fontWeight: '700',
      color: theme.danger,
    },
    signInButton: {
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: RADIUS.full,
      borderWidth: BORDER_WIDTH.thick,
      backgroundColor: theme.primary,
      borderColor: isDark ? theme.primaryHover : withAlpha(theme.primaryHover, '55'),
      ...theme.shadowGlowPrimary,
    },
    signInLabel: {
      fontWeight: '700',
      color: theme.primaryFg,
    },
    buttonPressed: {
      opacity: 0.9,
      transform: [{ scale: 0.98 }],
    },
  });
}
