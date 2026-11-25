import type { IHomeSessionReader, ILocaleCatalog } from '../../application/ports';
import type { ISettingsOutputPort } from '../../application/ports/output';
import type { LocaleOptionDTO, SettingsViewDTO } from '../../application/value-objects';
import { InMemoryHomeSessionReader } from './InMemoryHomeSessionReader';
import type { SettingsSnapshot } from './SettingsStateHolder';

export interface ISettingsPresenter {
  present(snapshot: SettingsSnapshot): void;
}

export interface SettingsPresenterOptions {
  readonly appVersion?: string | null;
  readonly isAccountSectionEnabled?: boolean;
}

export class SettingsPresenter implements ISettingsPresenter {
  private readonly appVersion: string | null;
  private readonly isAccountSectionEnabled: boolean;

  public constructor(
    private readonly output: ISettingsOutputPort,
    private readonly localeCatalog: ILocaleCatalog,
    private readonly sessionReader: IHomeSessionReader = new InMemoryHomeSessionReader(),
    options: SettingsPresenterOptions = {},
  ) {
    this.appVersion = options.appVersion ?? null;
    this.isAccountSectionEnabled = options.isAccountSectionEnabled ?? true;
  }

  public present(snapshot: SettingsSnapshot): void {
    const locales: readonly LocaleOptionDTO[] = this.localeCatalog
      .findAll()
      .map((descriptor) => ({
        code: descriptor.code,
        nativeName: descriptor.nativeName,
        isSelected: descriptor.code === snapshot.activeLocale,
      }));
    const sessionSnapshot = this.sessionReader.getSnapshot();

    const view: SettingsViewDTO = {
      origin: snapshot.origin,
      title: { key: 'settings.title' },
      backLabel: { key: 'common.back' },
      musicEnabled: snapshot.musicEnabled,
      sfxEnabled: snapshot.sfxEnabled,
      isDarkMode: snapshot.isDarkMode,
      locales,
      activeLocale: snapshot.activeLocale,
      session: {
        isEnabled: this.isAccountSectionEnabled,
        isAuthenticated: sessionSnapshot.isAuthenticated,
        displayName: sessionSnapshot.displayName,
        secondaryText: null,
      },
      isLogoutConfirmOpen: snapshot.isLogoutConfirmOpen,
      errorMessage: snapshot.errorKey ? { key: snapshot.errorKey } : null,
      versionLabel: this.appVersion
        ? { key: 'settings.version_badge', parameters: { version: this.appVersion } }
        : null,
      showBottomMenu: snapshot.origin === 'HOME',
    };

    this.output.presentSettings(view);
  }
}
