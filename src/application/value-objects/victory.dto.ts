import type { GameId } from './game-hud.dto';
import type { I18nKeyDTO } from './i18n-key.dto';

export type VictoryResultSummary =
  | {
      readonly kind: 'LEVEL_STARS';
      readonly stars: number;
      readonly moves: number;
      readonly elapsedSeconds: number;
    }
  | {
      readonly kind: 'OBJECTIVES';
      readonly goalsCompleted: number;
      readonly goalsTotal: number;
      readonly score: number;
    }
  | {
      readonly kind: 'TARGET_VALUE';
      readonly targetTileValue: number;
      readonly score: number;
    }
  | {
      readonly kind: 'SCORE_ONLY';
      readonly score: number;
    }
  | {
      readonly kind: 'CUSTOM';
      readonly metrics: readonly VictoryMetricDTO[];
    };

export interface VictoryMetricDTO {
  readonly key: string;
  readonly label: I18nKeyDTO;
  readonly value: number;
}

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
  readonly result: VictoryResultSummary;
  readonly isNewBest: boolean;
  readonly hasNextLevel: boolean;
  readonly canKeepPlaying: boolean;
  readonly availableActions: readonly VictoryAction[];
}
