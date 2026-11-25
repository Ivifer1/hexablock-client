import type { IThemePreference, ThemeMode } from '../../application/ports';

export class InMemoryThemePreference implements IThemePreference {
  private currentMode: ThemeMode | null;

  public constructor(initialMode: ThemeMode | null = null) {
    this.currentMode = initialMode;
  }

  public load(): ThemeMode | null {
    return this.currentMode;
  }

  public save(mode: ThemeMode): void {
    this.currentMode = mode;
  }
}
