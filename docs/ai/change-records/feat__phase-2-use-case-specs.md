# Change record: feat/phase-2-use-case-specs

Status: PROPOSED
<!-- Only a human changes this line to "Status: APPROVED" (hooks block the agent from editing it). -->
Author(s): Leoibarrapp with Copilot
Date: 2026-11-22

## Spec and traceability
- Use cases: UC-001, UC-002, UC-003, UC-004.
- Requirements: FR-003 through FR-026, NFR-001 through NFR-004, C-001 through C-007.
- Business rules: BR-001-1 through BR-004-5.

## Problem
Fase 1 established the application/adapter/infrastructure boundary but does not implement a board, game engine or gameplay flow. Fase 2 must add the generic engine and the first use cases without importing React Native or concrete variants.

The home screen also needs a concrete design handoff for `docs/ui-context/01-inicio.md`. The mockup establishes a 360 px mobile composition, a hexagonal mode selector and a selected-mode action card. The local design token catalog establishes typography, spacing, radius, color and theme variables.

## Proposed design
Implement a generic core with immutable state and injected strategies. One generic use case will handle moves for every variant. Concrete variants will supply board setup, move validation, state transitions, scoring and history policy.

| Type | Kind | Layer | Responsibility |
| --- | --- | --- | --- |
| `HexCoord` | value object | domain | Represents one axial hex-grid coordinate. |
| `HexBoard<TCell>` | entity | domain | Stores a `BoardShape` and immutable cell contents. |
| `IGameRules<TCell,TMove,TState>` | interface | domain | Provides validation and state transition strategies. |
| `GameEngine<TCell,TMove,TState>` | class | domain | Orchestrates one move against board/rules/scoring strategies. |
| `IPieceSource<TPiece>` | interface | domain | Supplies pieces or stacks without framework or storage coupling. |
| `IScoringPolicy<TState>` | interface | domain | Calculates score and terminal result for a state. |
| `IHistoryPolicy` | interface | application | Supplies variant-specific undo/redo behavior. |
| `IRandomSource` | interface | application | Produces seeded random values. |
| `IProgressRepository` | interface | application | Saves and loads `Progress` in intent-based terms. |
| `StartGameUseCase` | class | application | Builds an initial state through the configured factory and strategies. |
| `ApplyMoveUseCase<TCell,TMove,TState>` | class | application | Validates and applies one move. |
| `UndoRedoUseCase<TState>` | class | application | Restores snapshots through `IHistoryPolicy`. |
| `RecordProgressUseCase` | class | application | Updates `Progress` and delegates persistence. |

## Clean Architecture
- `domain` will depend on no outer layer and no framework package.
- `application` will depend on `domain` and declare ports for randomness and progress.
- `adapters` will map domain snapshots to existing application DTOs and implement repositories.
- `infrastructure` will own the composition root, seeded random adapter and concrete variant registrations.
- React Native UI will implement output ports and emit input intent; no domain or use case object is imported by UI.

## SOLID
- **SRP:** `HexBoard` stores board data, `GameEngine` orchestrates, and each rules/scoring strategy owns one concrete behavior.
- **OCP:** variant rules extend through implementations and factory registrations; the generic engine is not modified for a fifth variant.
- **LSP:** every `IGameRules` implementation accepts and returns only the contract's state/move types and never raises a placeholder exception.
- **ISP:** small ports separate random generation, progress persistence and history behavior.
- **DIP:** use cases depend on application/domain abstractions; adapters and infrastructure supply implementations.

