import type {
  IAudioEnginePort,
  IAudioSettingsPreference,
  ILocaleController,
  ISettingsPreferencesController,
  IThemeController,
  LocaleCode,
} from '../../application/ports';
import type { ISettingsPresenter } from './SettingsPresenter';
import type { SettingsStateHolder } from './SettingsStateHolder';

export interface SettingsPreferencesDeps {
  readonly state: SettingsStateHolder;
  readonly audioPreference: IAudioSettingsPreference;
  readonly audioEngine: IAudioEnginePort;
  readonly localeController: ILocaleController;
  readonly themeController: IThemeController;
  readonly presenter: ISettingsPresenter;
}

export class SettingsPreferencesController implements ISettingsPreferencesController {
  public constructor(private readonly deps: SettingsPreferencesDeps) {}

  public setMusicEnabled(enabled: boolean): void {
    const previous = this.deps.state.getSnapshot();
    const result = this.deps.audioPreference.save({
      musicEnabled: enabled,
      sfxEnabled: previous.sfxEnabled,
    });

    if (!result.ok) {
      this.deps.state.update({
        musicEnabled: previous.musicEnabled,
        errorKey: 'settings.error_save',
      });
      this.presentCurrent();
      return;
    }

    this.deps.state.update({
      musicEnabled: enabled,
      errorKey: null,
    });
    this.deps.audioEngine.setMusicEnabled(enabled);
    this.presentCurrent();
  }

  public setSfxEnabled(enabled: boolean): void {
    const previous = this.deps.state.getSnapshot();
    const result = this.deps.audioPreference.save({
      musicEnabled: previous.musicEnabled,
      sfxEnabled: enabled,
    });

    if (!result.ok) {
      this.deps.state.update({
        sfxEnabled: previous.sfxEnabled,
        errorKey: 'settings.error_save',
      });
      this.presentCurrent();
      return;
    }

    this.deps.state.update({
      sfxEnabled: enabled,
      errorKey: null,
    });
    this.deps.audioEngine.setSfxEnabled(enabled);
    if (enabled) {
      this.deps.audioEngine.playConfirmationSfx();
    }
    this.presentCurrent();
  }

  public selectLocale(code: LocaleCode): void {
    const previous = this.deps.state.getSnapshot();
    const result = this.deps.localeController.setLocale(code);

    if (!result.ok) {
      this.deps.state.update({
        activeLocale: previous.activeLocale,
        errorKey: 'settings.error_save',
      });
      this.presentCurrent();
      return;
    }

    this.deps.state.update({
      activeLocale: this.deps.localeController.getLocale(),
      errorKey: null,
    });
    this.presentCurrent();
  }

  public setDarkMode(enabled: boolean): void {
    const nextMode = enabled ? 'dark' : 'light';
    this.deps.themeController.setMode(nextMode);
    const actualMode = this.deps.themeController.getMode();

    if (actualMode !== nextMode) {
      this.deps.state.update({
        isDarkMode: actualMode === 'dark',
        errorKey: 'settings.error_save',
      });
      this.presentCurrent();
      return;
    }

    this.deps.state.update({
      isDarkMode: enabled,
      errorKey: null,
    });
    this.presentCurrent();
  }

  private presentCurrent(): void {
    this.deps.presenter.present(this.deps.state.getSnapshot());
  }
}
