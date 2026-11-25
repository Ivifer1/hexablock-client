import type { LocaleCode } from '../value-objects/settings.dto';

export interface ISettingsPreferencesController {
  setMusicEnabled(enabled: boolean): void;
  setSfxEnabled(enabled: boolean): void;
  selectLocale(code: LocaleCode): void;
  setDarkMode(enabled: boolean): void;
}
