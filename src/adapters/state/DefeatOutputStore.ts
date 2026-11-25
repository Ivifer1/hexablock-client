import type { IDefeatOutputPort } from '../../application/ports/output';
import type { DefeatViewDTO } from '../../application/value-objects';
import { ObservableViewStore } from './ObservableViewStore';

export class DefeatOutputStore implements IDefeatOutputPort {
  private readonly store = new ObservableViewStore<DefeatViewDTO>();

  public get current(): DefeatViewDTO | undefined {
    return this.store.current;
  }

  public presentDefeat(view: DefeatViewDTO): void {
    this.store.publish(view);
  }

  public subscribe(listener: (view: DefeatViewDTO) => void): () => void {
    return this.store.subscribe(listener);
  }
}
