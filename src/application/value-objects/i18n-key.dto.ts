export interface I18nKeyDTO {
  readonly key: string;
  readonly parameters?: Readonly<Record<string, string | number>>;
}
