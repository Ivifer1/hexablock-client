import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { ITextCatalog, SupportedLocale } from '../../application/ports';
import { BORDER_WIDTH, RADIUS, SPACING, TYPOGRAPHY, type Theme } from '../theme';
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
  onPressPoints,
  onPressPlay,
  onPressSettings,
}: HomeBottomMenuProps) {
  const styles = useMemo(() => createStyles(theme), [theme]);
  const menuIconSlotHeight = Math.round(menuIconSize * 1.35);

  const items: readonly {
    readonly key: HomeMenuItemKey;
    readonly label: string;
    readonly onPress: () => void;
    readonly renderIcon: (selected: boolean) => React.ReactNode;
  }[] = [
    {
      key: 'POINTS',
      label: textCatalog.resolve('home.points', locale),
      onPress: onPressPoints,
      renderIcon: (selected) => (
        <PointsMenuIcon
          color={selected ? theme.primary : theme.textSecondary}
          cutoutColor={theme.surface}
          size={menuIconSize}
          filled={selected}
        />
      ),
    },
    {
      key: 'PLAY',
      label: textCatalog.resolve('home.play', locale),
      onPress: onPressPlay,
      renderIcon: (selected) => (
        <PlayMenuIcon
          color={selected ? theme.primary : theme.textSecondary}
          cutoutColor={theme.primaryFg}
          size={menuIconSlotHeight}
          filled={selected}
        />
      ),
    },
    {
      key: 'SETTINGS',
      label: textCatalog.resolve('home.settings', locale),
      onPress: onPressSettings,
      renderIcon: (selected) => (
        <SettingsMenuIcon
          color={selected ? theme.primary : theme.textSecondary}
          cutoutColor={theme.surface}
          size={menuIconSize}
          filled={selected}
        />
      ),
    },
  ];

  return (
    <View
      style={[
        styles.bottomMenu,
        {
          height: menuHeight + bottomSafeInset,
          paddingTop: SPACING.s2,
          paddingBottom: bottomSafeInset,
        },
      ]}
    >
      <View style={styles.bottomMenuInner}>
        {items.map((item) => {
          const isDisabled = item.key === 'POINTS' && !isPointsAvailable;
          const isSelected = !isDisabled && selectedMenu === item.key;
          return (
            <Pressable
              key={item.key}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected, disabled: isDisabled }}
              accessibilityLabel={item.label}
              onPress={item.onPress}
              style={({ pressed }) => [
                styles.bottomMenuItem,
                isDisabled && styles.disabledMenuItem,
                pressed && !isDisabled && styles.pressedMenuItem,
              ]}
            >
              <View
                style={[
                  styles.bottomMenuIcon,
                  { width: menuIconSlotHeight, height: menuIconSlotHeight },
                ]}
              >
                {item.renderIcon(isSelected)}
              </View>
              <Text
                style={[
                  styles.bottomMenuLabel,
                  isSelected && styles.bottomMenuLabelSelected,
                ]}
              >
                {item.label}
              </Text>
              <View style={styles.menuActiveDotSlot}>
                {isSelected ? <View style={styles.menuActiveDot} /> : null}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    bottomMenu: {
      width: '100%',
      borderTopWidth: BORDER_WIDTH.thin,
      borderTopColor: theme.borderDefault,
      backgroundColor: theme.surface,
      alignItems: 'center',
      ...theme.shadowLow,
    },
    bottomMenuInner: {
      width: '100%',
      maxWidth: 480,
      alignSelf: 'center',
      height: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    bottomMenuItem: {
      flex: 1,
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 3,
      minHeight: SPACING.touchTargetMin,
    },
    pressedMenuItem: { opacity: 0.72 },
    disabledMenuItem: { opacity: 0.45 },
    bottomMenuIcon: { alignItems: 'center', justifyContent: 'center' },
    bottomMenuLabel: {
      fontSize: TYPOGRAPHY.caption.fontSize,
      lineHeight: TYPOGRAPHY.caption.lineHeight,
      fontWeight: TYPOGRAPHY.caption.fontWeight,
      color: theme.textSecondary,
    },
    bottomMenuLabelSelected: {
      color: theme.primary,
      fontWeight: '700',
    },
    menuActiveDotSlot: {
      height: 6,
      alignItems: 'center',
      justifyContent: 'center',
    },
    menuActiveDot: {
      width: 4,
      height: 4,
      borderRadius: RADIUS.full,
      backgroundColor: theme.primary,
    },
  });
}
