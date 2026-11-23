# Change record: feat/engine-game-engine

Status: PROPOSED
Author(s): Sebastián Llambí (llamb1315) with Antigravity (Google DeepMind)
Date: 2026-11-22
Approver: Sebastián Llambí (Human Lead) — Pending review for next session

## Spec and traceability
- Use cases:
  - UC-001 (Start a game)
  - UC-002 (Apply a move & turn lifecycle)
  - UC-003 (Undo / Redo move with anti-cheat PRNG restoration)
  - UC-004 (Game status transition & score updates)
- Requirements: C-001 (Generic engine aggregate), C-004 (Clean Architecture layer boundaries), NFR-001 (Deterministic execution)
- Constraints: Turn lifecycle phases (Validation -> Execution -> Resolution -> Scoring -> Evaluation)

## Problem
Now that the hexagonal topology (`HexCoord`, `HexBoard`), domain rules contracts (`IGameRules`, `IScoringPolicy`, `BaseGameState`), and piece/random generators (`IPieceSource`, `IRandom`) are implemented and verified (83 tests green), the engine needs its central **Aggregate Root**: `GameEngine<TCell, TMove, TState extends BaseGameState<TCell>>`.

The engine must orchestrate the 4-phase turn lifecycle and manage the history of moves (`MoveHistory`) using GoF Command / Memento patterns to allow deterministic Undo and Redo without save-scumming.

## Proposed design
Introduce two central components in Layer 1 (`src/domain/engine/`):

1. `MoveOutcome<TState extends BaseGameState<unknown>>`:
   - Value object returned by `applyMove`, `undo`, and `redo`.
   - Fields: `readonly success: boolean`, `readonly state: TState`, `readonly events: readonly GameEvent[]`, `readonly error?: string`.

2. `MoveHistory<TMove, TState extends BaseGameState<unknown>>`:
   - Memento / Command manager maintaining `undoStack` and `redoStack`.
   - Stores move commands with their captured state snapshot and PRNG state snapshot (`IRandom.snapshot()`).
   - Clears `redoStack` on each newly applied valid move.

3. `GameEngine<TCell, TMove, TState extends BaseGameState<TCell>>`:
   - Aggregate Root encapsulating game lifecycle.
   - Collaborators (injected via constructor):
     - `rules: IGameRules<TCell, TMove, TState>`
     - `scoring: IScoringPolicy<TState>`
     - `pieceSource?: IPieceSource<unknown>`
     - `random?: IRandom`
     - `maxUndoSteps?: number`
   - Public API:
     - `start(initialState: TState): void`
     - `applyMove(move: TMove): MoveOutcome<TState>`
     - `undo(): MoveOutcome<TState>`
     - `redo(): MoveOutcome<TState>`
     - `getState(): TState`
     - `canUndo(): boolean`
     - `canRedo(): boolean`

| Type | DDD Pattern | Layer | Responsibility |
| --- | --- | --- | --- |
| `GameEngine` | Aggregate Root | Domain (`src/domain/engine`) | Orchestrates the turn lifecycle, enforces invariants, manages state transitions and history. |
| `MoveOutcome` | Value Object | Domain (`src/domain/engine`) | Immutable snapshot of turn execution results (success, new state, domain events, errors). |
| `MoveHistory` | Entity / Memento Manager | Domain (`src/domain/engine`) | Manages undo/redo stacks, capturing state and PRNG snapshots to prevent anti-cheat exploits. |

## Clean Architecture & SOLID
- **Layer 1 (Domain / Entities)**: Pure TypeScript, zero outward dependencies.
- **SRP**: `GameEngine` orchestrates lifecycle; `IGameRules` enforces legality/resolutions; `IScoringPolicy` computes score; `MoveHistory` manages stacks.
- **OCP**: Works for all 4 variants (Hexa Lines, Hexa Fit, Hexa Sort, Hexa Merge) without modification.
- **LSP & DIP**: High-level engine depends strictly on interfaces (`IGameRules`, `IScoringPolicy`, `IRandom`, `IPieceSource`).

## Test plan
| Spec element | Test name (`should_…_when_…`) | Level |
| --- | --- | --- |
| UC-001 | `should_initialize_game_state_when_start_is_called` | Unit |
| UC-002 | `should_reject_invalid_move_and_preserve_state_when_rules_declare_invalid` | Unit |
| UC-002 | `should_execute_turn_lifecycle_and_accumulate_score_when_move_is_valid` | Unit |
| UC-002 | `should_emit_domain_events_in_outcome_when_move_generates_events` | Unit |
| UC-003 | `should_restore_previous_state_and_prng_seed_when_undo_is_called` | Unit |
| UC-003 | `should_reapply_undone_move_when_redo_is_called` | Unit |
| UC-003 | `should_clear_redo_stack_when_new_move_is_applied_after_undo` | Unit |
| UC-004 | `should_transition_status_to_won_or_lost_when_evaluation_signals_terminal` | Unit |

## Status for Next Session
- **Status:** PROPOSED (Awaiting Sebastián's review and approval).
- **Branch:** Prepare `feat/engine-game-engine` from `feat/engine-pieces-random`.
