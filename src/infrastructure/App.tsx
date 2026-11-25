import { useEffect, useState } from 'react';
import { Appearance } from 'react-native';
import type {
  IHomeNavigationPort,
  ISettingsNavigationPort,
  ThemeMode,
} from '../application/ports';
import type { HomeViewDTO, SettingsViewDTO } from '../application/value-objects';
import { CompositionRoot } from './CompositionRoot';
import { DEFAULT_HOME_MODE_REGISTRATIONS } from './homeModeRegistrations';
import { HomeScreen } from './HomeScreen';
import { useLocale } from './i18n/useLocale';
import { SettingsScreen } from './SettingsScreen';

type ActiveScreen = 'HOME' | 'SETTINGS';

const navigationHandlers: {
  onOpenSettings: () => void;
  onGoBackHome: () => void;
} = {
  onOpenSettings: () => undefined,
  onGoBackHome: () => undefined,
};

const homeNavigator: IHomeNavigationPort = {
  navigate: (destination) => {
    if (destination === 'SETTINGS') {
      navigationHandlers.onOpenSettings();
    }
    // Other destinations (DIRECT, LEVELS, LOGIN, RANKING) will be connected by React Navigation.
  },
};

const settingsNavigator: ISettingsNavigationPort = {
  goBack: () => {
    navigationHandlers.onGoBackHome();
  },
  openLogin: () => {
    // Target Login screen will be connected by React Navigation.
  },
};

const initialThemeMode: ThemeMode =
  Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';

const compositionRoot = new CompositionRoot(
  DEFAULT_HOME_MODE_REGISTRATIONS,
  homeNavigator,
  undefined,
  { initialThemeMode, settingsNavigator },
);
compositionRoot.initializeHome();

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('HOME');
  const [homeView, setHomeView] = useState<HomeViewDTO | null>(
    () => compositionRoot.homeOutput.current ?? null,
  );
  const [settingsView, setSettingsView] = useState<SettingsViewDTO | null>(
    () => compositionRoot.settingsOutput.current ?? null,
  );
  const locale = useLocale(compositionRoot.localeController);

  useEffect(() => {
    navigationHandlers.onOpenSettings = () => {
      compositionRoot.initializeSettings('HOME');
      setActiveScreen('SETTINGS');
    };
    navigationHandlers.onGoBackHome = () => {
      compositionRoot.initializeHome();
      setActiveScreen('HOME');
    };

    const unsubscribeHome = compositionRoot.homeOutput.subscribe(setHomeView);
    const unsubscribeSettings = compositionRoot.settingsOutput.subscribe(setSettingsView);
    return () => {
      unsubscribeHome();
      unsubscribeSettings();
    };
  }, []);

  if (activeScreen === 'SETTINGS' && settingsView) {
    return (
      <SettingsScreen
        view={settingsView}
        preferencesController={compositionRoot.settingsPreferencesController}
        accountController={compositionRoot.settingsAccountController}
        navigation={compositionRoot.settingsNavigator}
        textCatalog={compositionRoot.textCatalog}
        themeController={compositionRoot.themeController}
        locale={locale}
        isPointsAvailable={homeView?.isPointsAvailable ?? true}
        onPressPoints={() =>
          compositionRoot.homeController.openPoints(
            homeView?.hasSession ?? false,
            homeView?.isPointsAvailable ?? true,
          )
        }
        onPressPlay={() => navigationHandlers.onGoBackHome()}
      />
    );
  }

  if (!homeView) return null;

  return (
    <HomeScreen
      view={homeView}
      controller={compositionRoot.homeController}
      textCatalog={compositionRoot.textCatalog}
      themeController={compositionRoot.themeController}
      locale={locale}
      modeIconResolver={compositionRoot.modeIconResolver}
      previewResolver={compositionRoot.previewAssetResolver}
    />
  );
}
