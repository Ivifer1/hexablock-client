import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BlockIcon } from '../mode-icons';
import {
  BORDER_WIDTH,
  RADIUS,
  SPACING,
  scaleButtonSize,
  type ButtonSize,
  type Theme,
} from '../theme';
import { SessionActionIcon } from '../ui-icons/MenuIcons';

export interface HomeHeaderProps {
  readonly title: string;
  readonly sessionLabel: string;
  readonly hasSession: boolean;
  readonly sessionButtonSize?: ButtonSize;
  readonly fontScale: number;
  readonly theme: Theme;
  readonly isDark: boolean;
  readonly onPressSession: () => void;
}

function withAlpha(hex: string, alphaHex: string): string {
  if (/^#[0-9A-Fa-f]{6}$/.test(hex)) return `${hex}${alphaHex}`;
  return hex;
}

export function HomeHeader({
  title,
  sessionLabel,
  hasSession,
  sessionButtonSize = 's',
  fontScale,
  theme,
  isDark,
  onPressSession,
}: HomeHeaderProps) {
  const styles = useMemo(() => createStyles(theme), [theme]);
  const brandSize = Math.round(30 * fontScale);
  const sessionButton = scaleButtonSize(sessionButtonSize, fontScale);

  return (
    <View style={styles.header}>
      <View style={styles.brand} accessibilityRole="header">
        <View
          style={{
            width: brandSize,
            height: brandSize,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <BlockIcon color="#13968A" size={brandSize} isSelected />
        </View>
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.78}
          style={[
            styles.title,
            {
              fontSize: Math.round(19 * fontScale),
              lineHeight: Math.round(26 * fontScale),
            },
          ]}
        >
          {title}
        </Text>
      </View>
      <Pressable
        testID="home-session-button"
        accessibilityRole="button"
        accessibilityLabel={sessionLabel}
        onPress={onPressSession}
        hitSlop={8}
        style={({ pressed }) => [
          styles.sessionButton,
          {
            minHeight: sessionButton.minHeight,
            paddingHorizontal: sessionButton.paddingHorizontal,
            paddingVertical: sessionButton.paddingVertical,
            gap: sessionButton.gap,
            backgroundColor: theme.primary,
            borderColor: isDark ? theme.primaryHover : withAlpha(theme.primaryHover, '55'),
          },
          pressed && styles.sessionButtonPressed,
        ]}
      >
        <SessionActionIcon
          hasSession={hasSession}
          color={theme.primaryFg}
          size={sessionButton.iconSize}
        />
        <Text
          style={[
            styles.sessionLabel,
            {
              color: theme.primaryFg,
              fontSize: sessionButton.fontSize,
              lineHeight: sessionButton.lineHeight,
            },
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {sessionLabel}
        </Text>
        {hasSession ? (
          <View
            testID="home-session-active-dot"
            style={[
              styles.sessionActiveDot,
              {
                backgroundColor: theme.success,
                borderColor: theme.bg,
              },
            ]}
          />
        ) : null}
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
      gap: SPACING.s2,
    },
    brand: {
      flex: 1,
      minWidth: 0,
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.s2,
    },
    title: {
      fontWeight: '800',
      color: theme.textPrimary,
      letterSpacing: -0.3,
      flexShrink: 1,
    },
    sessionButton: {
      maxWidth: '48%',
      flexShrink: 0,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: RADIUS.full,
      borderWidth: BORDER_WIDTH.thick,
      ...theme.shadowGlowPrimary,
    },
    sessionLabel: {
      fontWeight: '700',
      flexShrink: 1,
    },
    sessionActiveDot: {
      position: 'absolute',
      top: -2,
      right: -2,
      width: 11,
      height: 11,
      borderRadius: RADIUS.full,
      borderWidth: BORDER_WIDTH.thick,
    },
    sessionButtonPressed: {
      opacity: 0.9,
      transform: [{ scale: 0.96 }],
    },
  });
}
