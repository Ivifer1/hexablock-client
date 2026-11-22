# Change record: feat/engine-rules-contracts

Status: IMPLEMENTED
Author(s): Sebastián Llambí (llamb1315) with Antigravity (Google DeepMind)
Date: 2026-11-22
Approver: Sebastián Llambí (Human Lead) — Explicit approval of IGameRules, BaseGameState, IScoringPolicy, and Turn Lifecycle.

## Spec and traceability
- Use cases: UC-001 (Start a game), UC-002 (Apply a move)
- Requirements: FR-004, FR-005, FR-006, FR-007, FR-009, FR-010, FR-012, FR-014, FR-015, FR-016, FR-017, FR-019, FR-020, FR-021, FR-022, NFR-001, NFR-002, NFR-004, C-001, C-002, C-003, C-004, C-005, C-006
- Business rules covered: BR-002-1 (Rules-based validation), BR-002-2 (Rules-driven change), BR-002-4 (Variant independence via generics), BR-002-5 (Line clearance scoring), BR-002-6 (Coverage victory), BR-002-7 (Cascade transfer), BR-002-8 (Slide and merge)

## Problem
The generic engine requires formal contracts to govern turn execution, rule validation, cascade resolution, victory/defeat evaluation, and scoring policies without hardcoding variant differences into the engine. Previous designs were ambiguous regarding the structure of `TState`, leading to uncertainty about what information every state snapshot holds.

## Proposed design
We define domain contracts and base interfaces under `src/domain/rules/`:
- `GameStatus`: Enum (`PLAYING`, `WON`, `LOST`).
- `BaseGameState<TCell>`: Unified base interface defining what all game states share (`board: HexBoard<TCell>`, `score: number`, `moveCount: number`, `status: GameStatus`).
- `GameEvent`: Domain event emitted during resolution (`LINES_CLEARED`, `TILES_MERGED`, `STACK_COMPLETED`).
- `ResolutionResult<TState>`: Pair of `{ nextState: TState; events: readonly GameEvent[] }`.
- `IGameRules<TCell, TMove, TState extends BaseGameState<TCell>>`: Core GoF Strategy defining the 4-phase turn lifecycle (`isValidMove`, `applyMove`, `resolve`, `evaluateStatus`, `hasValidMoves`).
- `IScoringPolicy<TState extends BaseGameState<any>>`: Strategy calculating points, multipliers, and star ratings from turn transitions.
- Test Doubles in `test/_support/`:
  - `FakeMove`, `FakeGameState`, `FakeGameRules`, `FakeScoringPolicy`.

| Type | DDD Pattern | Layer | Responsibility |
| --- | --- | --- | --- |
| `GameStatus` | Value Object / Enum | Domain | Represents current lifecycle status of a game. |
| `BaseGameState<TCell>` | Value Object / Interface | Domain | Unified contract for game state snapshots containing board, score, move count, and status. |
| `GameEvent` | Domain Event | Domain | Immutable event describing reactions occurring during a turn. |
| `ResolutionResult<TState>` | Value Object | Domain | Encapsulates post-cascade state and emitted events. |
| `IGameRules<TCell, TMove, TState>` | Strategy Interface | Domain | Governs game mechanics through a 4-phase deterministic turn loop. |
| `IScoringPolicy<TState>` | Strategy Interface | Domain | Pure mathematical evaluator for points, multipliers, and level stars. |

## Clean Architecture
- Resides strictly in **Layer 1 (Domain / Entities)** under `src/domain/rules/`.
- Depends only on `src/domain/board/hex-board.ts` and `src/domain/topology/**`.
- Zero outward imports to outer layers or frameworks.

## SOLID
- **SRP:** `IGameRules` handles mechanics only; `IScoringPolicy` handles points/stars only; `BaseGameState` holds state only.
- **OCP:** A new variant introduces a new implementation of `IGameRules` and `IScoringPolicy` without modifying existing engine code.
- **LSP:** Every rule implementation satisfies the identical 4-phase contract.
- **ISP:** Clean separation between movement rules, scoring, and piece generation.
- **DIP:** Engine depends on `IGameRules` and `IScoringPolicy` abstractions.

