import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BORDER_WIDTH, RADIUS, SPACING, TYPOGRAPHY, type Theme } from '../theme';
import { BackArrowIcon } from '../ui-icons/SettingsIcons';

export interface SettingsHeaderProps {
  readonly title: string;
  readonly backLabel: string;
  readonly theme: Theme;
  readonly onBack: () => void;
}

export function SettingsHeader({
  title,
  backLabel,
  theme,
  onBack,
}: SettingsHeaderProps) {
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.header}>
      <View style={styles.leftGroup}>
        <Pressable
          testID="settings-back-button"
          accessibilityRole="button"
          accessibilityLabel={backLabel}
          onPress={onBack}
          hitSlop={8}
          style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
        >
          <BackArrowIcon color={theme.textPrimary} size={22} />
        </Pressable>

        <Text
          accessibilityRole="header"
          numberOfLines={1}
          style={styles.title}
        >
          {title}
        </Text>
      </View>
    </View>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    header: {
      width: '100%',
      maxWidth: 480,
      alignSelf: 'center',
      minHeight: SPACING.touchTargetMin,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    leftGroup: {
      flex: 1,
      minWidth: 0,
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.s3,
    },
    backButton: {
      width: SPACING.touchTargetMin,
      height: SPACING.touchTargetMin,
      borderRadius: RADIUS.full,
      backgroundColor: theme.surface,
      borderWidth: BORDER_WIDTH.thin,
      borderColor: theme.borderDefault,
      alignItems: 'center',
      justifyContent: 'center',
      ...theme.shadowLow,
    },
    backButtonPressed: {
      opacity: 0.85,
      transform: [{ scale: 0.96 }],
    },
    title: {
      fontSize: TYPOGRAPHY.title2.fontSize,
      lineHeight: TYPOGRAPHY.title2.lineHeight,
      fontWeight: '800',
      color: theme.textPrimary,
      letterSpacing: -0.3,
      flexShrink: 1,
    },
  });
}
