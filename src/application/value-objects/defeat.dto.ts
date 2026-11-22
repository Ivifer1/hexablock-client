import type { GameId } from './game-hud.dto';
import type { I18nKeyDTO } from './i18n-key.dto';

export type DefeatReason =
  | 'LINES_NO_PIECE_FITS'
  | 'SORT_BOARD_FULL'
  | 'MERGE_NO_MOVE_CHANGES_BOARD';

export type DefeatAction = 'RETRY' | 'GO_TO_LEVELS' | 'GO_HOME';

export interface DefeatViewDTO {
  readonly gameId: GameId;
  readonly title: I18nKeyDTO;
  readonly reasonLabel: I18nKeyDTO;
  readonly score: number;
  readonly reason: DefeatReason;
  readonly completedGoals: number | null;
  readonly totalGoals: number | null;
  readonly bestScore: number | null;
  readonly isNewBest: boolean;
  readonly availableActions: readonly DefeatAction[];
}
