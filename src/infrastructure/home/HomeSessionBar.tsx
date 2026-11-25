import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BORDER_WIDTH, RADIUS, SPACING, TYPOGRAPHY, type Theme } from '../theme';

export interface HomeSessionBarProps {
  readonly label: string;
  readonly hasSession: boolean;
  readonly theme: Theme;
  readonly isDark: boolean;
  readonly fontScale: number;
  readonly onPress: () => void;
}

function withAlpha(hex: string, alphaHex: string): string {
  if (/^#[0-9A-Fa-f]{6}$/.test(hex)) return `${hex}${alphaHex}`;
  return hex;
}

export function HomeSessionBar({
  label,
  hasSession,
  theme,
  isDark,
  fontScale,
  onPress,
}: HomeSessionBarProps) {
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Pressable
      testID="home-session-button"
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        {
          borderColor: withAlpha(theme.primary, isDark ? '33' : '24'),
        },
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.leftContent}>
        <View
          style={[
            styles.statusDot,
            { backgroundColor: hasSession ? theme.success : theme.borderStrong },
          ]}
        />
        <Text
          style={[styles.label, { fontSize: Math.round(13 * fontScale) }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {label}
        </Text>
      </View>
      <Text style={[styles.chevron, { color: theme.primary }]}>›</Text>
    </Pressable>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      width: '100%',
      minHeight: SPACING.touchTargetMin,
      marginTop: SPACING.s2,
      paddingHorizontal: SPACING.s4,
      paddingVertical: SPACING.s2,
      borderRadius: RADIUS.lg,
      borderWidth: BORDER_WIDTH.thin,
      backgroundColor: theme.surface,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      ...theme.shadowLow,
    },
    leftContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.s2,
      flexShrink: 1,
    },
    statusDot: {
      width: 8,
      height: 8,
      borderRadius: RADIUS.full,
    },
    label: {
      fontWeight: '600',
      color: theme.textPrimary,
      flexShrink: 1,
    },
    chevron: {
      fontSize: TYPOGRAPHY.subtitle.fontSize,
      fontWeight: '700',
      marginLeft: SPACING.s2,
    },
    pressed: {
      opacity: 0.85,
    },
  });
}
