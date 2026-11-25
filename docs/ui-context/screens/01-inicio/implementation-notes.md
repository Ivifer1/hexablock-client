# Implementation notes — Inicio

Status: Implemented (pending React Navigation and live backend/storage wiring)

## Implemented seams

- **Data & unified registrations**: `IGameModeRegistry` (`GameModeRegistry`) paired with `GameModeRegistration` in `src/infrastructure/homeModeRegistrations.ts` (descriptor + mode icon + center preview per variant).
- **Asset resolution (DIP/ISP/OCP)**: `IAssetResolver<TAsset>` implemented by generic `StaticAssetResolver<TAsset>` (`src/adapters/assets/StaticAssetResolver.ts`) for both `modeIconResolver` and `previewAssetResolver` (`assets/ui/home-previews/`).
- **Presenter / Controller**: `HomePresenter` and `HomeController` in `src/adapters/presentation/`, consuming `IHomeProgressProvider` (`DefaultHomeProgressProvider`) and `IHomeSessionReader` (`InMemoryHomeSessionReader`).
- **View model**: `HomeViewDTO` and `HomeModeDTO` with `entryKindLabel`, `isPointsAvailable`, `sessionLabel`, and `hasSession`.
- **UI components (`src/infrastructure/`)**: `HomeScreen`, `HexModeSelector`, `WheelModeSlot`, `HomeHeader`, `HomeModeCard`, `HomeSessionBar`, and `HomeBottomMenu`.
- **Navigation**: `IHomeNavigationPort` (`DIRECT`, `LEVELS`, `SETTINGS`, `LOGIN`, `RANKING`) driven only by `entryKind` and menu/session actions, never by variant name.
- **P-18**: `HomeSessionBar` renders `common.sign_in` or `home.session_user` and routes through `openSession(hasSession)`.
