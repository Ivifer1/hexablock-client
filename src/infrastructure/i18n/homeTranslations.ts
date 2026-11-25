import type { SupportedLocale } from '../../application/ports';

export const HOME_TEXT_CATALOG: Readonly<
  Record<string, Readonly<Record<SupportedLocale, string>>>
> = {
  'app.title': { es: 'HexaBlock Suite', en: 'HexaBlock Suite' },
  'home.settings': { es: 'Ajustes', en: 'Settings' },
  'home.play': { es: 'Jugar', en: 'Play' },
  'home.points': { es: 'Puntos', en: 'Points' },
  'home.session_user': { es: 'Hola, {name}', en: 'Hi, {name}' },
  'home.hero_title': { es: '¿A qué jugamos hoy?', en: 'What shall we play today?' },
  'home.hero_subtitle': {
    es: 'Cuatro juegos. Una aventura mental.',
    en: 'Four games. One mental adventure.',
  },
  'home.entry_direct': { es: 'Partida directa', en: 'Direct play' },
  'home.entry_levels': { es: 'Por niveles', en: 'Level mode' },
  'game.lines.name': { es: 'Hexa Lines', en: 'Hexa Lines' },
  'game.lines.short_name': { es: 'Lines', en: 'Lines' },
  'game.lines.desc': {
    es: 'Conecta líneas completas y despeja el tablero.',
    en: 'Complete full hex lines to clear the board.',
  },
  'game.fit.name': { es: 'Hexa Fit', en: 'Hexa Fit' },
  'game.fit.short_name': { es: 'Fit', en: 'Fit' },
  'game.fit.desc': {
    es: 'Encaja todas las piezas hasta llenar la figura.',
    en: 'Fit every piece cleanly into the hex shape.',
  },
  'game.sort.name': { es: 'Hexa Sort', en: 'Hexa Sort' },
  'game.sort.short_name': { es: 'Sort', en: 'Sort' },
  'game.sort.desc': {
    es: 'Apila y ordena las fichas de un mismo color.',
    en: 'Stack and group matching tiles by color.',
  },
  'game.merge.name': { es: 'Hexa Merge', en: 'Hexa Merge' },
  'game.merge.short_name': { es: 'Merge', en: 'Merge' },
  'game.merge.desc': {
    es: 'Desliza y fusiona fichas hasta llegar a la meta.',
    en: 'Slide and merge tiles to reach the target.',
  },
  'common.sign_in': { es: 'Iniciar sesión', en: 'Sign in' },
  'common.best_none': { es: 'Sin récord aún', en: 'No best score yet' },
  'common.best_value': { es: 'Récord: {value}', en: 'Best: {value}' },
  'common.levels_progress': {
    es: 'Niveles: {done} de {total}',
    en: 'Levels: {done} of {total}',
  },
  'home.error_progress': {
    es: 'No se pudo cargar tu progreso',
    en: "We couldn't load your progress",
  },
  'home.empty': { es: 'No hay juegos disponibles', en: 'No games available' },
  'home.play_mode': {
    es: 'Jugar {name}',
    en: 'Play {name}',
  },
  'home.play_now': {
    es: 'Jugar ahora',
    en: 'Play now',
  },
  'home.prev_mode': {
    es: 'Juego anterior',
    en: 'Previous game',
  },
  'home.next_mode': {
    es: 'Siguiente juego',
    en: 'Next game',
  },
  'home.theme_toggle_light': {
    es: 'Cambiar a modo claro',
    en: 'Switch to light mode',
  },
  'home.theme_toggle_dark': {
    es: 'Cambiar a modo oscuro',
    en: 'Switch to dark mode',
  },
};
