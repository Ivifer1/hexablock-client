import type { IHomeOutputPort } from '../../application/ports/output';
import type { HomeViewDTO } from '../../application/value-objects';
import { ObservableViewStore } from './ObservableViewStore';

export class HomeOutputStore implements IHomeOutputPort {
  private readonly store = new ObservableViewStore<HomeViewDTO>();

  public get current(): HomeViewDTO | undefined {
    return this.store.current;
  }

  public presentHome(view: HomeViewDTO): void {
    this.store.publish(view);
  }

  public subscribe(listener: (view: HomeViewDTO) => void): () => void {
    return this.store.subscribe(listener);
  }
}
