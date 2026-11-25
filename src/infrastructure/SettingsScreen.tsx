import { useEffect, useMemo } from 'react';
import {
  BackHandler,
  Platform,
  StatusBar as RNStatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
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
import { SPACING, TYPOGRAPHY, useTheme, type Theme } from './theme';
import { MenuScreenShell } from './ui';

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
    <MenuScreenShell
      theme={theme}
      isDark={isDark}
      horizontalPadding={layout.horizontalPadding}
      topSafeInset={layout.topSafeInset}
      scrollable
      bodyPaddingBottom={view.showBottomMenu ? SPACING.s6 : layout.bottomSafeInset + SPACING.s4}
      header={
        <SettingsHeader
          title={textCatalog.resolve(view.title, activeLocale)}
          backLabel={textCatalog.resolve(view.backLabel, activeLocale)}
          theme={theme}
          onBack={() => navigation.goBack()}
        />
      }
      bottomMenu={
        view.showBottomMenu ? (
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
        ) : null
      }
      overlay={
        <SettingsLogoutDialog
          visible={view.isLogoutConfirmOpen}
          message={textCatalog.resolve('settings.logout_confirm', activeLocale)}
          cancelLabel={textCatalog.resolve('common.cancel', activeLocale)}
          confirmLabel={textCatalog.resolve('common.confirm', activeLocale)}
          theme={theme}
          onCancel={() => accountController.cancelLogout()}
          onConfirm={() => accountController.confirmLogout()}
        />
      }
    >

            {view.errorMessage ? (
              <SettingsErrorBanner
                message={textCatalog.resolve(view.errorMessage, activeLocale)}
                theme={theme}
                isDark={isDark}
              />
            ) : null}

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

      {view.versionLabel ? (
        <View testID="settings-version-footer" style={styles.versionFooter}>
          <Text style={styles.versionFooterText}>
            {textCatalog.resolve(view.versionLabel, activeLocale)}
          </Text>
        </View>
      ) : null}
    </MenuScreenShell>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    versionFooter: {
      alignItems: 'center',
      paddingTop: SPACING.s2,
      paddingBottom: SPACING.s1,
    },
    versionFooterText: {
      fontSize: TYPOGRAPHY.caption.fontSize,
      lineHeight: TYPOGRAPHY.caption.lineHeight,
      fontWeight: '600',
      color: theme.textSecondary,
    },
  });
}
