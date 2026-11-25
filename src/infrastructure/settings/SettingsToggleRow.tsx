import { useMemo, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { RADIUS, SPACING, TYPOGRAPHY, type Theme } from '../theme';

export interface SettingsToggleRowProps {
  readonly testID: string;
  readonly label: string;
  readonly value: boolean;
  readonly icon: ReactNode;
  readonly theme: Theme;
  readonly isDark: boolean;
  readonly onToggle: (nextValue: boolean) => void;
}

function withAlpha(hex: string, alphaHex: string): string {
  if (/^#[0-9A-Fa-f]{6}$/.test(hex)) return `${hex}${alphaHex}`;
  return hex;
}

export function SettingsToggleRow({
  testID,
  label,
  value,
  icon,
  theme,
  isDark,
  onToggle,
}: SettingsToggleRowProps) {
  const styles = useMemo(() => createStyles(theme, isDark), [theme, isDark]);

  return (
    <Pressable
      testID={testID}
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{ checked: value }}
      onPress={() => onToggle(!value)}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
    >
      <View style={styles.labelGroup}>
        <View style={styles.iconBadge}>{icon}</View>
        <Text style={styles.label} numberOfLines={2}>
          {label}
        </Text>
      </View>

      <View
        style={[
          styles.track,
          value ? styles.trackActive : styles.trackInactive,
        ]}
      >
        <View style={styles.knob}>
          <View
            style={[
              styles.knobDot,
              { backgroundColor: value ? theme.primary : theme.borderStrong },
            ]}
          />
        </View>
      </View>
    </Pressable>
  );
}

function createStyles(theme: Theme, isDark: boolean) {
  return StyleSheet.create({
    row: {
      minHeight: SPACING.touchTargetMin,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: SPACING.s3,
      paddingVertical: SPACING.s1,
    },
    rowPressed: {
      opacity: 0.85,
    },
    labelGroup: {
      flex: 1,
      minWidth: 0,
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.s3,
    },
    iconBadge: {
      width: 40,
      height: 40,
      borderRadius: RADIUS.lg,
      backgroundColor: withAlpha(theme.primary, isDark ? '24' : '16'),
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    label: {
      flex: 1,
      fontSize: TYPOGRAPHY.subtitle.fontSize,
      lineHeight: TYPOGRAPHY.subtitle.lineHeight,
      fontWeight: '600',
      color: theme.textPrimary,
    },
    track: {
      width: 56,
      height: 32,
      borderRadius: RADIUS.full,
      padding: 4,
      justifyContent: 'center',
      flexShrink: 0,
    },
    trackActive: {
      backgroundColor: theme.primary,
      alignItems: 'flex-end',
    },
    trackInactive: {
      backgroundColor: theme.surfaceSubdued,
      alignItems: 'flex-start',
    },
    knob: {
      width: 24,
      height: 24,
      borderRadius: RADIUS.full,
      backgroundColor: theme.surface,
      alignItems: 'center',
      justifyContent: 'center',
      ...theme.shadowLow,
    },
    knobDot: {
      width: 6,
      height: 6,
      borderRadius: RADIUS.full,
    },
  });
}
