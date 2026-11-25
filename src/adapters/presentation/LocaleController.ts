import type {
  ILocaleCatalog,
  ILocaleController,
  ILocalePreference,
  LocaleCode,
  LocaleDescriptor,
  PreferenceSaveResult,
} from '../../application/ports';
import { ObservableViewStore } from '../state';
import { InMemoryLocalePreference } from './InMemoryLocalePreference';

export class LocaleController implements ILocaleController {
  private readonly store = new ObservableViewStore<LocaleCode>();
  private currentLocale: LocaleCode;

  public constructor(
    private readonly catalog: ILocaleCatalog,
    private readonly preference: ILocalePreference = new InMemoryLocalePreference(),
    defaultLocale: LocaleCode = 'es',
  ) {
    const persisted = this.preference.load();
    const resolved =
      persisted && this.catalog.findByCode(persisted)
        ? persisted
        : (this.catalog.findByCode(defaultLocale)?.code ??
          this.catalog.findAll()[0]?.code ??
          defaultLocale);
    this.currentLocale = resolved;
    this.store.publish(this.currentLocale);
  }

  public getLocale(): LocaleCode {
    return this.currentLocale;
  }

  public getAvailableLocales(): readonly LocaleDescriptor[] {
    return this.catalog.findAll();
  }

  public setLocale(code: LocaleCode): PreferenceSaveResult {
    if (!this.catalog.findByCode(code)) {
      return { ok: false, reason: 'UNKNOWN_LOCALE' };
    }
    const result = this.preference.save(code);
    if (!result.ok) {
      return result;
    }
    if (code !== this.currentLocale) {
      this.currentLocale = code;
      this.store.publish(code);
    }
    return { ok: true };
  }

  public subscribe(listener: (locale: LocaleCode) => void): () => void {
    return this.store.subscribe(listener);
  }
}
