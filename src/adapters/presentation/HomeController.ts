import type {
  HomeDestination,
  IGameModeCatalog,
  IHomeController,
  IHomeNavigationPort,
  IHomeSelectionPreference,
} from '../../application/ports';
import type { GameEntryKind } from '../../application/modes';
import type { GameId } from '../../application/value-objects';
import type { IHomePresenter } from './HomePresenter';

export type { HomeDestination };

const ENTRY_DESTINATION_MAP: Readonly<Record<GameEntryKind, HomeDestination>> = {
  DIRECT: 'DIRECT',
  LEVELS: 'LEVELS',
};

export class HomeController implements IHomeController {
  public constructor(
    private readonly catalog: IGameModeCatalog,
    private readonly navigator: IHomeNavigationPort,
    private readonly preference?: IHomeSelectionPreference,
    private readonly presenter?: IHomePresenter,
  ) {}

  public selectMode(modeId: GameId): void {
    const descriptor = this.catalog.findById(modeId);
    if (!descriptor) return;
    this.preference?.save(modeId);
    this.presenter?.present({
      selectedModeId: modeId,
      state: 'NORMAL',
    });
  }

  public play(modeId: GameId): void {
    const descriptor = this.catalog.findById(modeId);
    if (!descriptor) return;
    const destination = ENTRY_DESTINATION_MAP[descriptor.entryKind];
    if (destination) {
      this.navigator.navigate(destination);
    }
  }

  public openSettings(): void {
    this.navigator.navigate('SETTINGS');
  }

  public openPoints(hasSession: boolean): void {
    this.navigator.navigate(hasSession ? 'RANKING' : 'LOGIN');
  }
}
