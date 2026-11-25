# Change record: feat/frontend-home-screen

Status: APPROVED
<!-- This line was approved by the team. -->
Author(s): Leonardo Ibarra with GitHub Copilot
Date: 2026-11-22

## Spec and traceability
- Use cases: UC-005, UC-006
- Requirements: FR-001, FR-024, FR-026, FR-028, FR-029, C-002, C-004, C-008
- Business rules covered: BR-005-1 through BR-005-15, BR-006-1 through BR-006-10

## Problem
Inicio has a functional UI specification and a 360 px proposed design, but no approved
frontend use case or implementation proposal. The home screen needs a generic adapter
seam that renders registered modes and routes by entry kind without variant branches.

## Proposed design

| Type | Kind | Layer | Responsibility |
| --- | --- | --- | --- |
| `HomeViewDTO` | value object | application | Carries title, registered mode items, progress state and available actions to the adapter |
| `IHomeOutputPort` | output port | application | Receives a plain Inicio view model and exposes no React Native API |
| `HomePresenter` | presenter | adapters | Maps mode descriptors and progress values to `HomeViewDTO` |
| `HomeController` | controller | adapters | Sends selection, play, settings, session and ranking intents |
| `HomeScreen` | React Native component | infrastructure | Renders data and emits gestures through the controller |
| `HexModeSelector` | React Native component | infrastructure | Renders the generic registered mode list without variant-specific layout branches |
| `HomeSelectionPreference` | adapter or repository | adapters | Persists and restores the last selected Variant |
| `IAssetResolver<TAsset>` / `StaticAssetResolver<TAsset>` | port / adapter | application / adapters | Resolves `previewKey` and `iconKey` to static infrastructure assets without variant conditionals |
| `IHomeProgressProvider` / `DefaultHomeProgressProvider` | port / adapter | application / adapters | Resolves per-mode initial progress DTOs using descriptor metadata (`totalLevels`, `progressDescriptor`) |
| `IHomeSessionReader` / `InMemoryHomeSessionReader` | port / adapter | application / adapters | Supplies authenticated/guest session snapshot for `INI-06` |
| `GameModeRegistration` | registration table | infrastructure | Couples each variant `descriptor`, `icon`, and `preview` in one OCP entry point |
| `HomeSessionBar` / `HomePreviewVisual` | React Native components | infrastructure | Render the session/ranking bar (`INI-06`) and dynamic center preview (`INI-03a`/`INI-07`) |
| `GameModeRegistry` | existing adapter | adapters | Supplies registered variant descriptors |

## Clean Architecture
- The UI imports adapters/application contracts only through injected objects.
- `HomeScreen` and `HexModeSelector` remain infrastructure details.
- The selector accepts both tap and drag gestures and animates the selected mode to the top position.
- The center preview is presentation content supplied with the selected descriptor.
- A descriptor provides `previewKey`; `PreviewAssetResolver` maps it under `assets/ui/home-previews/`, never through a Variant-name switch.
- A persisted selection preference restores the last selected mode after a return to Inicio.
- `HomePresenter` and `HomeController` live in the adapter layer.
- Inner application types expose i18n keys and entry-kind strings, never React Native elements.
- `CompositionRoot` registers the existing descriptors and wires the home presenter/controller.

## SOLID
- **SRP:** `HomePresenter` maps output state, `HomeController` translates intents, and `HomeScreen` renders.
- **OCP:** new variants add descriptors and registrations; the home layout remains unchanged.
- **DIP:** infrastructure depends on the application-level home output contract.
- **ISP:** the home output port exposes only Inicio presentation operations.

## Design patterns

| Pattern | Participants | Problem it solves | Simpler alternative rejected |
| --- | --- | --- | --- |
| Registry | `IGameModeRegistry` → `GameModeRegistry` | Supplies an extensible set of variants | A four-element constant array would not support a fifth variant |
| Strategy | `GameModeDescriptor.entryKind` → navigation interpretation | Separates destination policy from home rendering | A variant-name switch would violate OCP |
| Presenter | `HomePresenter` → `IHomeOutputPort` | Keeps framework-free view data available to the UI | Reading infrastructure state in the screen would leak adapter concerns |
| Composition Root | `CompositionRoot` | Centralizes construction and wiring | Per-screen manual construction would duplicate dependencies |

## Extensibility and infrastructure independence
- A fifth variant adds a `GameModeDescriptor` and registration only.
- A progress or i18n implementation can change behind an adapter or port.
- `HomeScreen`, `HomePresenter` and navigation routing do not need variant-name branches.
- Existing engine classes and use cases do not change.

