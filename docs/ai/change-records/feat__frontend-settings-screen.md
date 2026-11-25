# Change record: feat/frontend-settings-screen

Status: PROPOSED
<!-- Only a human changes this line to "Status: APPROVED" (hooks block the agent from doing it). -->
Author(s): Leonardo Ibarra with Antigravity (Gemini 4 Neon)
Date: 2026-11-25

## Spec and traceability
- Use cases: UC-007 (and integration with UC-005, UC-006)
- Requirements: FR-027, FR-028, FR-029, C-004, C-008
- Business rules covered: BR-007-1 through BR-007-10
- Screen & text specs: `docs/specs/screens/02-ajustes.md` (`AJU-01`–`AJU-06`), `docs/specs/screens/10-textos.md`

## Problem
The `02 · Ajustes` screen (`UC-007`) was not implemented yet: players could navigate to Settings from Home (`UC-006`) only via a no-op destination, with no reactive audio/theme/locale/account state, no live language controller, and no persistence rollback handling. In addition, primary menu screens needed a shared decorative background and fixed-header layout shell so Settings and Home share identical safe-area margins, header alignment, and downward-only body scrolling.

## Proposed design
Introduce application ports and DTOs for Settings and dynamic locale switching, implement state-holder/presenter/controller adapters in `src/adapters/`, extract reusable primary-menu layout primitives (`MenuBackground` and `MenuScreenShell`) in `src/infrastructure/ui/`, implement `SettingsScreen` + modular cards in `src/infrastructure/settings/`, and wire everything in `CompositionRoot` and `App.tsx`.

| Type | Kind (class, interface, port, decorator…) | Layer | Responsibility (one sentence) |
| --- | --- | --- | --- |
| `SettingsViewDTO`, `SettingsSessionDTO`, `LocaleOptionDTO` | DTOs / Value Objects | Application | Carry plain view data for Settings without framework or adapter types |
| `ISettingsOutputPort` | Output Port | Application | Deliver updated `SettingsViewDTO` snapshots from adapters to UI |
| `IAudioSettingsPreference`, `IAudioEnginePort` | Ports | Application | Persist music/SFX preferences and apply immediate audio side effects |
| `ILocaleCatalog`, `ILocalePreference`, `ILocaleController` | Ports | Application | List supported locales, persist selection, and broadcast live locale changes |
| `ISessionActionsPort`, `ISettingsNavigationPort` | Ports | Application | Abstract sign-out mutations and back/login navigation from Settings |
| `ISettingsPreferencesController`, `ISettingsAccountController` | Input Ports | Application | Segregate preference toggles/locale selection from account session actions |
| `SettingsOutputStore` | Output Store Adapter | Adapters | Observable `SettingsViewDTO` store extending `ObservableViewStore` |
| `StaticLocaleCatalog` | i18n Adapter | Adapters | Serve configured `LocaleDescriptor` entries for dynamic language rendering |
| `LocaleController` | Presentation Adapter | Adapters | Validate, persist, roll back on failure, and publish `LocaleCode` updates |
| `SettingsStateHolder` | Presentation Adapter | Adapters | Hold mutable Settings snapshot state shared across segregated controllers |
| `SettingsPresenter` | Presenter Adapter | Adapters | Map `SettingsSnapshot`, `ILocaleCatalog`, and `IHomeSessionReader` into `SettingsViewDTO` |
| `SettingsPreferencesController` | Controller Adapter | Adapters | Handle music, SFX (with post-save confirmation), dark mode, and locale updates |
| `SettingsAccountController` | Controller Adapter | Adapters | Handle login navigation and two-step logout confirmation/cancellation |
| `InMemoryAudioSettingsPreference`, `InMemoryLocalePreference`, `InMemorySessionActions`, `NoopAudioEngine` | Default Adapters | Adapters | Provide deterministic in-memory/no-op defaults testable without device APIs |
| `MenuBackground`, `MenuScreenShell` | Shared UI Primitives | Infrastructure | Standardize primary-menu decorative background, margins, fixed header, and scroll |
| `SettingsScreen` + `src/infrastructure/settings/*` | React Native UI | Infrastructure | Render Account, Audio, Appearance, Language, ErrorBanner, LogoutDialog, and footer |
| `useLocale`, `settingsTranslations.ts`, `SettingsIcons.tsx` | Infrastructure Helpers | Infrastructure | Subscribe to `ILocaleController`, provide ES/EN strings, and render flat SVG icons |

## Clean Architecture
- Dependency directions introduced: `infrastructure -> adapters -> application -> domain` (all pointing inwards).
- Ports declared in `src/application/ports/` (`IAudioEnginePort`, `IAudioSettingsPreference`, `ILocaleCatalog`, `ILocaleController`, `ILocalePreference`, `ISessionActionsPort`, `ISettingsAccountController`, `ISettingsNavigationPort`, `ISettingsPreferencesController`, `ISettingsOutputPort`) and implemented in `src/adapters/`.
- `SettingsScreen` and `HomeScreen` depend only on controller/catalog/theme interfaces and `SettingsViewDTO` / `HomeViewDTO`, never on concrete domain entities or persistence implementations.
- Wired in `src/infrastructure/CompositionRoot.ts` and `src/infrastructure/App.tsx`.

