import { Text } from 'react-native';
import type { IAssetResolver } from '../../application/ports';
import type { HomeModeDTO } from '../../application/value-objects';
import type { ModeIconComponent } from '../mode-icons';

export { withAlpha } from '../theme';

export type ExtendedHomeModeDTO = HomeModeDTO;

export function renderModeIcon(
  mode: ExtendedHomeModeDTO,
  color: string,
  size: number,
  isSelected: boolean,
  modeIconResolver: IAssetResolver<ModeIconComponent> | undefined,
) {
  const Icon = modeIconResolver?.resolve(mode.iconKey);
  if (Icon) {
    return <Icon color={color} size={size} isSelected={isSelected} />;
  }

  const initial = (mode.id ?? 'G').slice(0, 1).toUpperCase();
  return (
    <Text style={{ color, fontSize: Math.max(12, size * 0.42), fontWeight: '800' }}>
      {initial}
    </Text>
  );
}
