import type { ISettingsOutputPort } from '../../application/ports/output';
import type { SettingsViewDTO } from '../../application/value-objects';
import { ObservableViewStore } from './ObservableViewStore';

export class SettingsOutputStore implements ISettingsOutputPort {
  private readonly store = new ObservableViewStore<SettingsViewDTO>();

  public get current(): SettingsViewDTO | undefined {
    return this.store.current;
  }

  public presentSettings(view: SettingsViewDTO): void {
    this.store.publish(view);
  }

  public subscribe(listener: (view: SettingsViewDTO) => void): () => void {
    return this.store.subscribe(listener);
  }
}
