import { useEffect, useMemo } from 'react';
import {
  BackHandler,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar as RNStatusBar,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import type {
  ISettingsAccountController,
  ISettingsNavigationPort,
  ISettingsPreferencesController,
  ITextCatalog,
  IThemeController,
  SupportedLocale,
} from '../application/ports';
import type { SettingsViewDTO } from '../application/value-objects';
import { HomeBottomMenu } from './home/HomeBottomMenu';
import { computeHomeLayoutMetrics } from './homeLayout';
import { SettingsAccountCard } from './settings/SettingsAccountCard';
import { SettingsAppearanceCard } from './settings/SettingsAppearanceCard';
import { SettingsAudioCard } from './settings/SettingsAudioCard';
import { SettingsErrorBanner } from './settings/SettingsErrorBanner';
import { SettingsHeader } from './settings/SettingsHeader';
import { SettingsLanguageCard } from './settings/SettingsLanguageCard';
import { SettingsLogoutDialog } from './settings/SettingsLogoutDialog';
import { RADIUS, SPACING, useTheme, type Theme } from './theme';

export interface SettingsScreenProps {
  readonly view: SettingsViewDTO;
  readonly preferencesController: ISettingsPreferencesController;
  readonly accountController: ISettingsAccountController;
  readonly navigation: ISettingsNavigationPort;
  readonly textCatalog: ITextCatalog;
  readonly themeController?: IThemeController;
  readonly locale?: SupportedLocale;
  readonly isPointsAvailable?: boolean;
  readonly onPressPoints?: () => void;
  readonly onPressPlay?: () => void;
}

function withAlpha(hex: string, alphaHex: string): string {
  if (/^#[0-9A-Fa-f]{6}$/.test(hex)) return `${hex}${alphaHex}`;
  return hex;
}

export function SettingsScreen({
  view,
  preferencesController,
  accountController,
  navigation,
  textCatalog,
  themeController,
  locale,
  isPointsAvailable = true,
  onPressPoints,
  onPressPlay,
}: SettingsScreenProps) {
  const activeLocale = locale ?? view.activeLocale;
  const { theme, isDark } = useTheme(themeController);
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { width: viewportWidth, height: viewportHeight } = useWindowDimensions();

  const layout = computeHomeLayoutMetrics(
    viewportWidth,
    viewportHeight,
    Platform.OS,
    Platform.OS === 'android' ? (RNStatusBar.currentHeight ?? 0) : 0,
  );

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.goBack();
      return true;
    });
    return () => {
      subscription.remove();
    };
  }, [navigation]);

  const authenticatedTitle = textCatalog.resolve(
    {
      key: 'home.session_user',
      parameters: { name: view.session.displayName ?? '' },
    },
    activeLocale,
  );

  return (
    <SafeAreaView style={styles.page}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View style={styles.atmosphere} pointerEvents="none">
        <View
          style={[
            styles.atmosphereBlob,
            styles.atmosphereBlobTop,
            { backgroundColor: withAlpha(theme.primary, isDark ? '22' : '14') },
          ]}
        />
        <View
          style={[
            styles.atmosphereBlob,
            styles.atmosphereBlobBottom,
            { backgroundColor: withAlpha(theme.primary, isDark ? '14' : '0A') },
          ]}
        />
      </View>

      <View style={styles.content}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingHorizontal: layout.horizontalPadding,
              paddingTop: layout.topSafeInset,
              paddingBottom: SPACING.s6,
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.innerColumn}>
            <SettingsHeader
              title={textCatalog.resolve(view.title, activeLocale)}
              backLabel={textCatalog.resolve(view.backLabel, activeLocale)}
              versionLabel={
                view.versionLabel
                  ? textCatalog.resolve(view.versionLabel, activeLocale)
                  : null
              }
              theme={theme}
              onBack={() => navigation.goBack()}
            />

            {view.errorMessage ? (
              <SettingsErrorBanner
                message={textCatalog.resolve(view.errorMessage, activeLocale)}
                theme={theme}
                isDark={isDark}
              />
            ) : null}

            <SettingsAudioCard
              musicLabel={textCatalog.resolve('settings.music', activeLocale)}
              sfxLabel={textCatalog.resolve('settings.sfx', activeLocale)}
              musicEnabled={view.musicEnabled}
              sfxEnabled={view.sfxEnabled}
              theme={theme}
              isDark={isDark}
              onToggleMusic={(enabled) => preferencesController.setMusicEnabled(enabled)}
              onToggleSfx={(enabled) => preferencesController.setSfxEnabled(enabled)}
            />

            <SettingsAppearanceCard
              sectionLabel={textCatalog.resolve('settings.appearance', activeLocale)}
              darkModeLabel={textCatalog.resolve('settings.dark_mode', activeLocale)}
              isDarkMode={view.isDarkMode}
              theme={theme}
              isDark={isDark}
              onToggleDarkMode={(enabled) => preferencesController.setDarkMode(enabled)}
            />

            <SettingsLanguageCard
              title={textCatalog.resolve('settings.language', activeLocale)}
              locales={view.locales}
              theme={theme}
              isDark={isDark}
              onSelectLocale={(code) => preferencesController.selectLocale(code)}
            />

            {view.session.isEnabled ? (
              <SettingsAccountCard
                eyebrowLabel={textCatalog.resolve('settings.account', activeLocale)}
                session={view.session}
                authenticatedTitle={authenticatedTitle}
                signInLabel={textCatalog.resolve('common.sign_in', activeLocale)}
                logoutLabel={textCatalog.resolve('settings.logout', activeLocale)}
                theme={theme}
                isDark={isDark}
                onPressSignIn={() => accountController.openLogin()}
                onPressLogout={() => accountController.requestLogout()}
              />
            ) : null}
          </View>
        </ScrollView>

        {view.showBottomMenu ? (
          <HomeBottomMenu
            selectedMenu="SETTINGS"
            isPointsAvailable={isPointsAvailable}
            menuHeight={layout.menuHeight}
            bottomSafeInset={layout.bottomSafeInset}
            menuIconSize={layout.menuIconSize}
            theme={theme}
            textCatalog={textCatalog}
            locale={activeLocale}
            onPressPoints={() => onPressPoints?.()}
            onPressPlay={() => (onPressPlay ? onPressPlay() : navigation.goBack())}
            onPressSettings={() => undefined}
          />
        ) : null}
      </View>

      <SettingsLogoutDialog
        visible={view.isLogoutConfirmOpen}
        message={textCatalog.resolve('settings.logout_confirm', activeLocale)}
        cancelLabel={textCatalog.resolve('common.cancel', activeLocale)}
        confirmLabel={textCatalog.resolve('common.confirm', activeLocale)}
        theme={theme}
        onCancel={() => accountController.cancelLogout()}
        onConfirm={() => accountController.confirmLogout()}
      />
    </SafeAreaView>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    page: {
      flex: 1,
      backgroundColor: theme.bg,
    },
    atmosphere: {
      ...StyleSheet.absoluteFill,
      overflow: 'hidden',
    },
    atmosphereBlob: {
      position: 'absolute',
      borderRadius: RADIUS.full,
    },
    atmosphereBlobTop: {
      width: 280,
      height: 280,
      top: -80,
      right: -60,
    },
    atmosphereBlobBottom: {
      width: 240,
      height: 240,
      bottom: 80,
      left: -80,
    },
    content: {
      flex: 1,
      width: '100%',
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
    },
    innerColumn: {
      width: '100%',
      maxWidth: 480,
      alignSelf: 'center',
      gap: SPACING.s4,
    },
  });
}
