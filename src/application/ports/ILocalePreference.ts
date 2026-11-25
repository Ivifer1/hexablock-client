import type { LocaleCode } from '../value-objects/settings.dto';
import type { PreferenceSaveResult } from './PreferenceSaveResult';

export interface ILocalePreference {
  load(): LocaleCode | null;
  save(locale: LocaleCode): PreferenceSaveResult;
}