## Alternatives considered
- Four fixed cards were rejected because they prevent live extensibility.
- A variant switch in `HomeScreen` was rejected because it leaks product rules into infrastructure.
- Directly instantiating `GameModeRegistry` inside the screen was rejected because wiring belongs in `CompositionRoot`.
- Keeping P-18 as optional was rejected because the team has confirmed session and ranking access.

## Test plan

| Spec element | Test name | Level |
| --- | --- | --- |
| Registered modes | `should_render_all_registered_modes_when_home_loads` | UI |
| Fifth variant | `should_render_added_fifth_mode_when_descriptor_is_registered` | UI |
| Direct entry | `should_emit_direct_entry_when_lines_or_merge_is_selected` | UI |
| Level entry | `should_emit_levels_entry_when_fit_or_sort_is_selected` | UI |
| Loading progress | `should_render_progress_placeholder_when_progress_is_loading` | UI |
| Both selector gestures | `should_select_preview_and_emit_actions_when_tap_or_rotation_is_used` | UI |
| Last selection | `should_restore_last_selected_mode_when_home_reopens` | UI |
| Center preview | `should_load_preview_for_selected_mode_when_selection_changes` | UI |
| Progress failure | `should_render_without_progress_when_progress_read_fails` | UI |
| Empty registry | `should_render_empty_state_when_no_modes_are_registered` | UI |
| 360 px Spanish | `should_remain_readable_when_viewport_is_360_px_in_spanish` | UI |
| 360 px English | `should_remain_readable_when_viewport_is_360_px_in_english` | UI |

## Open questions for the team
- Future polish (all modes): Current SVG previews (notably Hexa Merge and Hexa Sort, whose tiles overflow the background hex cells) are temporary placeholders. Once each game mode is implemented and playable, capture real in-game screenshots for all modes and wire them as static image assets via `ImageHomePreview` (implementing `IHomePreview`) in `DEFAULT_HOME_MODE_REGISTRATIONS`.

