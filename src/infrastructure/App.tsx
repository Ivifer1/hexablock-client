import { useEffect, useState } from 'react';
import { Appearance } from 'react-native';
import type { IHomeNavigationPort, ThemeMode } from '../application/ports';
import type { HomeViewDTO } from '../application/value-objects';
import { CompositionRoot } from './CompositionRoot';
import { DEFAULT_HOME_MODE_REGISTRATIONS } from './homeModeRegistrations';
import { HomeScreen } from './HomeScreen';
import { MotionRoot } from './motion';

const homeNavigator: IHomeNavigationPort = {
  navigate: () => {
    // Target screens (DIRECT, LEVELS, SETTINGS, LOGIN, RANKING) will be connected by React Navigation.
  },
};

const initialThemeMode: ThemeMode =
  Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';

const compositionRoot = new CompositionRoot(
  DEFAULT_HOME_MODE_REGISTRATIONS,
  homeNavigator,
  undefined,
  { initialThemeMode },
);
compositionRoot.initializeHome();

export default function App() {
  const [view, setView] = useState<HomeViewDTO | null>(
    () => compositionRoot.homeOutput.current ?? null,
  );

  useEffect(() => compositionRoot.homeOutput.subscribe(setView), []);

  if (!view) return null;

  return (
    <MotionRoot>
      <HomeScreen
        view={view}
        controller={compositionRoot.homeController}
        textCatalog={compositionRoot.textCatalog}
        themeController={compositionRoot.themeController}
        modeIconResolver={compositionRoot.modeIconResolver}
        previewResolver={compositionRoot.previewAssetResolver}
      />
    </MotionRoot>
  );
}
