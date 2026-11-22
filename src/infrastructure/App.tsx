import { useEffect, useState } from 'react';
import { CompositionRoot } from './CompositionRoot';
import { HomeScreen } from './HomeScreen';
import { modeIconCatalog } from './mode-icons';
import type { GameModeDescriptor } from '../application/modes';
import type { HomeViewDTO } from '../application/value-objects';

const homeDescriptors: readonly GameModeDescriptor[] = [
  { id: 'lines', nameKey: 'game.lines.name', descriptionKey: 'game.lines.desc', entryKind: 'DIRECT', progressDescriptor: 'best', previewKey: 'lines', iconKey: 'lines', accentColor: '#0891B2', hudComponents: ['score'], controls: ['pause'] },
  { id: 'merge', nameKey: 'game.merge.name', descriptionKey: 'game.merge.desc', entryKind: 'DIRECT', progressDescriptor: 'best', previewKey: 'merge', iconKey: 'merge', accentColor: '#059669', hudComponents: ['score'], controls: ['pause'] },
  { id: 'fit', nameKey: 'game.fit.name', descriptionKey: 'game.fit.desc', entryKind: 'LEVELS', progressDescriptor: 'levels', previewKey: 'fit', iconKey: 'fit', accentColor: '#D97706', hudComponents: ['score'], controls: ['pause'] },
  { id: 'sort', nameKey: 'game.sort.name', descriptionKey: 'game.sort.desc', entryKind: 'LEVELS', progressDescriptor: 'levels', previewKey: 'sort', iconKey: 'sort', accentColor: '#7C3AED', hudComponents: ['score'], controls: ['pause'] },
];

// Instancia única del Composition Root fuera de la función de renderizado
const compositionRoot = new CompositionRoot(homeDescriptors);

export default function App() {
  const [view, setView] = useState<HomeViewDTO | null>(null);

  useEffect(() => {
    // 1. Suscripción al Output Port / State Holder si expone un listener
    const unsubscribe = compositionRoot.outputState.subscribeHome?.((updatedView) => {
      setView(updatedView);
    });

    // 2. Disparo de la presentación inicial de forma segura en el montaje
    compositionRoot.homePresenter.present({
      selectedModeId: compositionRoot.homeSelectionPreference.load(),
      state: 'NORMAL',
    });

    // 3. Respaldo síncrono inicial
    if (compositionRoot.outputState.home) {
      setView(compositionRoot.outputState.home);
    }

    return () => {
      unsubscribe?.();
    };
  }, []);

  if (!view) return null;

  return (
    <HomeScreen
      view={view}
      presenter={compositionRoot.homePresenter}
      controller={compositionRoot.homeController}
      preference={compositionRoot.homeSelectionPreference}
      modeIcons={modeIconCatalog}
      onNavigate={(destination) => {
        // Delegación de rutas hacia el navegador de React Native (ej. React Navigation)
        console.log('Navegar hacia:', destination);
      }}
    />
  );
}