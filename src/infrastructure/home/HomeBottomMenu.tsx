import type { ITextCatalog, SupportedLocale } from '../../application/ports';
import type { Theme } from '../theme';
import { BottomNavBar, type BottomNavItem } from '../ui';
import {
  PlayMenuIcon,
  PointsMenuIcon,
  SettingsMenuIcon,
} from '../ui-icons/MenuIcons';

export type HomeMenuItemKey = 'POINTS' | 'PLAY' | 'SETTINGS';

export interface HomeBottomMenuProps {
  readonly selectedMenu: HomeMenuItemKey;
  readonly isPointsAvailable?: boolean;
  readonly menuHeight: number;
  readonly bottomSafeInset: number;
  readonly menuIconSize: number;
  readonly theme: Theme;
  readonly textCatalog: ITextCatalog;
  readonly locale: SupportedLocale;
  readonly items?: readonly BottomNavItem<HomeMenuItemKey>[];
  readonly onPressPoints: () => void;
  readonly onPressPlay: () => void;
  readonly onPressSettings: () => void;
}

export function HomeBottomMenu({
  selectedMenu,
  isPointsAvailable = true,
  menuHeight,
  bottomSafeInset,
  menuIconSize,
  theme,
  textCatalog,
  locale,
  items,
  onPressPoints,
  onPressPlay,
  onPressSettings,
}: HomeBottomMenuProps) {
  const defaultItems: readonly BottomNavItem<HomeMenuItemKey>[] = [
    {
      key: 'POINTS',
      label: textCatalog.resolve('home.points', locale),
      disabled: !isPointsAvailable,
      onPress: onPressPoints,
      renderIcon: ({ color, cutoutColor, iconSize, selected }) => (
        <PointsMenuIcon
          color={color}
          cutoutColor={cutoutColor}
          size={iconSize}
          filled={selected}
        />
      ),
    },
    {
      key: 'PLAY',
      label: textCatalog.resolve('home.play', locale),
      onPress: onPressPlay,
      renderIcon: ({ color, activeSlotSize, selected }) => (
        <PlayMenuIcon
          color={color}
          cutoutColor={theme.primaryFg}
          size={activeSlotSize}
          filled={selected}
        />
      ),
    },
    {
      key: 'SETTINGS',
      label: textCatalog.resolve('home.settings', locale),
      onPress: onPressSettings,
      renderIcon: ({ color, cutoutColor, iconSize, selected }) => (
        <SettingsMenuIcon
          color={color}
          cutoutColor={cutoutColor}
          size={iconSize}
          filled={selected}
        />
      ),
    },
  ];

  return (
    <BottomNavBar
      items={items ?? defaultItems}
      selectedKey={selectedMenu}
      height={menuHeight}
      bottomSafeInset={bottomSafeInset}
      iconSize={menuIconSize}
      theme={theme}
    />
  );
}
