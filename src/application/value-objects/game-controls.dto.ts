import type { I18nKeyDTO } from './i18n-key.dto';

export type GameControlAction =
  | 'PAUSE'
  | 'UNDO'
  | 'REDO'
  | 'ROTATE'
  | 'CHOOSE_DIRECTION';

export interface GameControlDTO {
  readonly action: GameControlAction;
  readonly enabled: boolean;
  readonly directionIndex: number | null;
  readonly label: I18nKeyDTO;
}

export interface GameControlsDTO {
  readonly controls: readonly GameControlDTO[];
}