## Implementation notes
- Added `HomeViewDTO`, `HomeModeDTO`, `HomeProgressDTO` and `IHomeOutputPort` in application.
- Added `HomePresenter`, `HomeController`, `HomeSelectionPreference` and presentation exports in adapters.
- Added the generic React Native `HomeScreen` and wired four initial descriptors in `CompositionRoot`/`App`.
- Added the selected-mode preview and tap/gesture selection behavior.
- Added safe-area spacing, dynamic wheel positions and animated preview/selector transitions.
- Added a fixed-height Inicio layout without scrolling, concentric wheel rings and continuously animated mode positions.
- Corrected wheel gestures to follow the pointer angle around the center: clockwise advances and counterclockwise reverses the selected mode.
- Replaced floating unbounded icon positions with a bounded rotating wheel container; Playwright verified 360×800 with no page overflow and tap selection for Hexa Merge.
- Removed wheel/container rotation; mode icons and text now translate only between bounded ring positions.
- Centered the main Inicio content within the viewport, verified at 360 px.
- Extracted `HexModeSelector` and `wheelMath` (`src/infrastructure/HexModeSelector.tsx`, `src/infrastructure/wheelMath.ts`) to animate continuous shortest-arc wheel rotation on tap and interactive pointer/touch drag, keeping mode icons and labels upright via counter-rotation while scaling the active slot and subtly transitioning the detail card (respecting `reduceMotion`).
- Extracted `homeLayout` (`src/infrastructure/homeLayout.ts`) with responsive wheel/card metrics across narrow/compact/wide viewports, fixed two-line description and header heights to eliminate mode-switch layout shift, and balanced game descriptions synchronized with `docs/specs/screens/10-textos.md`.
- Replaced Home bottom-navigation and UI icons with a cohesive HexaBlock geometric outline/filled SVG icon set (`src/infrastructure/ui-icons/MenuIcons.tsx`) matching UC-006 (BR-006-2..4).
- P-18 session/ranking intents are represented in the view model; concrete login/ranking destinations remain outside this handoff.
- Refactored layers and SOLID compliance: moved React Native theme to `src/infrastructure/theme/`, tightened ESLint (`src/adapters/**`, inner-layer purity, `no-console`, `instanceof`, SRP complexity/params/depth thresholds and `max-lines` warning), segregated `IGameModeCatalog` / `IGameModeRegistry` and output stores under `src/adapters/state/`, removed concrete variant unions/branches from DTOs/presenters/UI, isolated adapter wiring exclusively in `CompositionRoot.ts`, and added `test/architecture/solid-architecture.test.ts`, `test/architecture/lsp-contracts.test.ts`, `npm run check:solid`, and a single-job `concurrency`-enabled `.github/workflows/ci.yml` gate.
- Moved `INI-06` session/login trigger from the bottom bar (`HomeSessionBar`, deleted) into `HomeHeader` as a prominent primary-styled icon button (`SessionActionIcon`) beside the theme toggle, and replaced `ScrollView` in `HomeScreen` with a non-scrolling fixed viewport layout budgeted by `computeHomeLayoutMetrics`.
- Integrated each mode's short title badge directly onto the lower rim of its circle in `WheelModeSlot` with high-contrast solid pills (`theme.primary` when selected, `theme.surfaceSubdued`/`theme.surface` when idle), synchronized vertical lift during scale transitions, and higher Android `elevation` than the circle base.
- Extracted cross-screen theme state into `IThemeController` / `IThemePreference` (`ThemeController` + `InMemoryThemePreference`) provided as a single-scope instance by `CompositionRoot`, composed into `HomeController` and subscribed by `useTheme(themeController)` so Inicio, future `SettingsController`, and other screens stay synchronized.
- Removed the theme toggle button from `HomeHeader` (and `toggleTheme()` from `IHomeController` / `HomeController`) while keeping `CompositionRoot.themeController` + `useTheme(themeController)` reactive to external theme changes, and extended the header `INI-06` session button into a horizontal primary pill showing both `SessionActionIcon` and visible `sessionLabel`.
- Standardized common button size tokens (`BUTTON_SIZES` for `s`, `m`, `l` and `scaleButtonSize` in `src/infrastructure/theme/tokens.ts`), applying `s` to `HomeHeader`'s session button and `l` to `HomeModeCard`'s primary play CTA.
- Redesigned Inicio to match the vertical showcase layout while preserving `LIGHT_THEME` / `DARK_THEME` and size tokens: standalone brand mark + outlined `s` session pill in `HomeHeader`, subtle floating hex background (`HomeAtmosphere`), split `HexaBlock\nSuite` hero + updated subtitle, centered glowing rounded-hex preview showcase with left/right chevron controls and horizontal swipe (`HexShowcaseFrame`), floating selected-mode pill with fixed two-line description and compact entry-kind/progress badges (`HomeModeCard`), horizontal row of rounded-square mode tiles (`ModeSelectorTile` in `HexModeSelector`) ordered `lines`, `merge`, `sort`, `fit`, full-width `l` Play CTA (`home.play_now`), and `HomeBottomMenu`. Replaced `WheelModeSlot.tsx` and upgraded `assets/ui/home-previews/*.svg` + `previewSources.ts` with 3D-beveled hexagonal board artwork.
- Refactored home preview rendering from a `kind: 'svg' | 'image'` discriminated union (`HomePreviewAsset`) to a polymorphic `IHomePreview` Strategy interface (`SvgHomePreview`, `ImageHomePreview`) so `HomePreviewVisual` delegates directly without format conditionals and future preview formats (e.g. GIF or video) can be added cleanly under OCP/LSP.
- Extracted centralized `withAlpha` (`src/infrastructure/theme/colorUtils.ts`) and standardized `AppButton` + Strategy-driven `APP_BUTTON_VARIANTS` (`src/infrastructure/ui/`), reusing it for both the `s` `outline` session button in `HomeHeader` and the `l` `primary` CTA in `HomeScreen`.
- Decoupled the remaining extensibility hotspots: added optional `shortNameKey` (`GameModeDescriptor` → `HomeModeDTO.shortName` in `HomePresenter`) with i18n keys (`game.*.short_name`) replacing regex prefix stripping in `HomeScreen`; added `CUSTOM` `I18nKeyDTO` progress support plus injectable `progressFormatters` (`src/infrastructure/home/progressFormatters.ts`) removing conditional formatting from `HomeModeCard`; and extracted generic `BottomNavBar` (`src/infrastructure/ui/BottomNavBar.tsx`) composed by `HomeBottomMenu`.

## Verification
- `npm run check:solid` (`npm run lint && npm run typecheck && npm run test:arch`): passed with 0 ESLint errors/warnings, clean `tsc --noEmit`, and 3/3 architecture/LSP/OCP suites (55 tests) green.
- `npm test -- --runInBand`: 13/13 Jest suites (146 tests) passed, including `test/adapters/home-presentation.test.ts`, `test/infrastructure/home-layout.test.ts`, `test/infrastructure/menu-icons.test.ts`, `test/infrastructure/home-previews.test.tsx`, `test/infrastructure/app-button.test.tsx`, `test/infrastructure/home-extensibility.test.tsx`, and `test/infrastructure/home-screen.test.tsx`.
- Initial fail check: the home presentation test suite failed before `HomePresenter` and `HomeController` existed, and the new UI/adapter tests failed before implementing `StaticAssetResolver`, `DefaultHomeProgressProvider`, `InMemoryHomeSessionReader`, and `homeModeRegistrations`.

## AI usage
GitHub Copilot drafted UC-005, the documentation structure, the proposed design and the implementation.
Team decisions supplied P-18 scope, two-way selector interaction, persisted selection, and local preview assets.
