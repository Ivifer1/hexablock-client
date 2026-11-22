import type { IHomeOutputPort } from '../../application/ports/output';
import type { IGameModeRegistry } from '../../application/ports';
import type { HomeModeDTO, HomeViewDTO, HomeProgressDTO } from '../../application/value-objects';

export interface HomePresentationInput {
  readonly selectedModeId: string | null;
  readonly state: 'LOADING' | 'NORMAL' | 'EMPTY' | 'ERROR';
}

export class HomePresenter {
  public constructor(
    private readonly output: IHomeOutputPort,
    private readonly registry: IGameModeRegistry,
  ) {}

  public present(input: HomePresentationInput): void {
    const descriptors = this.registry.findAll();
    if (descriptors.length === 0) {
      this.output.presentHome(this.emptyView());
      return;
    }

    const defaultId = descriptors.find((descriptor) => descriptor.id === 'lines')?.id
      ?? descriptors[0].id;
    const selectedModeId = input.selectedModeId
      && descriptors.some((descriptor) => descriptor.id === input.selectedModeId)
      ? input.selectedModeId
      : defaultId;

    const modes: readonly HomeModeDTO[] = descriptors.map((descriptor) => ({
      id: descriptor.id,
      name: { key: descriptor.nameKey },
      description: { key: descriptor.descriptionKey },
      entryKind: descriptor.entryKind,
      progress: this.progressFor(descriptor.progressDescriptor, input.state),
      previewKey: descriptor.previewKey,
      iconKey: descriptor.iconKey,
      accentColor: descriptor.accentColor,
      isSelected: descriptor.id === selectedModeId,
    }));

    this.output.presentHome({
      state: input.state,
      title: { key: 'app.title' },
      settingsLabel: { key: 'home.settings' },
      heroTitle: { key: 'home.hero_title' },
      heroSubtitle: { key: 'home.hero_subtitle' },
      modes,
      selectedModeId,
      errorMessage: input.state === 'ERROR'
        ? { key: 'home.error_progress' }
        : null,
      sessionLabel: { key: 'common.sign_in' },
      hasSession: false,
    });
  }

  private progressFor(progressDescriptor: string, state: HomePresentationInput['state']): HomeProgressDTO {
    if (state === 'LOADING') return { kind: 'LOADING' };
    if (state === 'ERROR') return { kind: 'ERROR', message: { key: 'home.error_progress' } };
    if (progressDescriptor === 'levels') return { kind: 'LEVELS', completed: 0, total: 15 };
    if (progressDescriptor === 'none') return { kind: 'NONE' };
    return { kind: 'LOADING' };
  }

  private emptyView(): HomeViewDTO {
    return {
      state: 'EMPTY',
      title: { key: 'app.title' },
      settingsLabel: { key: 'home.settings' },
      heroTitle: { key: 'home.hero_title' },
      heroSubtitle: { key: 'home.hero_subtitle' },
      modes: [],
      selectedModeId: null,
      errorMessage: null,
      sessionLabel: { key: 'common.sign_in' },
      hasSession: false,
    };
  }
}
