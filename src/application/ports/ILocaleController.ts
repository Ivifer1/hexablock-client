import type { LocaleCode } from '../value-objects/settings.dto';
import type { LocaleDescriptor } from './ILocaleCatalog';
import type { PreferenceSaveResult } from './PreferenceSaveResult';

export interface ILocaleController {
  getLocale(): LocaleCode;
  getAvailableLocales(): readonly LocaleDescriptor[];
  setLocale(code: LocaleCode): PreferenceSaveResult;
  subscribe(listener: (locale: LocaleCode) => void): () => void;
}
