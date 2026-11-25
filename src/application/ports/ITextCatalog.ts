import type { I18nKeyDTO } from '../value-objects';

export type SupportedLocale = 'es' | 'en';

export interface ITextCatalog {
  resolve(input: string | I18nKeyDTO, locale?: SupportedLocale): string;
}
