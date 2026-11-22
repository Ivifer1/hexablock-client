# Change record: feat/engine-hex-board

Status: IMPLEMENTED
Author(s): Sebastián Llambí (llamb1315) with Antigravity (Google DeepMind)
Date: 2026-11-22
Approver: Sebastián Llambí (Human Lead) — Explicit approval of HexBoard aggregate root, invariants, and testing architecture.

## Spec and traceability
- Use cases: UC-001 (Start a game), UC-002 (Apply a move), UC-003 (Undo/Redo move)
- Requirements: FR-003, FR-004, FR-005, FR-008, FR-009, FR-014, FR-015, FR-019, FR-020, NFR-001, NFR-002, C-001, C-002, C-003, C-004, C-005, C-006
- Business rules covered: BR-001-3 (Board contains only cells included by its BoardShape), BR-002-1 (Valid move state transition), BR-002-2 (Rules-driven change), BR-002-4 (Variant independence via generics), BR-002-5 (3-axis line detection for Hexa Lines)

## Problem
The domain engine needs a generic board structure that maps spatial coordinates to game cell contents (`TCell`) across all four variants (Colors in Lines, Piece IDs in Fit, Stacks in Sort, Numbers in Merge).
To support deterministic undo/redo (UC-003) and clean architectural state management, the board must be strictly immutable: operations must return new board instances rather than mutating state in-place.
Furthermore, the board must validate placement invariants against an injected `IBoardShape<HexCoord>` and provide spatial line queries across the three hexagonal axes (Q, R, S) for line clearing in Hexa Lines.

## Proposed design
We introduce `HexBoard<TCell>` under `src/domain/board/hex-board.ts` adhering to **Tactical DDD** and **Ubiquitous Language**:
- **Entity / Aggregate Root:** `HexBoard<TCell>` encapsulates the board state, maintaining an internal immutable map of cell contents indexed by coordinate keys.
- **Value Objects:** `HexCoord`, `BoardShape`, `HexAxis`, `HexDirection` (from `src/domain/topology/`).
- **Testing Architecture:** Setup `test/_support/` containing `FakeCell` and `BoardMother` to prevent test fragility and decouple tests from internal constructors.

| Type | DDD Tactical Pattern | Layer | Responsibility |
| --- | --- | --- | --- |
| `HexBoard<TCell>` | Entity / Aggregate Root | Domain (Entities) | Represents an immutable game board with cell contents of type `TCell`, bound to an `IBoardShape`. Enforces boundary invariants, supports functional transformations (`setCell`, `clearCell`, `clear`), and provides spatial line queries. |
| `BoardCellEntry<TCell>` | Value Object / Interface | Domain (Entities) | Readonly pair `{ readonly coord: HexCoord; readonly content: TCell }` representing an occupied cell. |
| `FakeCell` | Test Double | Test Support | Neutral dummy cell type for testing `HexBoard<TCell>` independently of game variants. |
| `BoardMother` | Object Mother (GoF / DDD) | Test Support | Centralized test fixture builder for creating standard and pre-populated test boards. |

## Clean Architecture
- **Layer 1 (Domain)** only: `src/domain/board/hex-board.ts`.
- **Inward dependencies only**: Depends exclusively on `src/domain/topology/**` (same layer).
- **Zero outward imports**: No imports from `application/`, `infrastructure/`, `presentation/`, or external frameworks.
- **Test isolation**: Generic board tests reside in `test/domain/board/hex-board.test.ts` using `FakeCell` from `test/_support/fake-cell.ts`.

## SOLID
- **SRP (Single Responsibility Principle):**
  - `HexBoard<TCell>` is solely responsible for associating valid board coordinates with cell contents, enforcing boundaries, and spatial queries. It does NOT decide scoring, turn validation, or win/loss rules.
- **OCP (Open/Closed Principle):**
  - Parameterized with `TCell`. New variants introduce new cell types without altering `HexBoard`.
  - Uses `IBoardShape<HexCoord>` and `ITopology<HexCoord, HexDirection>`, decoupling the board from hardcoded dimensions.
- **LSP (Liskov Substitution Principle):**
  - Generic operations behave consistently regardless of the concrete `TCell` type supplied.
- **ISP (Interface Segregation Principle):**
  - Read queries and state transformations are cohesive and minimal.
- **DIP (Dependency Inversion Principle):**
  - Depends on `IBoardShape<HexCoord>` and `ITopology<HexCoord, HexDirection>` abstractions rather than concrete UI layouts.

