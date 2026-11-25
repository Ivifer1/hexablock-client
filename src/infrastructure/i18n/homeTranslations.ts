import type { SupportedLocale } from '../../application/ports';

export const HOME_TEXT_CATALOG: Readonly<
  Record<string, Readonly<Record<SupportedLocale, string>>>
> = {
  'app.title': { es: 'HexaBlock', en: 'HexaBlock' },
  'home.settings': { es: 'Ajustes', en: 'Settings' },
  'home.play': { es: 'Jugar', en: 'Play' },
  'home.points': { es: 'Puntos', en: 'Points' },
  'home.hero_title': { es: '¿A qué jugamos hoy?', en: 'What shall we play today?' },
  'home.hero_subtitle': {
    es: 'Cuatro formas de encontrar tu equilibrio.',
    en: 'Four ways to find your balance.',
  },
  'game.lines.name': { es: 'Hexa Lines', en: 'Hexa Lines' },
  'game.lines.desc': {
    es: 'Conecta líneas completas y despeja el tablero.',
    en: 'Complete full hex lines to clear the board.',
  },
  'game.fit.name': { es: 'Hexa Fit', en: 'Hexa Fit' },
  'game.fit.desc': {
    es: 'Encaja todas las piezas hasta llenar la figura.',
    en: 'Fit every piece cleanly into the hex shape.',
  },
  'game.sort.name': { es: 'Hexa Sort', en: 'Hexa Sort' },
  'game.sort.desc': {
    es: 'Apila y ordena las fichas de un mismo color.',
    en: 'Stack and group matching tiles by color.',
  },
  'game.merge.name': { es: 'Hexa Merge', en: 'Hexa Merge' },
  'game.merge.desc': {
    es: 'Desliza y fusiona fichas hasta llegar a la meta.',
    en: 'Slide and merge tiles to reach the target.',
  },
  'common.sign_in': { es: 'Iniciar sesión', en: 'Sign in' },
  'common.best_none': { es: 'Sin récord aún', en: 'No best score yet' },
  'common.best_value': { es: 'Mejor récord', en: 'Best score' },
  'home.error_progress': {
    es: 'No se pudo cargar tu progreso',
    en: "Couldn't load your progress",
  },
  'home.empty': { es: 'No hay juegos disponibles', en: 'No games available' },
  'home.levels_progress': {
    es: 'Niveles: {completed} de {total}',
    en: 'Levels: {completed} of {total}',
  },
  'home.best_score_value': {
    es: 'Mejor récord: {value} pts',
    en: 'Best score: {value} pts',
  },
  'home.play_mode': {
    es: 'Jugar {name}',
    en: 'Play {name}',
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
