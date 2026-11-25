import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BlockIcon } from '../mode-icons';
import { BORDER_WIDTH, RADIUS, SPACING, type Theme } from '../theme';
import { ThemeToggleIcon } from '../ui-icons/MenuIcons';

export interface HomeHeaderProps {
  readonly title: string;
  readonly toggleLabel: string;
  readonly fontScale: number;
  readonly theme: Theme;
  readonly isDark: boolean;
  readonly onToggleTheme: () => void;
}

export function HomeHeader({
  title,
  toggleLabel,
  fontScale,
  theme,
  isDark,
  onToggleTheme,
}: HomeHeaderProps) {
  const styles = useMemo(() => createStyles(theme), [theme]);
  const brandSize = 36 * fontScale;

  return (
    <View style={styles.header}>
      <View style={styles.brand} accessibilityRole="header">
        <View style={{ width: brandSize, height: brandSize, alignItems: 'center', justifyContent: 'center' }}>
          <BlockIcon color="#13968A" size={brandSize} isSelected />
        </View>
        <Text
          style={[
            styles.title,
            {
              fontSize: 24 * fontScale,
              lineHeight: 32 * fontScale,
            },
          ]}
        >
          {title}
        </Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={toggleLabel}
        onPress={onToggleTheme}
        hitSlop={8}
        style={({ pressed }) => [
          styles.themeToggle,
          pressed && styles.pressedControl,
        ]}
      >
        <ThemeToggleIcon
          isDark={isDark}
          color={isDark ? theme.warning : theme.textSecondary}
          size={20}
        />
      </Pressable>
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
    pressedControl: { opacity: 0.88 },
  });
}
