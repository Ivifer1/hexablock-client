import type { I18nKeyDTO } from './i18n-key.dto';
import type { GameEntryKind } from '../modes/game-mode-descriptor';
import type { GameId } from './game-hud.dto';
import type { ScreenLoadState } from './screen-load-state';

export type HomeProgressDTO =
  | { readonly kind: 'LOADING' }
  | { readonly kind: 'NONE' }
  | { readonly kind: 'BEST'; readonly value: number }
  | { readonly kind: 'LEVELS'; readonly completed: number; readonly total: number }
  | { readonly kind: 'ERROR'; readonly message: I18nKeyDTO };

export interface HomeModeDTO {
  readonly id: GameId;
  readonly name: I18nKeyDTO;
  readonly description: I18nKeyDTO;
  readonly entryKind: GameEntryKind;
  readonly entryKindLabel: I18nKeyDTO;
  readonly progress: HomeProgressDTO;
  readonly previewKey: string;
  readonly iconKey: string;
  readonly accentColor: string;
  readonly isSelected: boolean;
}

export interface HomeViewDTO {
  readonly state: ScreenLoadState;
  readonly title: I18nKeyDTO;
  readonly settingsLabel: I18nKeyDTO;
  readonly heroTitle: I18nKeyDTO;
  readonly heroSubtitle: I18nKeyDTO;
  readonly modes: readonly HomeModeDTO[];
  readonly selectedModeId: GameId | null;
  readonly errorMessage: I18nKeyDTO | null;
  readonly sessionLabel: I18nKeyDTO;
  readonly hasSession: boolean;
  readonly isPointsAvailable: boolean;
}
