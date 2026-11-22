import type { I18nKeyDTO } from './i18n-key.dto';
import type { ScreenLoadState } from './screen-load-state';
import type { GameId, LevelNumber } from './game-hud.dto';

export type LevelStatus = 'LOCKED' | 'AVAILABLE' | 'COMPLETED';

export interface LevelSelectionItemDTO {
  readonly levelNumber: LevelNumber;
  readonly status: LevelStatus;
  readonly stars: number;
  readonly bestScore: number | null;
}

export type LevelSelectionAction = 'RETRY';

export interface LevelSelectionViewDTO {
  readonly state: ScreenLoadState;
  readonly gameId: GameId;
  readonly title: I18nKeyDTO;
  readonly showsStars: boolean;
  readonly completedCount: number | null;
  readonly totalCount: number | null;
  readonly levels: readonly LevelSelectionItemDTO[];
  readonly isOffline: boolean;
  readonly availableActions: readonly LevelSelectionAction[];
}
