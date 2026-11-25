import type {
  ILocalePreference,
  LocaleCode,
  PreferenceSaveResult,
} from '../../application/ports';

export class InMemoryLocalePreference implements ILocalePreference {
  private selectedLocale: LocaleCode | null = null;

  public load(): LocaleCode | null {
    return this.selectedLocale;
  }

  public save(locale: LocaleCode): PreferenceSaveResult {
    this.selectedLocale = locale;
    return { ok: true };
  }
}
