import { useCallback, useSyncExternalStore } from 'react';
import type { ILocaleController, LocaleCode } from '../../application/ports';

const NOOP_UNSUBSCRIBE = () => undefined;

export function useLocale(
  localeController?: ILocaleController,
  fallbackLocale: LocaleCode = 'es',
): LocaleCode {
  const subscribe = useCallback(
    (onStoreChange: () => void) =>
      localeController ? localeController.subscribe(onStoreChange) : NOOP_UNSUBSCRIBE,
    [localeController],
  );

  const getSnapshot = useCallback(
    (): LocaleCode => localeController?.getLocale() ?? fallbackLocale,
    [localeController, fallbackLocale],
  );

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