## Design patterns
| Pattern | Participants | Problem it solves here | Simpler alternative rejected and why |
| --- | --- | --- | --- |
| **Strategy (GoF)** | `IGameRules`, `IScoringPolicy` | Decouples variant rules from the generic engine loop. | `if/switch` statements on variant type: violates OCP and bloats engine. |
| **Domain Event** | `GameEvent` | Decouples cascade side-effects (combos, sounds) from engine execution. | Inlining scoring into rules: violates SRP and prevents scoring customization. |

## Extensibility and infrastructure independence
- Adding a 5th variant: Define `MyState extends BaseGameState<MyCell>`, `MyRules implements IGameRules`, `MyScoring implements IScoringPolicy`. Zero modifications to `GameEngine` or existing variants.

## Test plan
| Spec element | Test name (`should_…_when_…`) | Level |
| --- | --- | --- |
| BR-002-1 | `should_validate_legal_moves_and_reject_illegal_moves` | Unit |
| BR-002-2 | `should_produce_new_immutable_state_when_applying_move` | Unit |
| BR-002-4, BR-002-5 | `should_resolve_cascades_and_emit_game_events_when_resolved` | Unit |
| FR-010, FR-017, FR-021 | `should_transition_status_to_won_when_victory_condition_is_met` | Unit |
| FR-006, FR-017, FR-021 | `should_transition_status_to_lost_when_no_valid_moves_remain` | Unit |
| FR-007, FR-022 | `should_calculate_score_and_multipliers_from_turn_events` | Unit |

## Implementation notes
Implemented domain rules contracts under Layer 1 (`src/domain/rules/`):
- `src/domain/rules/game-status.ts`: Domain enum `GameStatus` (`PLAYING`, `WON`, `LOST`).
- `src/domain/rules/game-event.ts`: Domain Event interface `GameEvent` with semantic type and optional readonly payload.
- `src/domain/rules/game-state.ts`: Unified base interface `BaseGameState<TCell>` (`board`, `score`, `moveCount`, `status`).
- `src/domain/rules/resolution-result.ts`: Value object `ResolutionResult<TState>` pairing next state with emitted events.
- `src/domain/rules/igame-rules.ts`: Core Strategy `IGameRules<TCell, TMove, TState extends BaseGameState<TCell>>` defining the 4-phase turn lifecycle.
- `src/domain/rules/iscoring-policy.ts`: Pure Strategy `IScoringPolicy<TState>` evaluating points, multipliers, and level stars.
- `src/domain/rules/index.ts`: Barrel export.
- Test Doubles under `test/_support/`: `FakeMove`, `FakeGameState`, `FakeGameRules`, `FakeScoringPolicy`.
- Master diagram synchronization: Updated `docs/diagrams/class-diagram.drawio` (tab C4) and `docs/class-diagram-viewer.html` (Tab 2).

## Verification
- `npm test`: 8 test suites passed, 65 tests passed (100% green, including 6 new tests in `test/domain/rules/game-rules.test.ts`).
- `npm run typecheck`: Passed with 0 errors.
- `npm run lint`: Passed with 0 warnings, 0 errors.
- `test/architecture/layer-boundaries.test.ts`: Passed, zero layer boundary violations.

## AI usage
- **Tool and model:** Antigravity (Google DeepMind) with Gemini 2.5 Pro.
- **Task & prompts:**
  - "no entiendo porque estamos haciendo el tstate, no podrian ser simplemente estados y ya?"
  - "si ya ahota si, dame la propuesta de diseño de esto otra vez"
  - "dale y recuerda modificar los diagramas para que coincidan"
- **Result:**
  - Resolved architectural confusion around `TState` by establishing `BaseGameState<TCell>`.
  - Implemented pure domain contracts for `IGameRules`, `IScoringPolicy`, and Turn Lifecycle.
  - Synchronized `class-diagram.drawio` (tab C4) and interactive viewer `class-diagram-viewer.html`.
- **AI Anomalies / Corrections caught by human:**
  - Human rightly challenged the abstract usage of `TState`, leading to the concrete foundation of `BaseGameState<TCell>` which gives compile-time certainty of state properties across all variants.
- **Lessons learned:**
  - Generic parameters in domain contracts should always have bounded base constraints (e.g. `TState extends BaseGameState<TCell>`) to ensure mandatory properties are never lost.