## Design patterns
| Pattern | Participants | Problem it solves here | Simpler alternative rejected |
| --- | --- | --- | --- |
| Strategy | `IGameRules`, `IScoringPolicy`, `IHistoryPolicy` | Isolates variant differences from the generic engine. | Variant `if/switch` statements in `GameEngine` or use cases. |
| Template/Generic Engine | `GameEngine<TCell,TMove,TState>` | Reuses movement, history and state orchestration. | Copying four independent engines. |
| Abstract Factory | one variant factory per variant | Creates board/rules/pieces/scoring consistently. | Direct concrete construction in use cases or UI. |
| Adapter | progress/randomness implementations | Separates persistence and random libraries from inner layers. | Direct AsyncStorage or random calls in domain/application. |
| Decorator/AOP | logging/timing decorators over generic use cases | Adds cross-cutting behavior without business-code catches or logs. | Console calls and try/catch inside use cases. |

## Home screen design handoff
The `01-inicio.md` implementation will follow the attached 360 px mockup:

- Header with HexaBlock mark and settings action.
- Rotating hex selector in the center; selected mode at top and Lines/Merge/Fit/Sort around it.
- One selected-mode detail card below, containing name, entry-kind badge, description, progress chip and primary action.
- Session entry remains conditioned by P-18 and is omitted from the mandatory first implementation if the scope stays undecided.
- A fifth mode is rendered from the same descriptor list and does not alter layout code.

The existing CSS tokens will be used by React Native adapters as equivalent values:
- cream background / surface / text-primary
- indigo primary
- Lines cyan, Fit amber, Sort violet, Merge emerald
- 44 px minimum touch targets
- 360 px minimum supported width
- 24 px, 32 px and 40 px spacing groups

Figma MCP access returned the Starter-plan call limit. This proposal does not claim exact component names or library assets from Figma. The local `01-inicio.md`, local CSS tokens and attached mockup are the review source until Figma access is available.

## Extensibility and infrastructure independence
- A fifth variant adds one factory, one rules implementation, one piece source/scoring setup and one registration.
- Existing `HexBoard`, `GameEngine`, use cases and home layout remain unchanged.
- A scoring or history-rule change replaces or adds a strategy and does not edit the generic engine.
- React Native, Expo, storage and network implementations can change without changing domain/application behavior.

## Alternatives considered
- Four variant-specific engines were rejected because they duplicate board and game-flow behavior.
- UI-driven variant switches were rejected because they violate OCP and leak game rules into infrastructure.
- Immediate Figma code import was rejected because it cannot be validated against the Starter-plan call limit and would bypass existing React Native architecture.

## Test plan
| Spec element | Test name | Level |
| --- | --- | --- |
| UC-001 | `should_create_reproducible_initial_state_when_seed_and_configuration_are_valid` | unit |
| UC-001 | `should_leave_game_unstarted_when_configuration_is_invalid` | unit |
| UC-002 | `should_reject_move_when_rules_disallow_it` | unit |
| UC-002 | `should_not_mutate_previous_state_when_move_is_applied` | unit |
| UC-002 | `should_request_random_content_when_seeded_rules_accept_move` | unit |
| UC-003 | `should_restore_previous_snapshot_when_unlimited_history_is_available` | unit |
| UC-003 | `should_restore_no_snapshot_when_one_move_history_is_empty` | unit |
| UC-004 | `should_save_progress_when_terminal_result_is_completed` | unit |
| UC-004 | `should_not_save_completion_when_level_is_defeated` | unit |
| Home design | `should_render_four_mode_descriptors_without_variant_specific_layout_code` | UI |
| Home design | `should_render_added_fifth_mode_when_descriptor_is_registered` | UI |
| Home design | `should_remain_readable_when_viewport_is_360_px_in_each_language` | UI |
| Architecture | `should_reject_outer_imports_from_domain_and_application` | architecture |

## Open questions for the team
- Select the exact scoring, Lines combo, Sort cascade and Fit star formulas before implementation tests are written.
- Decide undo behavior for Lines and Sort.
- Decide whether a Merge tile can merge more than once per move and whether the target is configurable.
- Decide P-18 for the login/session indicator on the home screen.
- Decide whether Figma MCP access should be restored before exact component-library mapping.

## Implementation notes
Pending approval.

## Verification
Pending approval.

## AI usage
Pending approval.
