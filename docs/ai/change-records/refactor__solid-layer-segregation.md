# Change record: refactor/solid-layer-segregation

Status: APPROVED
<!-- Only a human changes this line to "Status: APPROVED" (hooks block the agent from doing it). -->
Author(s): Leonardo Ibarra with Antigravity (Gemini 4 Neon)
Date: 2026-11-24

## Spec and traceability
- Use cases: UC-005, UC-006
- Requirements: FR-001, FR-024, FR-026, FR-028, FR-029, C-002, C-004, C-008
- Business rules covered: BR-005-1, BR-005-2, BR-005-3, BR-005-4, BR-005-6, BR-005-13, BR-005-14, BR-006-5, BR-006-6, BR-006-7, BR-006-8

## Problem
The initial home screen implementation and architecture contracts had several Clean Architecture and SOLID gaps: `useTheme` and React Native shadow tokens lived inside `src/adapters/presentation/theme/` (with ESLint not forbidding UI packages in `src/adapters/**`), `OutputStateStore` centralized state for six screens in one class, `HomePresenter`, `HomeScreen`, `victory.dto.ts`, and `defeat.dto.ts` hardcoded variant identifiers (`'lines'`, `'FIT'`, `'SORT'`, `'MERGE'`), `HomeScreen` bypassed `HomeController` / `HomePresenter` and received concrete adapter classes instead of ports, `homeLayout.ts` mixed layout metrics with i18n copy, and `App.tsx` failed ESLint (`react-hooks/set-state-in-effect`) and used `console.log`.

## Proposed design
Enforce inward Clean Architecture dependencies, split multi-responsibility classes, invert concrete adapter dependencies behind application ports, and replace hardcoded variant branches with extensible registries/mappers:

| Type | Kind | Layer | Responsibility |
| --- | --- | --- | --- |
| `IGameModeCatalog` | port interface | application | Exposes read-only lookup of registered mode descriptors |
| `IGameModeRegistry` | port interface | application | Extends `IGameModeCatalog` with `register` for composition root setup |
| `IHomeController` | port interface | application | Defines home screen user intents (`selectMode`, `play`, `openSettings`, `openPoints`) |
| `IHomeNavigationPort` / `HomeDestination` | port interface | application | Abstracts destination navigation away from the controller |
| `IHomeSelectionPreference` | port interface | application | Abstracts reading and persisting the selected mode ID |
| `ITextCatalog` / `SupportedLocale` | port interface | application | Abstracts key-based i18n text lookup and parameter interpolation |
| `VictoryResultSummary` / `VictoryMetricDTO` | value object | application | Models victory outcomes by generic capabilities/metrics instead of variant names |
| `DefeatReason` | value object | application | Models defeat reasons as an open string code paired with `reasonLabel` |
| `ObservableViewStore<TView>` | generic state holder | adapters | Stores current view DTO and notifies subscribers for a single screen |
| `HomeOutputStore`, `GameHudOutputStore`, `GameControlsOutputStore`, `LevelSelectionOutputStore`, `VictoryOutputStore`, `DefeatOutputStore` | output port adapters | adapters | Per-screen stores implementing each screen's output port via `ObservableViewStore` |
| `StaticTextCatalog` | adapter | adapters | Implements `ITextCatalog` over static translation dictionaries with `{param}` interpolation |
| `IHomePresenter` / `HomePresenter` / `HomeProgressMapper` | presenter | adapters | Maps `IGameModeCatalog` entries to `HomeViewDTO` using extensible progress mappers and order-based default selection |
| `HomeController` | controller | adapters | Implements `IHomeController`, coordinating `IHomeSelectionPreference`, `IHomePresenter`, and `IHomeNavigationPort` |
| `useTheme` / `tokens` | UI theme module | infrastructure | Holds React Native `useColorScheme` hook and styling tokens (moved from `adapters`, without `GAME_COLORS`) |
| `HOME_TEXT_CATALOG` / `createHomeTextCatalog` | i18n dictionary | infrastructure | Supplies Spanish/English home strings to `StaticTextCatalog`, separated from `homeLayout.ts` |
| `DEFAULT_HOME_MODE_DESCRIPTORS` | configuration | infrastructure | Centralizes launch-order mode registration data for `App.tsx` |
| `HomeHeader`, `HomeModeCard`, `HomeBottomMenu`, `WheelModeSlot` | React Native components | infrastructure | Decompose `HomeScreen` and `HexModeSelector` into single-responsibility UI components |
| `CompositionRoot` | DI root | infrastructure | Wires segregated stores, ports, adapters, `StaticTextCatalog`, and `IHomeNavigationPort` |

