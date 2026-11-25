import type { GameEntryKind, GameModeDescriptor } from '../../application/modes';
import type {
  IGameModeCatalog,
  IHomeProgressProvider,
  IHomeSessionReader,
} from '../../application/ports';
import type { IHomeOutputPort } from '../../application/ports/output';
import type {
  HomeModeDTO,
  HomeProgressDTO,
  HomeViewDTO,
  I18nKeyDTO,
  ScreenLoadState,
} from '../../application/value-objects';
import { DefaultHomeProgressProvider } from './DefaultHomeProgressProvider';
import { InMemoryHomeSessionReader } from './InMemoryHomeSessionReader';

export interface HomePresentationInput {
  readonly selectedModeId: string | null;
  readonly state: ScreenLoadState;
  readonly isPointsAvailable?: boolean;
}

export interface IHomePresenter {
  present(input: HomePresentationInput): void;
}

const ENTRY_KIND_LABEL_KEYS: Readonly<Record<GameEntryKind, string>> = {
  DIRECT: 'home.entry_direct',
  LEVELS: 'home.entry_levels',
};

export class HomePresenter implements IHomePresenter {
  public constructor(
    private readonly output: IHomeOutputPort,
    private readonly catalog: IGameModeCatalog,
    private readonly progressProvider: IHomeProgressProvider = new DefaultHomeProgressProvider(),
    private readonly sessionReader: IHomeSessionReader = new InMemoryHomeSessionReader(),
  ) {}

  public present(input: HomePresentationInput): void {
    const descriptors = this.catalog.findAll();
    const isPointsAvailable = input.isPointsAvailable ?? true;
    if (descriptors.length === 0) {
      this.output.presentHome(this.emptyView(isPointsAvailable));
      return;
    }

    const selectedModeId = this.resolveSelectedModeId(descriptors, input.selectedModeId);
    const modes = descriptors.map((descriptor) =>
      this.toModeDTO(descriptor, selectedModeId, input.state),
    );
    const session = this.resolveSession();

    this.output.presentHome({
      state: input.state,
      title: { key: 'app.title' },
      settingsLabel: { key: 'home.settings' },
      heroTitle: { key: 'home.hero_title' },
      heroSubtitle: { key: 'home.hero_subtitle' },
      modes,
      selectedModeId,
      errorMessage: input.state === 'ERROR' ? { key: 'home.error_progress' } : null,
      sessionLabel: session.label,
      hasSession: session.hasSession,
      isPointsAvailable,
    });
  }

  private resolveSelectedModeId(
    descriptors: readonly GameModeDescriptor[],
    candidateId: string | null,
  ): string {
    if (candidateId && descriptors.some((descriptor) => descriptor.id === candidateId)) {
      return candidateId;
    }
    return descriptors[0].id;
  }

  private toModeDTO(
    descriptor: GameModeDescriptor,
    selectedModeId: string,
    state: ScreenLoadState,
  ): HomeModeDTO {
    return {
      id: descriptor.id,
      name: { key: descriptor.nameKey },
      description: { key: descriptor.descriptionKey },
      entryKind: descriptor.entryKind,
      entryKindLabel: { key: ENTRY_KIND_LABEL_KEYS[descriptor.entryKind] ?? 'home.entry_direct' },
      progress: this.progressFor(descriptor, state),
      previewKey: descriptor.previewKey,
      iconKey: descriptor.iconKey,
      accentColor: descriptor.accentColor,
      isSelected: descriptor.id === selectedModeId,
    };
  }

  private progressFor(
    descriptor: GameModeDescriptor,
    state: ScreenLoadState,
  ): HomeProgressDTO {
    if (state === 'LOADING') return { kind: 'LOADING' };
    if (state === 'ERROR') return { kind: 'ERROR', message: { key: 'home.error_progress' } };
    return this.progressProvider.getProgress(descriptor);
  }

  private resolveSession(): { readonly hasSession: boolean; readonly label: I18nKeyDTO } {
    const snapshot = this.sessionReader.getSnapshot();
    if (snapshot.isAuthenticated && snapshot.displayName) {
      return {
        hasSession: true,
        label: { key: 'home.session_user', parameters: { name: snapshot.displayName } },
      };
    }
    return {
      hasSession: false,
      label: { key: 'common.sign_in' },
    };
  }

  private emptyView(isPointsAvailable: boolean): HomeViewDTO {
    const session = this.resolveSession();
    return {
      state: 'EMPTY',
      title: { key: 'app.title' },
      settingsLabel: { key: 'home.settings' },
      heroTitle: { key: 'home.hero_title' },
      heroSubtitle: { key: 'home.hero_subtitle' },
      modes: [],
      selectedModeId: null,
      errorMessage: null,
      sessionLabel: session.label,
      hasSession: session.hasSession,
      isPointsAvailable,
    };
  }
}
