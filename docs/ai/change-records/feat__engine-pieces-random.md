# Change record: feat/engine-pieces-random

Status: IMPLEMENTED
Author(s): Sebastián Llambí (llamb1315) with Antigravity (Google DeepMind)
Date: 2026-11-22
Approver: Sebastián Llambí (Human Lead) — Explicit approval of IRandom, SeededRandom, IPieceSource, and takeBatch helper.

## Spec and traceability
- Use cases: UC-001 (Start a game), UC-002 (Apply a move), UC-003 (Undo/Redo move)
- Requirements: FR-003 (Hexa Lines tray of 3 pieces), FR-006 (Tray refill), FR-008 (Hexa Fit piece set), FR-014 (Hexa Sort offered stack), FR-020 (Hexa Merge random 2 or 4 tile spawn), NFR-001 (Injectable seeded randomness), C-001 (Generic engine IPieceSource), C-004 (Clean Architecture)
- Business rules covered: BR-001-2 (Deterministic configuration & seed), BR-002-3 (Randomness only via injected abstraction), BR-002-8 (Hexa Merge random tile spawn)

## Problem
Games require piece/tile provisioning, both deterministic and pseudo-random. Without an injectable `IRandom` abstraction, tests cannot reproduce random layouts deterministically (violating NFR-001). Furthermore, in games supporting Undo (UC-003), players could exploit undos to fish for better random pieces ("save scumming"). A stateful PRNG supporting `snapshot()` and `restore()` is required. Additionally, the engine needs `IPieceSource<TPiece>` to supply pieces across variants (randomly generated in Lines, predefined in Fit/Sort) without violating SRP or ISP.

## Proposed design
We introduce two focused modules in Layer 1 (Domain):
1. `src/domain/random/`:
   - `IRandom`: Domain port declaring `nextIndex(bound)`, `nextInt(min, max)`, `nextDouble()`, `snapshot()`, `restore(state)`.
   - `SeededRandom`: Pure deterministic PRNG implementing `IRandom` using the Mulberry32 algorithm (32-bit, zero npm dependencies).
2. `src/domain/pieces/`:
   - `IPieceSource<TPiece>`: Minimal GoF Iterator/Strategy contract (`hasNext()`, `next()`).
   - `takeBatch<TPiece>(source, count)`: Pure utility helper extracting $N$ items without polluting the `IPieceSource` interface (protecting SRP and ISP).
   - `RandomPieceSource<TPiece>`: Combines candidates array with `IRandom`.
   - `PredefinedPieceSource<TPiece>`: Provides a fixed sequential list of pieces for level-based variants.

| Type | DDD Pattern | Layer | Responsibility |
| --- | --- | --- | --- |
| `IRandom` | Domain Port / Strategy | Domain | Abstraction for deterministic pseudo-random number generation with state snapshotting. |
| `SeededRandom` | Domain Service / Strategy | Domain | Deterministic PRNG implementation using Mulberry32 algorithm. |
| `IPieceSource<TPiece>` | Strategy / Iterator | Domain | Minimal supplier contract for game pieces/tiles. |
| `takeBatch` | Pure Domain Function | Domain | Utility for extracting fixed-size batches from any `IPieceSource`. |
| `RandomPieceSource<TPiece>` | Strategy Implementation | Domain | Draws items at random using `IRandom`. |
| `PredefinedPieceSource<TPiece>` | Strategy Implementation | Domain | Supplies fixed, pre-ordered items without randomness. |

## Clean Architecture
- **Layer 1 (Domain / Entities)**: `src/domain/random/` and `src/domain/pieces/`.
- **Zero outward imports**: Zero dependencies on Node APIs, Math.random(), React, React Native, or Expo.
- Inward dependency rule preserved 100%.

## SOLID
- **SRP (Single Responsibility Principle):**
  - `IPieceSource` is strictly responsible for single-item iteration (`hasNext`, `next`). Batching logic is segregated into `takeBatch`.
  - `IRandom` is strictly responsible for random number mapping and state preservation.
