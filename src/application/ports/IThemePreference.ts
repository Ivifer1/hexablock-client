export type ThemeMode = 'light' | 'dark';

export interface IThemePreference {
  load(): ThemeMode | null;
  save(mode: ThemeMode): void;
}
