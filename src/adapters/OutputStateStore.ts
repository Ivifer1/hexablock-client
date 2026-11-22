import type {
  IDefeatOutputPort,
  IGameControlsOutputPort,
  IGameHudOutputPort,
  ILevelSelectionOutputPort,
  IVictoryOutputPort,
} from '../application/ports/output';
import type {
  DefeatViewDTO,
  GameControlsDTO,
  GameHudDTO,
  LevelSelectionViewDTO,
  VictoryViewDTO,
} from '../application/value-objects';

export class OutputStateStore
  implements
    IDefeatOutputPort,
    IGameControlsOutputPort,
    IGameHudOutputPort,
    ILevelSelectionOutputPort,
    IVictoryOutputPort
{
  public hud: GameHudDTO | undefined;
  public controls: GameControlsDTO | undefined;
  public levelSelection: LevelSelectionViewDTO | undefined;
  public victory: VictoryViewDTO | undefined;
  public defeat: DefeatViewDTO | undefined;

  public presentHud(view: GameHudDTO): void {
    this.hud = view;
  }

  public presentControls(view: GameControlsDTO): void {
    this.controls = view;
  }

  public presentLevelSelection(view: LevelSelectionViewDTO): void {
    this.levelSelection = view;
  }

  public presentVictory(view: VictoryViewDTO): void {
    this.victory = view;
  }

  public presentDefeat(view: DefeatViewDTO): void {
    this.defeat = view;
  }
}
