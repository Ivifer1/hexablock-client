export interface ISettingsAccountController {
  openLogin(): void;
  requestLogout(): void;
  confirmLogout(): void;
  cancelLogout(): void;
}
