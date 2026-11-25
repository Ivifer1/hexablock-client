import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { BlockIcon } from '../mode-icons';
import { BORDER_WIDTH, RADIUS, SPACING, type ButtonSize, type Theme } from '../theme';
import { AppButton } from '../ui';
import { SessionActionIcon } from '../ui-icons/MenuIcons';

export interface HomeHeaderProps {
  readonly sessionLabel: string;
  readonly hasSession: boolean;
  readonly sessionButtonSize?: ButtonSize;
  readonly fontScale: number;
  readonly theme: Theme;
  readonly isDark: boolean;
  readonly onPressSession: () => void;
}

export function HomeHeader({
  sessionLabel,
  hasSession,
  sessionButtonSize = 's',
  fontScale,
  theme,
  isDark,
  onPressSession,
}: HomeHeaderProps) {
  const styles = useMemo(() => createStyles(theme), [theme]);
  const brandSize = Math.round(34 * fontScale);

  return (
    <View style={styles.header}>
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

      <AppButton
        testID="home-session-button"
        label={sessionLabel}
        variant="outline"
        size={sessionButtonSize}
        fontScale={fontScale}
        theme={theme}
        isDark={isDark}
        onPress={onPressSession}
        style={styles.sessionButton}
        leftIcon={({ color, size }) => (
          <SessionActionIcon hasSession={hasSession} color={color} size={size} />
        )}
        badge={
          hasSession ? (
            <View testID="home-session-active-dot" style={styles.sessionActiveDot} />
          ) : null
        }
      />
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
    sessionButton: {
      maxWidth: '58%',
      flexShrink: 0,
    },
    sessionActiveDot: {
      position: 'absolute',
      top: -2,
      right: -2,
      width: 11,
      height: 11,
      borderRadius: RADIUS.full,
      borderWidth: BORDER_WIDTH.thick,
      backgroundColor: theme.success,
      borderColor: theme.bg,
    },
  });
}
