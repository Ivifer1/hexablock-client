import type { ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { RADIUS, scaleButtonSize, type ButtonSize, type Theme } from '../theme';
import {
  resolveButtonVariantStyle,
  type AppButtonShape,
  type AppButtonVariant,
  type AppButtonVariantStrategy,
} from './buttonVariants';

export interface AppButtonIconContext {
  readonly color: string;
  readonly size: number;
}

export interface AppButtonProps {
  readonly label: string;
  readonly onPress: () => void;
  readonly theme: Theme;
  readonly isDark: boolean;
  readonly variant?: AppButtonVariant | AppButtonVariantStrategy;
  readonly size?: ButtonSize;
  readonly shape?: AppButtonShape;
  readonly fontScale?: number;
  readonly fullWidth?: boolean;
  readonly disabled?: boolean;
  readonly leftIcon?: (ctx: AppButtonIconContext) => ReactNode;
  readonly rightIcon?: (ctx: AppButtonIconContext) => ReactNode;
  readonly badge?: ReactNode;
  readonly accessibilityLabel?: string;
  readonly testID?: string;
  readonly style?: StyleProp<ViewStyle>;
}

export function AppButton({
  label,
  onPress,
  theme,
  isDark,
  variant = 'primary',
  size = 'm',
  shape = 'pill',
  fontScale = 1,
  fullWidth = false,
  disabled = false,
  leftIcon,
  rightIcon,
  badge,
  accessibilityLabel,
  testID,
  style,
}: AppButtonProps) {
  const metrics = scaleButtonSize(size, fontScale);
  const variantStyle = resolveButtonVariantStyle(variant, theme, isDark);
  const borderRadius = shape === 'pill' ? RADIUS.full : RADIUS.lg;
  const iconCtx: AppButtonIconContext = {
    color: variantStyle.iconColor,
    size: metrics.iconSize,
  };

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      hitSlop={size === 's' ? 8 : undefined}
      style={({ pressed }) => [
        styles.base,
        {
          minHeight: metrics.minHeight,
          paddingHorizontal: metrics.paddingHorizontal,
          paddingVertical: metrics.paddingVertical,
          borderRadius,
          gap: metrics.gap,
          backgroundColor: variantStyle.backgroundColor,
          borderColor: variantStyle.borderColor,
          borderWidth: variantStyle.borderWidth,
        },
        variantStyle.shadowStyle,
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      {leftIcon ? leftIcon(iconCtx) : null}
      <Text
        style={[
          styles.label,
          {
            color: variantStyle.textColor,
            fontSize: metrics.fontSize,
            lineHeight: metrics.lineHeight,
            fontWeight: variantStyle.fontWeight,
          },
        ]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {label}
      </Text>
      {rightIcon ? rightIcon(iconCtx) : null}
      {badge}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.45,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.97 }],
  },
  label: {
    flexShrink: 1,
  },
});
