import type { ThemeMode } from './IThemePreference';

export interface IThemeController {
  getMode(): ThemeMode;
  setMode(mode: ThemeMode): void;
  toggleTheme(): ThemeMode;
  subscribe(listener: (mode: ThemeMode) => void): () => void;
}
