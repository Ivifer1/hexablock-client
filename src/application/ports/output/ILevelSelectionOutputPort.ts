import type { LevelSelectionViewDTO } from '../../value-objects/level-selection.dto';

export interface ILevelSelectionOutputPort {
  presentLevelSelection(view: LevelSelectionViewDTO): void;
}
