export interface IAudioEnginePort {
  setMusicEnabled(enabled: boolean): void;
  setSfxEnabled(enabled: boolean): void;
  playConfirmationSfx(): void;
}
