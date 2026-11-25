import type { ISessionActionsPort } from '../../application/ports';
import type { InMemoryHomeSessionReader } from './InMemoryHomeSessionReader';

export class InMemorySessionActions implements ISessionActionsPort {
  public constructor(
    private readonly sessionReader?: InMemoryHomeSessionReader,
    private readonly onSignOut?: () => void,
  ) {}

  public signOut(): void {
    this.sessionReader?.setSnapshot({
      isAuthenticated: false,
      displayName: null,
    });
    this.onSignOut?.();
  }
}
