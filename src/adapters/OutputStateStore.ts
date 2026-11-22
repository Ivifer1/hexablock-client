import type {
  IDefeatOutputPort,
  IGameControlsOutputPort,
  IGameHudOutputPort,
  IHomeOutputPort,
  ILevelSelectionOutputPort,
  IVictoryOutputPort,
} from '../application/ports/output';
import type {
  DefeatViewDTO,
  GameControlsDTO,
  GameHudDTO,
  HomeViewDTO,
  LevelSelectionViewDTO,
  VictoryViewDTO,
} from '../application/value-objects';

export class OutputStateStore
  implements
    IDefeatOutputPort,
    IGameControlsOutputPort,
    IGameHudOutputPort,
    IHomeOutputPort,
    ILevelSelectionOutputPort,
    IVictoryOutputPort
{
  public hud: GameHudDTO | undefined;
  public controls: GameControlsDTO | undefined;
  public levelSelection: LevelSelectionViewDTO | undefined;
  public victory: VictoryViewDTO | undefined;
  public defeat: DefeatViewDTO | undefined;
  public home: HomeViewDTO | undefined;
  private readonly homeListeners: Set<(view: HomeViewDTO) => void> = new Set();

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

  public presentHome(view: HomeViewDTO): void {
    this.home = view;
    // Notifica a la UI cada vez que el Presenter emite un nuevo ViewModel
    this.homeListeners.forEach((listener) => listener(view));
  }

  public subscribeHome(listener: (view: HomeViewDTO) => void): () => void {
    this.homeListeners.add(listener);
    // Devuelve la función de limpieza (unsubscribe) para el useEffect
    return () => {
      this.homeListeners.delete(listener);
    };
  }
}
