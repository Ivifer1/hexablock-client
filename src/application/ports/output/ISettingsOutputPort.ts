import type { SettingsViewDTO } from '../../value-objects/settings.dto';

export interface ISettingsOutputPort {
  presentSettings(view: SettingsViewDTO): void;
}
