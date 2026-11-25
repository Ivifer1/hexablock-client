import type { IHomeSelectionPreference } from '../../application/ports';
import type { GameId } from '../../application/value-objects';

export class HomeSelectionPreference implements IHomeSelectionPreference {
  private selectedModeId: GameId | null = null;

  public load(): GameId | null {
    return this.selectedModeId;
  }

  public save(modeId: GameId): void {
    this.selectedModeId = modeId;
  }
}