## SOLID
- **SRP:** `SettingsPreferencesController`, `SettingsAccountController`, `SettingsPresenter`, `SettingsStateHolder`, and `LocaleController` each have a single reason to change; UI is decomposed into focused cards (`SettingsAccountCard`, `SettingsAudioCard`, `SettingsAppearanceCard`, `SettingsLanguageCard`, `SettingsHeader`, `SettingsErrorBanner`, `SettingsLogoutDialog`, `SettingsToggleRow`) plus `MenuBackground` and `MenuScreenShell`.
- **OCP:** `SupportedLocale` is open (`string` + `KnownLocaleCode`) and `StaticLocaleCatalog` drives language options dynamically so adding a third language requires only catalog/translation registration without changing `SettingsPresenter`, `LocaleController`, or `SettingsLanguageCard`.
- **LSP:** Default in-memory/no-op adapters (`InMemoryAudioSettingsPreference`, `InMemoryLocalePreference`, `InMemorySessionActions`, `NoopAudioEngine`) satisfy the same contracts as real storage/audio adapters and are verified in `settings-presentation.test.ts` and `test/architecture/lsp-contracts.test.ts`.
- **ISP:** Preferences (`ISettingsPreferencesController`) and account actions (`ISettingsAccountController`) are separated so cards/callers depend only on the operations they use.
- **DIP:** Controllers and UI depend on abstract ports (`IAudioSettingsPreference`, `IAudioEnginePort`, `ILocaleCatalog`, `ILocalePreference`, `IThemeController`, `ISettingsNavigationPort`) injected through `CompositionRoot`.

## Design patterns
| Pattern | Participants (role → class) | Problem it solves here | Simpler alternative rejected and why |
| --- | --- | --- | --- |
| Observer | Subject → `SettingsOutputStore`, `LocaleController`, `ThemeController`; Observers → `App.tsx`, `useLocale`, `useTheme` | Immediate cross-screen theme and language updates without app restart | Local component state per screen; rejected because Home and Settings would fall out of sync |
| Strategy / Adapter Ports | Port → `IAudioSettingsPreference`, `ILocalePreference`, `IAudioEnginePort`; Strategies → in-memory/noop defaults (later AsyncStorage/Expo AV) | Keep persistence and audio swappable and deterministically testable | Direct `AsyncStorage` or `expo-av` calls inside controllers/UI; rejected because it violates Clean Architecture and complicates rollback tests |
| Composition Shell | Shell → `MenuScreenShell`, `MenuBackground`; Consumers → `HomeScreen`, `SettingsScreen` | Guarantee identical safe-area margins, header alignment, background, and scroll behavior across primary menus | Duplicating `SafeAreaView`/background/`ScrollView` per screen; rejected because Settings drifted visually from Home |

## Extensibility and infrastructure independence
- To add a third language, register `{ code, nativeName }` in `ILocaleCatalog` (`DEFAULT_LOCALES`) and add keys to `APP_TEXT_CATALOG`.
- Files that would NOT change: `SettingsPresenter.ts`, `LocaleController.ts`, `SettingsScreen.tsx`, `SettingsLanguageCard.tsx`, and all generic game-engine files (`src/domain/**`).
- Infrastructure that can be swapped without touching domain/application: `IAudioSettingsPreference`, `ILocalePreference`, `IThemePreference` (e.g. AsyncStorage), `IAudioEnginePort` (e.g. Expo AV), and `ISettingsNavigationPort` (React Navigation).

## Alternatives considered
- **Placing `SettingsHeader` inside `ScrollView`:** Simpler single container, but caused iOS automatic scroll insets and scrolling to shift the header out of alignment with Home. Rejected in favor of `MenuScreenShell` with a fixed header slot and downward-only `ScrollView` (`contentInsetAdjustmentBehavior="never"`).
- **Keeping `HomeAtmosphere` inside `src/infrastructure/home/`:** Required Settings to either duplicate blobs (missing hex pattern) or import from `home/`. Rejected in favor of extracting `MenuBackground` into `src/infrastructure/ui/`.

