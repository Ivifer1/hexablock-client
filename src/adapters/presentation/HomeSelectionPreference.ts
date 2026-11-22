import type { GameId } from '../../application/value-objects';

export class HomeSelectionPreference {
  private selectedModeId: GameId | null = null;

  public load(): GameId | null {
    return this.selectedModeId;
  }

  public save(modeId: GameId): void {
    this.selectedModeId = modeId;
  }
}
