/**
 * @jest-environment node
 */
import { StaticAssetResolver } from '../../src/adapters/assets';
import { GameModeRegistry } from '../../src/adapters/GameModeRegistry';
import { StaticTextCatalog } from '../../src/adapters/i18n';
import {
  DefaultHomeProgressProvider,
  HomeSelectionPreference,
  InMemoryHomeSessionReader,
} from '../../src/adapters/presentation';
import {
  DefeatOutputStore,
  GameControlsOutputStore,
  GameHudOutputStore,
  HomeOutputStore,
  LevelSelectionOutputStore,
  VictoryOutputStore,
} from '../../src/adapters/state';
import type { GameModeDescriptor } from '../../src/application/modes';
import type {
  IAssetResolver,
  IGameModeRegistry,
  IHomeProgressProvider,
  IHomeSelectionPreference,
  IHomeSessionReader,
  ITextCatalog,
} from '../../src/application/ports';
import type {
  DefeatViewDTO,
  GameControlsDTO,
  GameHudDTO,
  HomeViewDTO,
  LevelSelectionViewDTO,
  VictoryViewDTO,
} from '../../src/application/value-objects';

const sampleDescriptor: GameModeDescriptor = {
  id: 'mode-a',
  nameKey: 'game.a.name',
  descriptionKey: 'game.a.desc',
  entryKind: 'DIRECT',
  progressDescriptor: 'best',
  previewKey: 'mode-a',
  iconKey: 'mode-a',
  accentColor: '#0891B2',
  hudComponents: ['score'],
  controls: ['pause'],
};

