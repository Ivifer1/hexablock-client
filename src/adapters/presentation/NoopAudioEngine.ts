import type { IAudioEnginePort } from '../../application/ports';

export class NoopAudioEngine implements IAudioEnginePort {
  public musicEnabled = true;
  public sfxEnabled = true;
  public confirmationCount = 0;

  public setMusicEnabled(enabled: boolean): void {
    this.musicEnabled = enabled;
  }

  public setSfxEnabled(enabled: boolean): void {
    this.sfxEnabled = enabled;
  }

  public playConfirmationSfx(): void {
    if (!this.sfxEnabled) return;
    this.confirmationCount += 1;
  }
}
