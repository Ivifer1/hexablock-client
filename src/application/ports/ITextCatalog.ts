import type { I18nKeyDTO } from '../value-objects';

export type LocaleCode = string;
export type SupportedLocale = LocaleCode;

export interface ITextCatalog {
  resolve(input: string | I18nKeyDTO, locale?: SupportedLocale): string;
}