- **OCP (Open/Closed Principle):**
  - New random algorithms (e.g. Xorshift) or new piece sources (e.g. streaming, procedural) implement the interfaces without modifying consumers.
- **LSP (Liskov Substitution Principle):**
  - `RandomPieceSource` and `PredefinedPieceSource` can be used interchangeably by any engine component expecting `IPieceSource<TPiece>`.
- **ISP (Interface Segregation Principle):**
  - `IPieceSource` is kept minimal with only 2 methods instead of forcing implementors to write batching loops.
- **DIP (Dependency Inversion Principle):**
  - Domain rules and the engine depend on `IRandom` and `IPieceSource<TPiece>`, never on concrete implementations or `Math.random()`.

## Test plan
| Spec element | Test name (`should_…_when_…`) | Level |
| --- | --- | --- |
| NFR-001 | `should_generate_identical_sequence_given_the_same_seed` | Unit |
| NFR-001 | `should_generate_different_sequences_for_different_seeds` | Unit |
| NFR-001 | `should_generate_integers_strictly_within_bounds_for_nextIndex` | Unit |
| NFR-001 | `should_generate_floats_within_zero_to_one_for_nextDouble` | Unit |
| UC-003, NFR-001 | `should_reproduce_exact_same_future_numbers_after_restoring_snapshot` | Unit |
| C-001 | `should_supply_pieces_randomly_from_candidates_using_random_source` | Unit |
| C-001 | `should_supply_predefined_pieces_in_exact_order_and_exhaust_cleanly` | Unit |
| FR-003 | `should_extract_requested_batch_size_using_takeBatch_helper` | Unit |

## Implementation notes
- Implemented `IRandom` port with `nextDouble()`, `nextIndex(bound)`, `nextInt(min, max)`, `snapshot()`, and `restore(state)` to ensure 100% determinism (NFR-001) and anti-cheat protection on Undo (UC-003).
- Implemented `SeededRandom` domain service implementing `IRandom` using the Mulberry32 32-bit algorithm with zero runtime dependencies.
- Implemented `IPieceSource<TPiece>` minimal interface contract (`hasNext()`, `next()`).
- Decoupled batch extraction into `takeBatch<TPiece>(source, count)` pure domain utility, following human feedback from Sebastián Llambí to protect SRP and ISP.
- Implemented `RandomPieceSource<TPiece>` with candidate array validation and `IRandom` integration.
- Implemented `PredefinedPieceSource<TPiece>` with sequential consumption and `remainingCount` getter.
- Synchronized Draw.io diagram (`docs/diagrams/class-diagram.drawio` tab C2) and interactive HTML viewer (`docs/class-diagram-viewer.html`).

## Verification
- Unit test suite: `test/domain/random/seeded-random.test.ts` (9 tests) and `test/domain/pieces/piece-source.test.ts` (8 tests).
- Total tests passing: 83 tests across 10 test suites (100% green).
- Static typecheck (`npm run typecheck`): 0 errors.
- ESLint verification (`npm run lint`): 0 errors, 0 warnings.
- Architecture test (`test/architecture/layer-boundaries.test.ts`): Layer 1 imports verified pure (0 outward dependencies).

## AI usage
- **Prompts:** "si todo me parece bien y la 2 pregunta si me gustaria incluir ese metodo aunque no se si viola SRP ... dale. Y en todo este trabajo has estado documentando en AI usage?"
- **Human anomaly catch & design correction:**
  - AI initially proposed placing `nextBatch(count)` directly on `IPieceSource`.
  - Human architect (Sebastián) caught that this violates the Single Responsibility Principle (SRP) and Interface Segregation Principle (ISP) by forcing every piece source implementation to provide batching logic.
  - Resolved by keeping `IPieceSource` strictly minimal (`hasNext`, `next`) and providing `takeBatch` as a pure, standalone domain utility.
  - Documented in `AI_USAGE.md` as a critical human-in-the-loop architectural oversight example.