## Design patterns
| Pattern | Participants | Problem it solves here | Simpler alternative rejected and why |
| --- | --- | --- | --- |
| **Immutable Snapshot (DDD / Memento)** | `HexBoard<TCell>` | `setCell`/`clearCell` return new board instances, ensuring previous states remain unchanged for Undo/Redo (UC-003). | In-place mutation: Causes state corruption, complex rollback logic, and bugs in time-travel/undo. |
| **Strategy (GoF)** | `ITopology` in `HexBoard` | Delegates neighbor and line raycasting calculations to the topology strategy. | Duplicating raycasting logic inside the board: violates DRY. |
| **Object Mother (Testing Pattern)** | `BoardMother` | Provides pre-configured test board instances (`aRadius2Board()`, `aRadius4Board()`, `withCell(...)`). | Inlining `new HexBoard(...)` in every test: causes widespread test breakages when constructors evolve. |

## Extensibility and infrastructure independence
- **To add a 5th variant (e.g. Hexa Fill):**
  - Instantiate `HexBoard<FillCell>(customShape)` where `FillCell` is the variant's domain cell type.
  - Zero edits to `HexBoard<TCell>` or existing code.
- **Files that would NOT change:**
  - `src/domain/board/hex-board.ts`
  - `src/domain/topology/**`

## Test plan
| Spec element (flow / BR) | Test name (`should_…_when_…`) | Level |
| --- | --- | --- |
| BR-001-3, C-001 | `should_create_empty_board_matching_shape_cell_count_when_initialized` | Unit |
| BR-001-3 | `should_throw_domain_error_when_setting_cell_outside_board_shape` | Unit |
| UC-002, UC-003 | `should_return_new_board_instance_without_mutating_original_when_cell_is_set` | Unit |
| UC-003 | `should_return_new_board_instance_without_mutating_original_when_cell_is_cleared` | Unit |
| UC-001 | `should_return_empty_board_when_cleared` | Unit |
| Entity Model | `should_identify_empty_and_occupied_cells_accurately` | Unit |
| FR-014, FR-017 | `should_report_full_board_when_all_cells_are_occupied` | Unit |
| Entity Model | `should_retrieve_all_occupied_cells_and_empty_coords` | Unit |
| FR-005, BR-002-5 | `should_extract_all_parallel_lines_along_q_axis_when_querying_q_axis` | Unit |
| FR-005, BR-002-5 | `should_extract_all_parallel_lines_along_r_axis_when_querying_r_axis` | Unit |
| FR-005, BR-002-5 | `should_extract_all_parallel_lines_along_s_axis_when_querying_s_axis` | Unit |
| FR-005 | `should_return_cells_in_sorted_spatial_order_within_each_line` | Unit |

## Open questions for the team
- None. `HexBoard<TCell>` represents pure cell-content association on top of the approved topology.

## Implementation notes
Implemented the generic board module under Layer 1 (`src/domain/board/`):
- `src/domain/board/hex-board.ts`: Immutable Aggregate Root `HexBoard<TCell>` protecting 5 core domain invariants:
  1. Boundary containment: Throws domain exception when placing content outside `shape.contains(coord)`.
  2. Mathematical balance: `occupiedCount + emptyCount === cellCount` holds at all times.
  3. Memento/Pure State: `setCell`, `clearCell`, `setCells`, and `clear` return new `HexBoard<TCell>` instances.
  4. Confined line projection: `getLinesOnAxis(axis)` extracts sorted, bounded parallel cell lines on Q, R, and S axes for Hexa Lines combos.
  5. Variant agnosticism: Works over any bounded `TCell` generic.
- `src/domain/board/index.ts`: Barrel export.
- `test/_support/fake-cell.ts`: Neutral `FakeCell` test fixture.
- `test/_support/board-mother.ts`: `BoardMother` Object Mother for resilient test instantiation.

## Verification
- `npm test`: 7 test suites passed, 57 tests passed (including `test/domain/board/hex-board.test.ts` with 12 tests).
- `npm run typecheck`: Passed with 0 errors (strict mode).
- `npm run lint`: Passed with 0 warnings and 0 errors (`@typescript-eslint/array-type` satisfied).
- `test/architecture/layer-boundaries.test.ts`: Clean Architecture layer boundaries preserved 100%.

## AI usage
- **Tool and model:** Antigravity (Google DeepMind) with Gemini 2.5 Pro.
- **Task & prompts:**
  - "ok apruebo tu diseño implementa, Y mira si ves cambios o cosas a mejorar de nuestro diagrama que pase dimelo para que lo vayas cambiando también, no tomes ese diagrama como fuente de la verdad"
- **Result:**
  - Implemented `HexBoard<TCell>` Aggregate Root with 12 unit tests and test support infrastructure (`FakeCell`, `BoardMother`).
- **AI Anomalies / Corrections caught by human & verification:**
  1. *ESLint array-type warning:* Initial implementation used `ReadonlyArray<T>`, which triggered lint warnings in the strict configuration requiring `readonly T[]`. Corrected across all signatures.
  2. *Aggregate Invariants clarification:* Human requested explicit explanation of what the aggregate contains and what invariants it guarantees before code execution, reinforcing DDD boundaries.
- **Lessons learned:**
  - Aggregate Roots must protect boundary and mathematical invariants within their constructors and mutation factories, preventing illegal states from ever reaching outer layers.
