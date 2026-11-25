import { useMemo, type ReactNode } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SPACING, type Theme } from '../theme';
import { MenuBackground } from './MenuBackground';

export interface MenuScreenShellProps {
  readonly theme: Theme;
  readonly isDark: boolean;
  readonly horizontalPadding: number;
  readonly topSafeInset: number;
  readonly header: ReactNode;
  readonly children: ReactNode;
  readonly bottomMenu?: ReactNode;
  readonly overlay?: ReactNode;
  readonly scrollable?: boolean;
  readonly bodyPaddingTop?: number;
  readonly bodyPaddingBottom?: number;
}

/**
 * Standardized layout shell for primary menu screens.
 * Keeps SafeArea, decorated background, horizontal margins, and header slot
 * aligned at the exact same position while scrolling only the body below.
 */
export function MenuScreenShell({
  theme,
  isDark,
  horizontalPadding,
  topSafeInset,
  header,
  children,
  bottomMenu,
  overlay,
  scrollable = false,
  bodyPaddingTop,
  bodyPaddingBottom,
}: MenuScreenShellProps) {
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <SafeAreaView style={styles.page}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <MenuBackground theme={theme} isDark={isDark} />

      <View style={styles.content}>
        <View
          testID="menu-screen-header-slot"
          style={[
            styles.headerSlot,
            {
              paddingHorizontal: horizontalPadding,
              paddingTop: topSafeInset,
            },
          ]}
        >
          <View style={styles.headerInner}>{header}</View>
        </View>

        {scrollable ? (
          <ScrollView
            testID="menu-screen-scroll"
            style={styles.scroll}
            contentInsetAdjustmentBehavior="never"
            automaticallyAdjustContentInsets={false}
            contentContainerStyle={[
              styles.scrollContent,
              {
                paddingHorizontal: horizontalPadding,
                paddingTop: bodyPaddingTop ?? SPACING.s4,
                paddingBottom: bodyPaddingBottom ?? SPACING.s6,
              },
            ]}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.scrollInner}>{children}</View>
          </ScrollView>
        ) : (
          <View
            testID="menu-screen-body"
            style={[
              styles.fixedBody,
              {
                paddingHorizontal: horizontalPadding,
                paddingTop: bodyPaddingTop ?? 0,
                paddingBottom: bodyPaddingBottom ?? 0,
              },
            ]}
          >
            {children}
          </View>
        )}

        {bottomMenu}
      </View>

      {overlay}
    </SafeAreaView>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    page: {
      flex: 1,
      backgroundColor: theme.bg,
    },
    content: {
      flex: 1,
      width: '100%',
      alignSelf: 'center',
    },
    headerSlot: {
      width: '100%',
    },
    headerInner: {
      width: '100%',
      maxWidth: 480,
      alignSelf: 'center',
      minHeight: SPACING.touchTargetMin,
      justifyContent: 'center',
    },
    scroll: {
      flex: 1,
      width: '100%',
    },
    scrollContent: {
      flexGrow: 1,
    },
    scrollInner: {
      width: '100%',
      maxWidth: 480,
      alignSelf: 'center',
      gap: SPACING.s4,
    },
    fixedBody: {
      flex: 1,
      width: '100%',
      overflow: 'hidden',
    },
  });
}
