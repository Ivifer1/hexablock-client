import { useCallback, useState } from 'react';
import { useColorScheme } from 'react-native';
import { LIGHT_THEME, DARK_THEME, type Theme } from '../theme/tokens';

export function useTheme(): {
  readonly theme: Theme;
  readonly isDark: boolean;
  readonly toggleTheme: () => void;
} {
  const colorScheme = useColorScheme();
  const [override, setOverride] = useState<'light' | 'dark' | null>(null);
  const isDark = (override ?? (colorScheme === 'dark' ? 'dark' : 'light')) === 'dark';

  const toggleTheme = useCallback(() => {
    setOverride(isDark ? 'light' : 'dark');
  }, [isDark]);

  return {
    theme: isDark ? DARK_THEME : LIGHT_THEME,
    isDark,
    toggleTheme,
  };
}