import type { IVictoryOutputPort } from '../../application/ports/output';
import type { VictoryViewDTO } from '../../application/value-objects';
import { ObservableViewStore } from './ObservableViewStore';

export class VictoryOutputStore implements IVictoryOutputPort {
  private readonly store = new ObservableViewStore<VictoryViewDTO>();

  public get current(): VictoryViewDTO | undefined {
    return this.store.current;
  }

  public presentVictory(view: VictoryViewDTO): void {
    this.store.publish(view);
  }

  public subscribe(listener: (view: VictoryViewDTO) => void): () => void {
    return this.store.subscribe(listener);
  }
}
