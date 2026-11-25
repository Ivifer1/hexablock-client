import type { HomeSessionSnapshot, IHomeSessionReader } from '../../application/ports';

const GUEST_SESSION: HomeSessionSnapshot = {
  isAuthenticated: false,
  displayName: null,
};

/**
 * In-memory session reader for Inicio until an auth adapter is connected.
 */
export class InMemoryHomeSessionReader implements IHomeSessionReader {
  private snapshot: HomeSessionSnapshot;

  public constructor(initialSnapshot: HomeSessionSnapshot = GUEST_SESSION) {
    this.snapshot = { ...initialSnapshot };
  }

  public getSnapshot(): HomeSessionSnapshot {
    return this.snapshot;
  }

  public setSnapshot(nextSnapshot: HomeSessionSnapshot): void {
    this.snapshot = { ...nextSnapshot };
  }
}