## Clean Architecture
- **Dependency direction:** `infrastructure → adapters → application → domain`.
- `src/adapters/**` no longer imports `react` or `react-native`; `eslint.config.js` now enforces `uiAndFrameworkPackages` restrictions on `src/adapters/**` alongside `layer('infrastructure')`.
- `HomeScreen` and its subcomponents depend only on `IHomeController`, `ITextCatalog`, and DTOs from `src/application/`, never instantiating or importing concrete adapters.
- `CompositionRoot` is the single wiring point connecting `GameModeRegistry`, per-screen output stores, `HomeSelectionPreference`, `HomePresenter`, `HomeController`, `StaticTextCatalog`, and `IHomeNavigationPort`.

## SOLID
- **SRP:** Replaced monolithic `OutputStateStore` with six dedicated stores under `src/adapters/state/`; separated `HOME_TEXT_CATALOG` from `computeHomeLayoutMetrics` in `homeLayout.ts`; split `HomeScreen` and `HexModeSelector` into `HomeHeader`, `HomeModeCard`, `HomeBottomMenu`, and `WheelModeSlot`.
- **OCP:** Removed hardcoded `'lines'` fallback in `HomePresenter` and `HomeScreen` (defaulting to the first registered descriptor), replaced `if/else` progress branching with injectable `HomeProgressMapper` strategies (fixing `'best'` progress), removed `GAME_COLORS` from `tokens.ts`, and replaced variant-named unions in `victory.dto.ts` and `defeat.dto.ts` with generic capability/metric types.
- **LSP:** All per-screen stores, `StaticTextCatalog`, `HomeSelectionPreference`, `HomePresenter`, and `HomeController` honor their application port contracts without partial or throwing stubs.
- **ISP:** Split read-only `IGameModeCatalog` from write-capable `IGameModeRegistry`, and separated `IHomeController`, `IHomeNavigationPort`, `IHomeSelectionPreference`, and `ITextCatalog` so consumers depend only on needed methods.
- **DIP:** `HomePresenter`, `HomeController`, `HomeScreen`, and `CompositionRoot` depend on application ports (`IGameModeCatalog`, `IHomeOutputPort`, `IHomeNavigationPort`, `IHomeSelectionPreference`, `IHomeController`, `ITextCatalog`) instead of concrete implementations or framework APIs.

## Design patterns
| Pattern | Participants | Problem it solves here | Simpler alternative rejected and why |
| --- | --- | --- | --- |
| Segregated Store / Observer | `ObservableViewStore<TView>` → `HomeOutputStore`, `GameHudOutputStore`, etc. | Eliminates single-store coupling across unrelated screens while supporting reactive UI subscriptions | Keeping one `OutputStateStore` with fields for all 6 screens violates SRP and forces edits for every new screen |
| Strategy | `HomeProgressMapper` → `HomePresenter` | Maps `progressDescriptor` strings to `HomeProgressDTO` without closed `if/else` chains | Hardcoding `'levels'` / `'none'` inside `HomePresenter` violated OCP and broke `'best'` |
| Adapter | `StaticTextCatalog` → `ITextCatalog` | Decouples presentation and UI components from hardcoded translation dictionaries and `locale = 'es'` | Inline lookup helper in `HomeScreen` / `homeLayout.ts` coupled UI to raw strings and mixed layout with i18n |
| Segregated Interface | `IGameModeCatalog` vs `IGameModeRegistry` | Prevents presenters and controllers from depending on `register()` | Exposing `register()` to read-only consumers violated ISP |

## Extensibility and infrastructure independence
- Adding a fifth variant requires registering a new `GameModeDescriptor` (and, if it uses a new progress descriptor format, supplying a `HomeProgressMapper` entry in `CompositionRoot`) without touching `HomePresenter`, `HomeController`, `HomeScreen`, `victory.dto.ts`, or `defeat.dto.ts`.
- Swapping `HomeSelectionPreference` for `AsyncStorage` or `StaticTextCatalog` for a remote/library i18n provider only adds a new adapter implementing `IHomeSelectionPreference` or `ITextCatalog`.
- `eslint.config.js` and `test/architecture/layer-boundaries.test.ts` prevent UI/framework packages from re-entering `src/adapters/**`.

