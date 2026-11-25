import { useCallback, useState, useSyncExternalStore } from 'react';
import { useColorScheme } from 'react-native';
import type { IThemeController, ThemeMode } from '../../application/ports';
import { LIGHT_THEME, DARK_THEME, type Theme } from './tokens';

const NOOP_UNSUBSCRIBE = () => undefined;

export function useTheme(themeController?: IThemeController): {
  readonly mode: ThemeMode;
  readonly theme: Theme;
  readonly isDark: boolean;
  readonly setTheme: (mode: ThemeMode) => void;
  readonly toggleTheme: () => void;
} {
  const colorScheme = useColorScheme();
  const [fallbackOverride, setFallbackOverride] = useState<ThemeMode | null>(null);

  const subscribe = useCallback(
    (onStoreChange: () => void) =>
      themeController ? themeController.subscribe(onStoreChange) : NOOP_UNSUBSCRIBE,
    [themeController],
  );

  const getSnapshot = useCallback(
    (): ThemeMode => themeController?.getMode() ?? 'light',
    [themeController],
  );

  const sharedMode = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const fallbackMode: ThemeMode =
    fallbackOverride ?? (colorScheme === 'dark' ? 'dark' : 'light');
  const mode: ThemeMode = themeController ? sharedMode : fallbackMode;
  const isDark = mode === 'dark';

  const setTheme = useCallback(
    (nextMode: ThemeMode) => {
      if (themeController) {
        themeController.setMode(nextMode);
        return;
      }
      setFallbackOverride(nextMode);
    },
    [themeController],
  );

  const toggleTheme = useCallback(() => {
    if (themeController) {
      themeController.toggleTheme();
      return;
    }
    setFallbackOverride(isDark ? 'light' : 'dark');
  }, [themeController, isDark]);

  return {
    mode,
    theme: isDark ? DARK_THEME : LIGHT_THEME,
    isDark,
    setTheme,
    toggleTheme,
  };
}
