import type { ITextCatalog, SupportedLocale } from '../../application/ports';
import type { I18nKeyDTO } from '../../application/value-objects';

export type TranslationDictionary = Readonly<Record<string, Readonly<Record<SupportedLocale, string>>>>;

/**
 * Resolves i18n keys against an injected static dictionary and interpolates `{param}` tokens.
 */
export class StaticTextCatalog implements ITextCatalog {
  public constructor(
    private readonly translations: TranslationDictionary,
    private readonly defaultLocale: SupportedLocale = 'es',
  ) {}

  public resolve(input: string | I18nKeyDTO, locale?: SupportedLocale): string {
    const key = typeof input === 'string' ? input : input.key;
    const parameters = typeof input === 'string' ? undefined : input.parameters;
    const activeLocale = locale ?? this.defaultLocale;
    const template = this.translations[key]?.[activeLocale] ?? key;

    if (!parameters) {
      return template;
    }

    return Object.entries(parameters).reduce(
      (result, [paramKey, paramValue]) =>
        result.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramValue)),
      template,
    );
  }
}
