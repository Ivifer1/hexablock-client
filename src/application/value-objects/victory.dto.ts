import type { GameId } from './game-hud.dto';
import type { I18nKeyDTO } from './i18n-key.dto';

export type VictoryResultVariant =
  | {
      readonly kind: 'FIT';
      readonly stars: number;
      readonly moves: number;
      readonly elapsedSeconds: number;
    }
  | {
      readonly kind: 'SORT';
      readonly goalsCompleted: number;
      readonly goalsTotal: number;
      readonly score: number;
    }
  | {
      readonly kind: 'MERGE';
      readonly targetTileValue: number;
      readonly score: number;
    }
  | {
      readonly kind: 'OTHER';
      readonly score: number;
    };

export type VictoryAction =
  | 'NEXT_LEVEL'
  | 'REPLAY_LEVEL'
  | 'NEW_GAME'
  | 'KEEP_PLAYING'
  | 'GO_TO_LEVELS'
  | 'GO_HOME';

export interface VictoryViewDTO {
  readonly gameId: GameId;
  readonly title: I18nKeyDTO;
  readonly score: number;
  readonly result: VictoryResultVariant;
  readonly isNewBest: boolean;
  readonly hasNextLevel: boolean;
  readonly canKeepPlaying: boolean;
  readonly availableActions: readonly VictoryAction[];
}
