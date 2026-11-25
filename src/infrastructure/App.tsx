import { useEffect, useState } from 'react';
import type { IHomeNavigationPort } from '../application/ports';
import type { HomeViewDTO } from '../application/value-objects';
import { CompositionRoot } from './CompositionRoot';
import { DEFAULT_HOME_MODE_REGISTRATIONS } from './homeModeRegistrations';
import { HomeScreen } from './HomeScreen';

const homeNavigator: IHomeNavigationPort = {
  navigate: () => {
    // Target screens (DIRECT, LEVELS, SETTINGS, LOGIN, RANKING) will be connected by React Navigation.
  },
};

const compositionRoot = new CompositionRoot(DEFAULT_HOME_MODE_REGISTRATIONS, homeNavigator);
compositionRoot.initializeHome();

export default function App() {
  const [view, setView] = useState<HomeViewDTO | null>(
    () => compositionRoot.homeOutput.current ?? null,
  );

  useEffect(() => compositionRoot.homeOutput.subscribe(setView), []);

  if (!view) return null;

  return (
    <HomeScreen
      view={view}
      controller={compositionRoot.homeController}
      textCatalog={compositionRoot.textCatalog}
      modeIconResolver={compositionRoot.modeIconResolver}
      previewResolver={compositionRoot.previewAssetResolver}
    />
  );
}
