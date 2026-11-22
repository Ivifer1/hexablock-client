import type { I18nKeyDTO } from './i18n-key.dto';

export type GameId = string;
export type LevelNumber = number;

export interface GameHudDTO {
  readonly gameId: GameId;
  readonly title: I18nKeyDTO;
  readonly levelNumber: LevelNumber | null;
  readonly score: number | null;
  readonly bestScore: number | null;
  readonly moves: number | null;
  readonly elapsedSeconds: number | null;
  readonly goalsCompleted: number | null;
  readonly goalsTotal: number | null;
  readonly trayLabel: I18nKeyDTO | null;
}
