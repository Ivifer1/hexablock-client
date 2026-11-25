import type { ViewStyle } from 'react-native';
import { BORDER_WIDTH, withAlpha, type Theme } from '../theme';

export type AppButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

export type AppButtonShape = 'pill' | 'rounded';

export interface AppButtonVariantStyle {
  readonly backgroundColor: string;
  readonly borderColor: string;
  readonly borderWidth: number;
  readonly textColor: string;
  readonly iconColor: string;
  readonly fontWeight: '600' | '700';
  readonly shadowStyle?: ViewStyle;
}

export type AppButtonVariantStrategy = (
  theme: Theme,
  isDark: boolean,
) => AppButtonVariantStyle;

export const APP_BUTTON_VARIANTS: Readonly<
  Record<AppButtonVariant, AppButtonVariantStrategy>
> = {
  primary: (theme) => ({
    backgroundColor: theme.primary,
    borderColor: 'transparent',
    borderWidth: 0,
    textColor: theme.primaryFg,
    iconColor: theme.primaryFg,
    fontWeight: '700',
    shadowStyle: {
      ...theme.shadowGlowPrimary,
      shadowColor: theme.primary,
    },
  }),
  secondary: (theme) => ({
    backgroundColor: theme.surfaceSubdued,
    borderColor: theme.borderDefault,
    borderWidth: BORDER_WIDTH.thin,
    textColor: theme.textPrimary,
    iconColor: theme.textPrimary,
    fontWeight: '600',
    shadowStyle: theme.shadowLow,
  }),
  outline: (theme, isDark) => ({
    backgroundColor: isDark ? withAlpha(theme.primary, '12') : theme.surface,
    borderColor: withAlpha(isDark ? theme.primaryHover : theme.primary, '88'),
    borderWidth: 1.5,
    textColor: theme.textPrimary,
    iconColor: isDark ? theme.textPrimary : theme.primary,
    fontWeight: '600',
    shadowStyle: theme.shadowLow,
  }),
  ghost: (theme, isDark) => ({
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderWidth: 0,
    textColor: isDark ? theme.primaryHover : theme.primary,
    iconColor: isDark ? theme.primaryHover : theme.primary,
    fontWeight: '600',
  }),
  danger: (theme) => ({
    backgroundColor: theme.danger,
    borderColor: 'transparent',
    borderWidth: 0,
    textColor: theme.primaryFg,
    iconColor: theme.primaryFg,
    fontWeight: '700',
    shadowStyle: theme.shadowLow,
  }),
};

export function resolveButtonVariantStyle(
  variant: AppButtonVariant | AppButtonVariantStrategy,
  theme: Theme,
  isDark: boolean,
): AppButtonVariantStyle {
  if (typeof variant === 'function') {
    return variant(theme, isDark);
  }
  return APP_BUTTON_VARIANTS[variant](theme, isDark);
}
