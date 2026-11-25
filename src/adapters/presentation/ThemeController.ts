import type {
  IThemeController,
  IThemePreference,
  ThemeMode,
} from '../../application/ports';
import { ObservableViewStore } from '../state';
import { InMemoryThemePreference } from './InMemoryThemePreference';

export class ThemeController implements IThemeController {
  private readonly store = new ObservableViewStore<ThemeMode>();
  private currentMode: ThemeMode;

  public constructor(
    private readonly preference: IThemePreference = new InMemoryThemePreference(),
    defaultMode: ThemeMode = 'light',
  ) {
    this.currentMode = this.preference.load() ?? defaultMode;
    this.store.publish(this.currentMode);
  }

  public getMode(): ThemeMode {
    return this.currentMode;
  }

  public setMode(mode: ThemeMode): void {
    this.preference.save(mode);
    if (mode === this.currentMode) return;
    this.currentMode = mode;
    this.store.publish(mode);
  }

  public toggleTheme(): ThemeMode {
    const nextMode: ThemeMode = this.currentMode === 'dark' ? 'light' : 'dark';
    this.setMode(nextMode);
    return nextMode;
  }

  public subscribe(listener: (mode: ThemeMode) => void): () => void {
    return this.store.subscribe(listener);
  }
}
