import type { LocaleCode, SettingsEntryOrigin } from '../../application/value-objects';

export interface SettingsSnapshot {
  readonly origin: SettingsEntryOrigin;
  readonly musicEnabled: boolean;
  readonly sfxEnabled: boolean;
  readonly isDarkMode: boolean;
  readonly activeLocale: LocaleCode;
  readonly isLogoutConfirmOpen: boolean;
  readonly errorKey: string | null;
}

export class SettingsStateHolder {
  private snapshot: SettingsSnapshot;

  public constructor(initial: SettingsSnapshot) {
    this.snapshot = { ...initial };
  }

  public getSnapshot(): SettingsSnapshot {
    return this.snapshot;
  }

  public update(patch: Partial<SettingsSnapshot>): SettingsSnapshot {
    this.snapshot = {
      ...this.snapshot,
      ...patch,
    };
    return this.snapshot;
  }
}
