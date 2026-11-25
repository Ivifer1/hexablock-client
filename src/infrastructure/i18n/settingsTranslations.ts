import type { LocaleDescriptor } from '../../application/ports';
import { HOME_TEXT_CATALOG } from './homeTranslations';

export const DEFAULT_LOCALES: readonly LocaleDescriptor[] = [
  { code: 'es', nativeName: 'Español' },
  { code: 'en', nativeName: 'English' },
];

export const SETTINGS_TEXT_CATALOG: Readonly<
  Record<string, Readonly<Record<string, string>>>
> = {
  'common.back': { es: 'Volver', en: 'Back' },
  'common.cancel': { es: 'Cancelar', en: 'Cancel' },
  'common.confirm': { es: 'Confirmar', en: 'Confirm' },
  'common.sign_in': { es: 'Iniciar sesión', en: 'Sign in' },
  'home.session_user': { es: 'Hola, {name}', en: 'Hi, {name}' },
  'settings.title': { es: 'Ajustes', en: 'Settings' },
  'settings.music': { es: 'Música', en: 'Music' },
  'settings.sfx': { es: 'Efectos de sonido', en: 'Sound effects' },
  'settings.appearance': { es: 'Apariencia', en: 'Appearance' },
  'settings.dark_mode': { es: 'Modo oscuro', en: 'Dark mode' },
  'settings.language': { es: 'Idioma', en: 'Language' },
  'settings.account': { es: 'Cuenta', en: 'Account' },
  'settings.logout': { es: 'Cerrar sesión', en: 'Sign out' },
  'settings.logout_confirm': { es: '¿Cerrar sesión?', en: 'Sign out?' },
  'settings.version': { es: 'Versión {version}', en: 'Version {version}' },
  'settings.version_badge': { es: 'v{version}', en: 'v{version}' },
  'settings.error_save': {
    es: 'No se pudo guardar el cambio',
    en: "The change couldn't be saved",
  },
  'lang.es': { es: 'Español', en: 'Español' },
  'lang.en': { es: 'English', en: 'English' },
};

export const APP_TEXT_CATALOG: Readonly<
  Record<string, Readonly<Record<string, string>>>
> = {
  ...HOME_TEXT_CATALOG,
  ...SETTINGS_TEXT_CATALOG,
};
