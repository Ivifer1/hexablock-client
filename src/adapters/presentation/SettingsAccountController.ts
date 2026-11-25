import type {
  ISessionActionsPort,
  ISettingsAccountController,
  ISettingsNavigationPort,
} from '../../application/ports';
import type { ISettingsPresenter } from './SettingsPresenter';
import type { SettingsStateHolder } from './SettingsStateHolder';

export class SettingsAccountController implements ISettingsAccountController {
  public constructor(
    private readonly state: SettingsStateHolder,
    private readonly sessionActions: ISessionActionsPort,
    private readonly navigator: ISettingsNavigationPort,
    private readonly presenter: ISettingsPresenter,
  ) {}

  public openLogin(): void {
    this.state.update({ isLogoutConfirmOpen: false });
    this.presenter.present(this.state.getSnapshot());
    this.navigator.openLogin();
  }

  public requestLogout(): void {
    this.state.update({ isLogoutConfirmOpen: true, errorKey: null });
    this.presenter.present(this.state.getSnapshot());
  }

  public confirmLogout(): void {
    this.sessionActions.signOut();
    this.state.update({ isLogoutConfirmOpen: false, errorKey: null });
    this.presenter.present(this.state.getSnapshot());
  }

  public cancelLogout(): void {
    this.state.update({ isLogoutConfirmOpen: false });
    this.presenter.present(this.state.getSnapshot());
  }
}