## Test plan
| Spec element (flow / BR) | Test name (`should_…_when_…`) | Level (unit / integration / e2e / UI) |
| --- | --- | --- |
| BR-007-1 (music mute) | `should_mute_music_immediately_when_music_toggle_is_turned_off` | Unit (`settings-presentation.test.ts`) |
| BR-007-1, BR-007-2, A1 (SFX + confirm) | `should_silence_without_confirmation_sfx_when_disabled_and_play_confirmation_when_enabled` | Unit (`settings-presentation.test.ts`) |
| E1, BR-007-7 (audio save rollback) | `should_rollback_audio_and_show_error_without_engine_side_effect_when_save_fails` | Unit (`settings-presentation.test.ts`) |
| BR-007-4, BR-007-5, BR-007-6 (OCP locale) | `should_switch_locale_immediately_and_support_third_locale_via_ocp` | Unit (`settings-presentation.test.ts`) |
| E1, BR-007-7 (locale save rollback) | `should_rollback_locale_and_present_error_when_locale_save_fails` | Unit (`settings-presentation.test.ts`) |
| BR-007-3 (theme sync) | `should_sync_theme_controller_when_dark_mode_is_toggled` | Unit (`settings-presentation.test.ts`) |
| A2, A3, A4, BR-007-8 (account flows) | `should_navigate_to_login_and_handle_logout_confirmation_flow_for_account` | Unit (`settings-presentation.test.ts`) |
| A5, BR-007-9, BR-007-10 (origin & footer) | `should_show_bottom_menu_only_for_home_origin_and_expose_version_footer` | Unit (`settings-presentation.test.ts`) |
| Composition wiring + 3rd locale | `should_wire_settings_controllers_locale_controller_and_third_locale_when_created` | Integration (`composition-root.test.ts`) |
| UI layout, Account first, footer, background | `should_render_header_account_first_audio_theme_language_version_footer_and_bottom_menu_from_home` | UI (`settings-screen.test.tsx`) |
| A5, BR-007-10 (PAUSE hides bottom menu) | `should_hide_bottom_menu_when_opened_from_pause` | UI (`settings-screen.test.tsx`) |
| Audio switches UI | `should_toggle_music_and_sfx_and_update_switch_state` | UI (`settings-screen.test.tsx`) |
| BR-007-3 (Home/Settings theme sync UI) | `should_toggle_dark_mode_and_sync_home_screen_theme` | UI (`settings-screen.test.tsx`) |
| BR-007-4, BR-007-5, BR-007-6 (live locale UI) | `should_update_all_texts_immediately_when_language_is_selected_and_render_third_locale` | UI (`settings-screen.test.tsx`) |
| A2, BR-007-8 (full-width Sign in CTA) | `should_render_home_styled_signin_button_for_guest_and_navigate_to_login` | UI (`settings-screen.test.tsx`) |
| A3, A4 (logout dialog + placeholder icon) | `should_confirm_before_signing_out_when_authenticated` | UI (`settings-screen.test.tsx`) |
| E1, BR-007-7 (UI error banner + rollback) | `should_show_error_banner_and_keep_previous_value_when_save_fails` | UI (`settings-screen.test.tsx`) |
| Main step 5/6 (header & Android back) | `should_go_back_when_header_back_button_or_android_hardware_back_is_pressed` | UI (`settings-screen.test.tsx`) |
| Menu shell header alignment & scroll | `should_keep_fixed_header_margins_aligned_with_home_and_scroll_only_body_downward` | UI (`settings-screen.test.tsx`) |

## Open questions for the team
- Confirm human approval of `UC-007-manage-settings.md` (`Draft` → `Approved`) and this change record (`Status: PROPOSED` → `Status: APPROVED`).
- Decide real persistence (`AsyncStorage`) and audio playback (`expo-av` / `expo-audio`) adapters in a dedicated infrastructure follow-up.
- Confirm final profile/avatar iconography once Login/Account (`03-login.md`, `P-18`) is integrated.

## Implementation notes
- Migrated Settings work from `wip/settings-backup` onto updated `dev` (`5d5cd8d`) on `feat/frontend-settings-screen`, resolving `CompositionRoot.ts` to keep `IHomePreview` from the Home redesign.
- Following live Expo validation on port `8082`, refined the UI by:
  - Moving `SettingsAccountCard` to the top, replacing the initial-letter avatar with a placeholder icon (`SessionActionIcon`), and using full-width `AppButton` for guest Sign In.
  - Moving the app version from `SettingsHeader` to a localized footer (`settings.version`) at the bottom of `SettingsScreen`.
  - Extracting `MenuBackground` and `MenuScreenShell` into `src/infrastructure/ui/` and adopting them across both `HomeScreen` and `SettingsScreen`.

## Verification
- `npm run lint` — 0 errors, 0 warnings.
- `npm run typecheck` — clean (`tsc --noEmit`).
- `npm run test:arch` — 3/3 suites, 55/55 tests passed.
- `npm test -- --runInBand --testPathIgnorePatterns=test/architecture` — 12/12 suites, 114/114 tests passed (15/15 suites, 169/169 tests total).

## AI usage
- Tool & model: Antigravity (Google) with Gemini 4 Neon.
- Prompts: Migrating WIP Settings onto updated `dev` (`5d5cd8d`), launching Expo for live validation, reordering Account first with placeholder icon and full-width Sign In button, moving version to footer, standardizing primary-menu background (`MenuBackground`), and fixing header/margin alignment and downward-only scroll (`MenuScreenShell`).
- Team modifications & AI anomalies caught: Human Expo review caught missing hex background overlay in Settings, header/margin drift from placing `SettingsHeader` inside `ScrollView`, and directed account-first layout, version footer placement, and `docs(agents)` PR-base rule enforcement.