## Alternatives considered
- **Leaving theme hooks in `src/adapters/presentation/theme/`:** Rejected because `useTheme` imports `react` and `react-native`, violating Clean Architecture boundaries.
- **Keeping `OutputStateStore` as a facade:** Rejected because every new screen would still modify the same class and share unrelated state.

## Test plan
| Spec element (flow / BR) | Test name | Level |
| --- | --- | --- |
| Adapter boundary enforcement | `should_report_error_when_src/adapters/sample.ts_imports_react` (and `react-native`, `expo`) | Architecture |
| OCP default selection | `should_select_first_registered_mode_when_no_prior_selection_exists` | Unit |
| `'best'` progress mapping | `should_render_none_progress_when_best_descriptor_has_no_record_yet` | Unit |
| Custom progress mapper OCP | `should_support_custom_progress_mapper_when_new_progress_kind_is_added` | Unit |
| Controller select + present loop | `should_save_preference_and_re_present_when_controller_selects_mode` | Integration |
| Text catalog i18n + interpolation | `should_resolve_translated_keys_and_interpolate_parameters_when_using_text_catalog` | Unit |
| CompositionRoot navigation wiring | `should_forward_navigation_and_selection_updates_when_home_controller_is_used` | Integration |
| Acyclic dependency graph | `should_have_no_circular_dependencies_when_analyzing_src_import_graph` | Architecture |
| CompositionRoot DIP exclusivity | `should_only_import_concrete_adapters_from_composition_root_when_scanning_infrastructure` | Architecture |
| ISP port & output store checks | `should_keep_application_ports_small_and_cohesive_when_checking_isp`, `should_limit_each_adapter_class_to_at_most_one_output_port_when_checking_srp_and_isp` | Architecture |
| OCP no-variant-branching & 5th variant | `should_contain_no_concrete_variant_conditionals_when_scanning_core_and_screens`, `should_support_a_fifth_variant_end_to_end_when_registered_in_composition_root` | Architecture |
| LSP port contracts | `LSP contract suites` (`IGameModeRegistry`, `IHomeSelectionPreference`, `ITextCatalog`, output stores) | Architecture |

## Open questions for the team
- None; ready for team review to approve `Status: APPROVED` before committing.

## Implementation notes
- Moved `tokens.ts` and `useTheme.ts` to `src/infrastructure/theme/`, removed `GAME_COLORS`, and updated `eslint.config.js` + `test/architecture/layer-boundaries.test.ts`.
- Added `IGameModeCatalog`, `IHomeController`, `IHomeNavigationPort`, `IHomeSelectionPreference`, and `ITextCatalog` under `src/application/ports/`, and broke the circular barrel import in `src/application/modes/game-mode-descriptor.ts`.
- Generalized `VictoryResultSummary` (`victory.dto.ts`) and `DefeatReason` (`defeat.dto.ts`).
- Replaced `OutputStateStore` with `ObservableViewStore` and six per-screen stores under `src/adapters/state/`, added `StaticTextCatalog` under `src/adapters/i18n/`, and updated `HomePresenter`, `HomeController`, and `HomeSelectionPreference`.
- Extracted `homeTranslations.ts` and `homeModeDescriptors.ts`, decomposed `HomeScreen` and `HexModeSelector` into `src/infrastructure/home/` components, isolated concrete adapter wiring exclusively inside `CompositionRoot.ts`, and fixed `App.tsx` (`react-hooks/set-state-in-effect` and `console.log` removal).
- Added automated SOLID & Clean Architecture CI gates: ESLint inner-layer purity, `no-console`, `instanceof`, SRP thresholds (`complexity`, `max-depth`, `max-params`, `max-lines` set to `warn` at 350), `test/architecture/solid-architecture.test.ts`, `test/architecture/lsp-contracts.test.ts`, `npm run check:solid`, and single-job `concurrency`-enabled `.github/workflows/ci.yml`.

## Verification
- `npm run check:solid` (`npm run lint && npm run typecheck && npm run test:arch`): passed with 0 ESLint errors/warnings, 0 TypeScript errors, and 3 architecture suites (50 tests) passing.
- `npm test`: all 9 test suites passed (93 tests total).

## AI usage
Antigravity (Gemini 4 Neon) audited the repository for Clean Architecture layer segregation and SOLID compliance, planned the refactoring and automated SOLID CI gates, and implemented the changes across `src/`, `test/`, `eslint.config.js`, `package.json`, and `.github/workflows/ci.yml`.
