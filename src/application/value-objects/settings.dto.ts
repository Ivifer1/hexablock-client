import type { I18nKeyDTO } from './i18n-key.dto';

export type LocaleCode = string;

export type SettingsEntryOrigin = 'HOME' | 'PAUSE';

export interface LocaleOptionDTO {
  readonly code: LocaleCode;
  readonly nativeName: string;
  readonly isSelected: boolean;
}

export interface SettingsSessionDTO {
  readonly isEnabled: boolean;
  readonly isAuthenticated: boolean;
  readonly displayName: string | null;
  readonly secondaryText: string | null;
}

export interface SettingsViewDTO {
  readonly origin: SettingsEntryOrigin;
  readonly title: I18nKeyDTO;
  readonly backLabel: I18nKeyDTO;
  readonly musicEnabled: boolean;
  readonly sfxEnabled: boolean;
  readonly isDarkMode: boolean;
  readonly locales: readonly LocaleOptionDTO[];
  readonly activeLocale: LocaleCode;
  readonly session: SettingsSessionDTO;
  readonly isLogoutConfirmOpen: boolean;
  readonly errorMessage: I18nKeyDTO | null;
  readonly versionLabel: I18nKeyDTO | null;
  readonly showBottomMenu: boolean;
}
