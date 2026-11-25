import type { IGameHudOutputPort } from '../../application/ports/output';
import type { GameHudDTO } from '../../application/value-objects';
import { ObservableViewStore } from './ObservableViewStore';

export class GameHudOutputStore implements IGameHudOutputPort {
  private readonly store = new ObservableViewStore<GameHudDTO>();

  public get current(): GameHudDTO | undefined {
    return this.store.current;
  }

  public presentHud(view: GameHudDTO): void {
    this.store.publish(view);
  }

  public subscribe(listener: (view: GameHudDTO) => void): () => void {
    return this.store.subscribe(listener);
  }
}
