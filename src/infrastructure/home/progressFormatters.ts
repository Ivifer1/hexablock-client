import type { ITextCatalog, SupportedLocale } from '../../application/ports';
import type { HomeProgressDTO } from '../../application/value-objects';

export type HomeProgressFormatter = (
  progress: HomeProgressDTO,
  textCatalog: ITextCatalog,
  locale: SupportedLocale,
) => string | null;

export type HomeProgressFormatterMap = Readonly<Record<string, HomeProgressFormatter>>;

export const DEFAULT_HOME_PROGRESS_FORMATTERS: Readonly<
  Record<HomeProgressDTO['kind'], HomeProgressFormatter>
> = {
  LEVELS: (progress, textCatalog, locale) => {
    if (progress.kind !== 'LEVELS') return null;
    return textCatalog.resolve(
      {
        key: 'common.levels_progress',
        parameters: { done: progress.completed, total: progress.total },
      },
      locale,
    );
  },
  BEST: (progress, textCatalog, locale) => {
    if (progress.kind !== 'BEST') return null;
    const numberLocale = locale === 'es' ? 'es-ES' : 'en-US';
    return textCatalog.resolve(
      {
        key: 'common.best_value',
        parameters: { value: progress.value.toLocaleString(numberLocale) },
      },
      locale,
    );
  },
  ERROR: () => null,
  LOADING: () => '…',
  NONE: (_progress, textCatalog, locale) =>
    textCatalog.resolve('common.best_none', locale),
  CUSTOM: (progress, textCatalog, locale) => {
    if (progress.kind !== 'CUSTOM') return null;
    return textCatalog.resolve(progress.label, locale);
  },
};

export function formatHomeProgress(
  progress: HomeProgressDTO,
  textCatalog: ITextCatalog,
  locale: SupportedLocale,
  customFormatters?: HomeProgressFormatterMap,
): string | null {
  if (
    customFormatters &&
    Object.prototype.hasOwnProperty.call(customFormatters, progress.kind)
  ) {
    const customFormatter = customFormatters[progress.kind];
    if (customFormatter) {
      return customFormatter(progress, textCatalog, locale);
    }
  }

  if (Object.prototype.hasOwnProperty.call(DEFAULT_HOME_PROGRESS_FORMATTERS, progress.kind)) {
    const defaultFormatter =
      DEFAULT_HOME_PROGRESS_FORMATTERS[progress.kind as HomeProgressDTO['kind']];
    return defaultFormatter(progress, textCatalog, locale);
  }

  return textCatalog.resolve('common.best_none', locale);
}
