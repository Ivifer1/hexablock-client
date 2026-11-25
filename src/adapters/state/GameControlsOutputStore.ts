import type { IGameControlsOutputPort } from '../../application/ports/output';
import type { GameControlsDTO } from '../../application/value-objects';
import { ObservableViewStore } from './ObservableViewStore';

export class GameControlsOutputStore implements IGameControlsOutputPort {
  private readonly store = new ObservableViewStore<GameControlsDTO>();

  public get current(): GameControlsDTO | undefined {
    return this.store.current;
  }

  public presentControls(view: GameControlsDTO): void {
    this.store.publish(view);
  }

  public subscribe(listener: (view: GameControlsDTO) => void): () => void {
    return this.store.subscribe(listener);
  }
}
