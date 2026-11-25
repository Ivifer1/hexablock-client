import type { ILocaleCatalog, LocaleCode, LocaleDescriptor } from '../../application/ports';

/**
 * In-memory read-only catalog of configured application locales.
 */
export class StaticLocaleCatalog implements ILocaleCatalog {
  private readonly locales: readonly LocaleDescriptor[];

  public constructor(locales: readonly LocaleDescriptor[] = []) {
    this.locales = [...locales];
  }

  public findAll(): readonly LocaleDescriptor[] {
    return this.locales;
  }

  public findByCode(code: LocaleCode): LocaleDescriptor | undefined {
    return this.locales.find((locale) => locale.code === code);
  }
}
