import type { ILevelSelectionOutputPort } from '../../application/ports/output';
import type { LevelSelectionViewDTO } from '../../application/value-objects';
import { ObservableViewStore } from './ObservableViewStore';

export class LevelSelectionOutputStore implements ILevelSelectionOutputPort {
  private readonly store = new ObservableViewStore<LevelSelectionViewDTO>();

  public get current(): LevelSelectionViewDTO | undefined {
    return this.store.current;
  }

  public presentLevelSelection(view: LevelSelectionViewDTO): void {
    this.store.publish(view);
  }

  public subscribe(listener: (view: LevelSelectionViewDTO) => void): () => void {
    return this.store.subscribe(listener);
  }
}
