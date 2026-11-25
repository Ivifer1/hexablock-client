# Implementation notes — Inicio

Status: Implemented (pending React Navigation and live backend/storage wiring)

## Implemented seams

- **Data & unified registrations**: `IGameModeRegistry` (`GameModeRegistry`) paired with `GameModeRegistration` in `src/infrastructure/homeModeRegistrations.ts` (descriptor + mode icon + center preview per variant).
- **Asset resolution (DIP/ISP/OCP)**: `IAssetResolver<TAsset>` implemented by generic `StaticAssetResolver<TAsset>` (`src/adapters/assets/StaticAssetResolver.ts`) for both `modeIconResolver` and `previewAssetResolver` (`assets/ui/home-previews/`).
- **Presenter / Controller**: `HomePresenter` and `HomeController` in `src/adapters/presentation/`, consuming `IHomeProgressProvider` (`DefaultHomeProgressProvider`) and `IHomeSessionReader` (`InMemoryHomeSessionReader`), plus shared `IThemeController` (`ThemeController` + `InMemoryThemePreference`) so Inicio, Ajustes, and other screens share one reactive theme state.
- **View model**: `HomeViewDTO` and `HomeModeDTO` with `entryKindLabel`, `isPointsAvailable`, `sessionLabel`, and `hasSession`.
- **UI components (`src/infrastructure/`)**: `HomeScreen`, `HexModeSelector`, `WheelModeSlot`, `HomeHeader`, `HomeModeCard`, and `HomeBottomMenu` (fixed non-scrolling viewport layout).
- **Navigation**: `IHomeNavigationPort` (`DIRECT`, `LEVELS`, `SETTINGS`, `LOGIN`, `RANKING`) driven only by `entryKind` and menu/session actions, never by variant name.
- **P-18**: `HomeHeader` renders an extended horizontal primary pill (`SessionActionIcon` + visible `common.sign_in` or `home.session_user` label, plus an active session dot when authenticated), routing through `openSession(hasSession)`. Theme switching is removed from Inicio header and exposed via shared `CompositionRoot.themeController` (`IThemeController`) so Inicio reacts to changes made in Settings or other controllers.
