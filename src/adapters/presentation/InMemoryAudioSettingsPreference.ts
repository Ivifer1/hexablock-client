import type {
  AudioSettingsSnapshot,
  IAudioSettingsPreference,
  PreferenceSaveResult,
} from '../../application/ports';

const DEFAULT_AUDIO_SETTINGS: AudioSettingsSnapshot = {
  musicEnabled: true,
  sfxEnabled: true,
};

export class InMemoryAudioSettingsPreference implements IAudioSettingsPreference {
  private snapshot: AudioSettingsSnapshot;

  public constructor(initial: AudioSettingsSnapshot = DEFAULT_AUDIO_SETTINGS) {
    this.snapshot = { ...initial };
  }

  public load(): AudioSettingsSnapshot {
    return { ...this.snapshot };
  }

  public save(settings: AudioSettingsSnapshot): PreferenceSaveResult {
    this.snapshot = { ...settings };
    return { ok: true };
  }
}
