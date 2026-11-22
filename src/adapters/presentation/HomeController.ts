import type { IGameModeRegistry } from '../../application/ports';
import type { GameEntryKind } from '../../application/modes';
import type { GameId } from '../../application/value-objects';

export type HomeDestination =
  | 'DIRECT'
  | 'LEVELS'
  | 'SETTINGS'
  | 'LOGIN'
  | 'RANKING';

export class HomeController {
  public constructor(
    private readonly registry: IGameModeRegistry,
    private readonly onDestination: (destination: HomeDestination) => void,
  ) {}

  public play(modeId: GameId): void {
    const descriptor = this.registry.findById(modeId);
    if (!descriptor) return;
    this.navigate(descriptor.entryKind);
  }

  public openSettings(): void {
    this.onDestination('SETTINGS');
  }

  public openPoints(hasSession: boolean): void {
    this.onDestination(hasSession ? 'RANKING' : 'LOGIN');
  }

  private navigate(entryKind: GameEntryKind): void {
    if (entryKind === 'DIRECT') {
      this.onDestination('DIRECT');
      return;
    }
    if (entryKind === 'LEVELS') {
      this.onDestination('LEVELS');
    }
  }
}