describe('LSP contract suites', () => {
  describe.each<{ name: string; create: () => IGameModeRegistry }>([
    { name: 'GameModeRegistry', create: () => new GameModeRegistry() },
  ])('IGameModeRegistry contract: $name', ({ create }) => {
    it('should_preserve_order_lookup_and_reject_duplicates_when_managing_modes', () => {
      // Arrange
      const registry = create();
      const secondDescriptor: GameModeDescriptor = {
        ...sampleDescriptor,
        id: 'mode-b',
        entryKind: 'LEVELS',
      };

      // Act
      registry.register(sampleDescriptor);
      registry.register(secondDescriptor);

      // Assert
      expect(registry.findById('mode-a')).toBe(sampleDescriptor);
      expect(registry.findById('unknown')).toBeUndefined();
      expect(registry.findAll()).toEqual([sampleDescriptor, secondDescriptor]);
      expect(() => registry.register(sampleDescriptor)).toThrow();
    });
  });

  describe.each<{ name: string; create: () => IHomeSelectionPreference }>([
    { name: 'HomeSelectionPreference', create: () => new HomeSelectionPreference() },
  ])('IHomeSelectionPreference contract: $name', ({ create }) => {
    it('should_persist_and_overwrite_selected_mode_when_saved', () => {
      // Arrange
      const preference = create();

      // Act & Assert
      expect(preference.load()).toBeNull();
      preference.save('mode-a');
      expect(preference.load()).toBe('mode-a');
      preference.save('mode-b');
      expect(preference.load()).toBe('mode-b');
    });
  });

  describe.each<{ name: string; create: () => ITextCatalog }>([
    {
      name: 'StaticTextCatalog',
      create: () =>
        new StaticTextCatalog(
          {
            'greeting.user': { es: 'Hola {user}', en: 'Hello {user}' },
          },
          'es',
        ),
    },
  ])('ITextCatalog contract: $name', ({ create }) => {
    it('should_resolve_locales_interpolate_parameters_and_fallback_to_key', () => {
      // Arrange
      const catalog = create();

      // Act & Assert
      expect(catalog.resolve({ key: 'greeting.user', parameters: { user: 'Ana' } })).toBe('Hola Ana');
      expect(catalog.resolve({ key: 'greeting.user', parameters: { user: 'Ana' } }, 'en')).toBe(
        'Hello Ana',
      );
      expect(catalog.resolve('missing.key')).toBe('missing.key');
    });
  });

  interface OutputStoreHarness<TView> {
    readonly name: string;
    create(): {
      readonly current: TView | undefined;
      present(view: TView): void;
      subscribe(listener: (view: TView) => void): () => void;
    };
    sampleView: TView;
  }

  const outputStoreHarnesses: readonly OutputStoreHarness<unknown>[] = [
    {
      name: 'HomeOutputStore',
      create: () => {
        const store = new HomeOutputStore();
        return {
          get current() {
            return store.current;
          },
          present: (view) => store.presentHome(view as HomeViewDTO),
          subscribe: (listener) => store.subscribe(listener as (view: HomeViewDTO) => void),
        };
      },
      sampleView: {
        state: 'EMPTY',
        title: { key: 'app.title' },
        settingsLabel: { key: 'home.settings' },
        heroTitle: { key: 'home.hero_title' },
        heroSubtitle: { key: 'home.hero_subtitle' },
        modes: [],
        selectedModeId: null,
        errorMessage: null,
        sessionLabel: { key: 'common.sign_in' },
        hasSession: false,
        isPointsAvailable: true,
      } satisfies HomeViewDTO,
    },
    {
      name: 'GameHudOutputStore',
      create: () => {
        const store = new GameHudOutputStore();
        return {
          get current() {
            return store.current;
          },
          present: (view) => store.presentHud(view as GameHudDTO),
          subscribe: (listener) => store.subscribe(listener as (view: GameHudDTO) => void),
        };
      },
      sampleView: {
        gameId: 'mode-a',
        title: { key: 'game.a.name' },
        levelNumber: null,
        score: 100,
        bestScore: 200,
        moves: 5,
        elapsedSeconds: 30,
        goalsCompleted: null,
        goalsTotal: null,
        trayLabel: null,
      } satisfies GameHudDTO,
    },
    {
      name: 'GameControlsOutputStore',
      create: () => {
        const store = new GameControlsOutputStore();
        return {
          get current() {
            return store.current;
          },
          present: (view) => store.presentControls(view as GameControlsDTO),
          subscribe: (listener) => store.subscribe(listener as (view: GameControlsDTO) => void),
        };
      },
      sampleView: {
        controls: [{ action: 'PAUSE', enabled: true, directionIndex: null, label: { key: 'pause' } }],
      } satisfies GameControlsDTO,
    },
    {
      name: 'LevelSelectionOutputStore',
      create: () => {
        const store = new LevelSelectionOutputStore();
        return {
          get current() {
            return store.current;
          },
          present: (view) => store.presentLevelSelection(view as LevelSelectionViewDTO),
          subscribe: (listener) => store.subscribe(listener as (view: LevelSelectionViewDTO) => void),
        };
      },
      sampleView: {
        state: 'NORMAL',
        gameId: 'mode-a',
        title: { key: 'levels.title' },
        showsStars: true,
        completedCount: 1,
        totalCount: 15,
        levels: [],
        isOffline: false,
        availableActions: ['RETRY'],
      } satisfies LevelSelectionViewDTO,
    },
    {
      name: 'VictoryOutputStore',
      create: () => {
        const store = new VictoryOutputStore();
        return {
          get current() {
            return store.current;
          },
          present: (view) => store.presentVictory(view as VictoryViewDTO),
          subscribe: (listener) => store.subscribe(listener as (view: VictoryViewDTO) => void),
        };
      },
      sampleView: {
        gameId: 'mode-a',
        title: { key: 'victory.title' },
        score: 300,
        result: { kind: 'SCORE_ONLY', score: 300 },
        isNewBest: true,
        hasNextLevel: false,
        canKeepPlaying: false,
        availableActions: ['NEW_GAME', 'GO_HOME'],
      } satisfies VictoryViewDTO,
    },
    {
      name: 'DefeatOutputStore',
      create: () => {
        const store = new DefeatOutputStore();
        return {
          get current() {
            return store.current;
          },
          present: (view) => store.presentDefeat(view as DefeatViewDTO),
          subscribe: (listener) => store.subscribe(listener as (view: DefeatViewDTO) => void),
        };
      },
      sampleView: {
        gameId: 'mode-a',
        title: { key: 'defeat.title' },
        reasonLabel: { key: 'defeat.no_moves' },
        score: 50,
        reason: 'NO_VALID_MOVES',
        completedGoals: null,
        totalGoals: null,
        bestScore: 200,
        isNewBest: false,
        availableActions: ['RETRY', 'GO_HOME'],
      } satisfies DefeatViewDTO,
    },
  ];

  describe.each(outputStoreHarnesses)('Output store contract: $name', ({ create, sampleView }) => {
    it('should_store_latest_view_and_notify_only_active_subscribers_when_presented', () => {
      // Arrange
      const store = create();
      const received: unknown[] = [];
      const unsubscribe = store.subscribe((view) => received.push(view));

      // Act
      expect(store.current).toBeUndefined();
      store.present(sampleView);
      unsubscribe();
      store.present(sampleView);

      // Assert
      expect(store.current).toBe(sampleView);
      expect(received).toEqual([sampleView]);
    });
  });

  describe.each<{ name: string; create: () => IAssetResolver<string> }>([
    {
      name: 'StaticAssetResolver',
      create: () => new StaticAssetResolver({ 'mode-a': 'asset-a' }),
    },
  ])('IAssetResolver contract: $name', ({ create }) => {
    it('should_resolve_known_key_and_return_null_for_missing_or_prototype_keys', () => {
      // Arrange
      const resolver = create();

      // Act & Assert
      expect(resolver.resolve('mode-a')).toBe('asset-a');
      expect(resolver.resolve('missing')).toBeNull();
      expect(resolver.resolve('constructor')).toBeNull();
    });
  });

  describe.each<{ name: string; create: () => IHomeProgressProvider }>([
    {
      name: 'DefaultHomeProgressProvider',
      create: () => new DefaultHomeProgressProvider(),
    },
  ])('IHomeProgressProvider contract: $name', ({ create }) => {
    it('should_return_valid_progress_dto_for_known_and_unknown_descriptors', () => {
      // Arrange
      const provider = create();

      // Act
      const best = provider.getProgress(sampleDescriptor);
      const levels = provider.getProgress({
        ...sampleDescriptor,
        progressDescriptor: 'levels',
        totalLevels: 12,
      });
      const fallback = provider.getProgress({
        ...sampleDescriptor,
        progressDescriptor: 'custom-unknown',
      });

      // Assert
      expect(best).toEqual({ kind: 'NONE' });
      expect(levels).toEqual({ kind: 'LEVELS', completed: 0, total: 12 });
      expect(fallback).toEqual({ kind: 'NONE' });
    });
  });

  describe.each<{ name: string; create: () => IHomeSessionReader }>([
    {
      name: 'InMemoryHomeSessionReader',
      create: () => new InMemoryHomeSessionReader(),
    },
  ])('IHomeSessionReader contract: $name', ({ create }) => {
    it('should_return_consistent_session_snapshot_when_queried', () => {
      // Arrange
      const reader = create();

      // Act
      const snapshot = reader.getSnapshot();

      // Assert
      expect(typeof snapshot.isAuthenticated).toBe('boolean');
      expect(snapshot.displayName === null || typeof snapshot.displayName === 'string').toBe(true);
    });
  });
});
