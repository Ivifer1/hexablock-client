import { useMemo, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BORDER_WIDTH, RADIUS, SPACING, TYPOGRAPHY, type Theme } from '../theme';

export interface BottomNavItemIconContext {
  readonly selected: boolean;
  readonly disabled: boolean;
  readonly color: string;
  readonly cutoutColor: string;
  readonly iconSize: number;
  readonly activeSlotSize: number;
}

export interface BottomNavItem<TKey extends string = string> {
  readonly key: TKey;
  readonly label: string;
  readonly disabled?: boolean;
  readonly onPress: () => void;
  readonly renderIcon: (ctx: BottomNavItemIconContext) => ReactNode;
}

export interface BottomNavBarProps<TKey extends string = string> {
  readonly items: readonly BottomNavItem<TKey>[];
  readonly selectedKey: TKey;
  readonly height: number;
  readonly bottomSafeInset: number;
  readonly iconSize: number;
  readonly theme: Theme;
}

export function BottomNavBar<TKey extends string = string>({
  items,
  selectedKey,
  height,
  bottomSafeInset,
  iconSize,
  theme,
}: BottomNavBarProps<TKey>) {
  const styles = useMemo(() => createStyles(theme), [theme]);
  const activeSlotSize = Math.round(iconSize * 1.35);

  return (
    <View
      style={[
        styles.bar,
        {
          height: height + bottomSafeInset,
          paddingTop: SPACING.s2,
          paddingBottom: bottomSafeInset,
        },
      ]}
    >
      <View style={styles.inner}>
        {items.map((item) => {
          const isDisabled = Boolean(item.disabled);
          const isSelected = !isDisabled && selectedKey === item.key;
          const iconColor = isSelected ? theme.primary : theme.textSecondary;

          return (
            <Pressable
              key={item.key}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected, disabled: isDisabled }}
              accessibilityLabel={item.label}
              onPress={item.onPress}
              style={({ pressed }) => [
                styles.item,
                isDisabled && styles.disabledItem,
                pressed && !isDisabled && styles.pressedItem,
              ]}
            >
              <View
                style={[
                  styles.iconSlot,
                  { width: activeSlotSize, height: activeSlotSize },
                ]}
              >
                {item.renderIcon({
                  selected: isSelected,
                  disabled: isDisabled,
                  color: iconColor,
                  cutoutColor: theme.surface,
                  iconSize,
                  activeSlotSize,
                })}
              </View>
              <Text
                style={[styles.label, isSelected && styles.labelSelected]}
                numberOfLines={1}
              >
                {item.label}
              </Text>
              <View style={styles.activeDotSlot}>
                {isSelected ? <View style={styles.activeDot} /> : null}
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
    bar: {
      width: '100%',
      borderTopWidth: BORDER_WIDTH.thin,
      borderTopColor: theme.borderDefault,
      backgroundColor: theme.surface,
      alignItems: 'center',
      ...theme.shadowLow,
    },
    inner: {
      width: '100%',
      maxWidth: 480,
      alignSelf: 'center',
      height: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    item: {
      flex: 1,
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 3,
      minHeight: SPACING.touchTargetMin,
    },
    pressedItem: { opacity: 0.72 },
    disabledItem: { opacity: 0.45 },
    iconSlot: { alignItems: 'center', justifyContent: 'center' },
    label: {
      fontSize: TYPOGRAPHY.caption.fontSize,
      lineHeight: TYPOGRAPHY.caption.lineHeight,
      fontWeight: TYPOGRAPHY.caption.fontWeight,
      color: theme.textSecondary,
    },
    labelSelected: {
      color: theme.primary,
      fontWeight: '700',
    },
    activeDotSlot: {
      height: 6,
      alignItems: 'center',
      justifyContent: 'center',
    },
    activeDot: {
      width: 4,
      height: 4,
      borderRadius: RADIUS.full,
      backgroundColor: theme.primary,
    },
  });
}
