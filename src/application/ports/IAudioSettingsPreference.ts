import type { PreferenceSaveResult } from './PreferenceSaveResult';

export interface AudioSettingsSnapshot {
  readonly musicEnabled: boolean;
  readonly sfxEnabled: boolean;
}

export interface IAudioSettingsPreference {
  load(): AudioSettingsSnapshot;
  save(settings: AudioSettingsSnapshot): PreferenceSaveResult;
}
