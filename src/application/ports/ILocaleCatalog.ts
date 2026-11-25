import type { LocaleCode } from '../value-objects/settings.dto';

export interface LocaleDescriptor {
  readonly code: LocaleCode;
  readonly nativeName: string;
}

export interface ILocaleCatalog {
  findAll(): readonly LocaleDescriptor[];
  findByCode(code: LocaleCode): LocaleDescriptor | undefined;
}
