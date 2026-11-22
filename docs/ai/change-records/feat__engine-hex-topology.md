# Change record: feat/engine-hex-topology

Status: IMPLEMENTED
Author(s): Sebastián Llambí (llamb1315) with Antigravity (Google DeepMind)
Date: 2026-11-22
Approver: Sebastián Llambí (Human Lead) — Explicit approval with requirement of Ubiquitous Language & Tactical DDD Patterns.

## Spec and traceability
- Use cases: UC-001 (Start a game), UC-002 (Apply a move)
- Requirements: FR-003, FR-004, FR-005, FR-008, FR-009, FR-014, FR-015, FR-019, FR-020, NFR-001, NFR-002, C-001, C-002, C-003, C-004, C-005, C-006
- Business rules covered: BR-001-3 (Board contains only cells included by its BoardShape), BR-002-4 (Generic engine variant independence), BR-002-5 (Hexa Lines 3-axis line clearance), BR-002-6 (Hexa Fit closed shape containment), BR-002-7 (Hexa Sort neighbor transfers), BR-002-8 (Hexa Merge 6-direction sliding)

## Problem
The generic game engine currently lacks a formal mathematical foundation for hexagonal topology, coordinates, directional navigation, 3-axis line detection, and board boundaries. Without this domain foundation, neither the generic `HexBoard<TCell>` nor the four variant rule strategies (Lines, Fit, Sort, Merge) can represent positions, validate movements, detect completed lines, or test adjacency.

## Proposed design
We introduce an immutable, pure domain topology module under `src/domain/topology/`, strictly aligned with the **Ubiquitous Language** defined in `docs/specs/entity-model.md` and following **Tactical DDD Patterns**:
- **Value Objects:** `HexCoord` (immutable, self-validating, structural equality), `HexDirection`, `HexAxis`, and `BoardShape`.
- **Domain Service:** `HexTopology` implementing `ITopology<HexCoord>` for stateless multi-coordinate spatial calculations.
- **Domain Factories:** Static factory methods on `BoardShape` enforcing domain invariants.

| Type | DDD Tactical Pattern | Layer | Responsibility |
| --- | --- | --- | --- |
| `HexCoord` | Value Object | Domain (Entities) | Immutable coordinate $(q, r)$ with cubic $s = -q - r$, unique string serialization (`key`), structural equality, addition, and scalar multiplication. Enforces integer coordinates invariant. |
| `HexDirection` | Value Object / Enum | Domain (Entities) | The 6 hexagonal unit vector directions: East, Northeast, Northwest, West, Southwest, Southeast. |
| `HexAxis` | Value Object / Enum | Domain (Entities) | The 3 line axes of a hex grid: Q-axis (horizontal, constant $r$), R-axis (diagonal, constant $q$), S-axis (diagonal, constant $q+r$). |
| `ITopology<TCoord>` | Domain Port / Interface | Domain (Entities) | Generic abstraction for spatial navigation, neighbor queries, distance metrics, ray casting/line projection, and rotation. |
| `HexTopology` | Domain Service | Domain (Entities) | Concrete implementation of `ITopology<HexCoord>` providing hex grid mathematics (Manhattan distance, 60° CW/CCW rotations, line generation). |
| `BoardShape` | Value Object & Factory | Domain (Entities) | Immutable set of valid coordinates for a board. Enforces domain invariants (valid radius, non-empty shapes, deduplication). |

## Clean Architecture
- **Layer 1 (Domain)** only: All new types reside strictly inside `src/domain/topology/`.
- **Zero outward imports**: No imports from `application/`, `infrastructure/`, `presentation/`, `react`, `react-native`, or `expo`.
- **Dependency directions**:
  - `HexTopology` implements `ITopology<HexCoord>`.
  - `BoardShape` encapsulates `ReadonlySet<string>` (using `HexCoord.key`) and exposes `HexCoord` entities.
  - Future `HexBoard<TCell>` (Layer 1) will depend on `BoardShape` and `ITopology<HexCoord>`.
- **Ports & Adapters**: None required at this stage; this is pure domain entity mathematics.
- **Composition root**: Domain services are instantiated directly or provided via variant factories.

## SOLID
- **SRP (Single Responsibility Principle):**
  - `HexCoord`: Only handles mathematical point operations in axial/cubic space.
  - `BoardShape`: Only handles set membership and spatial boundaries of a board.
  - `HexTopology`: Only handles grid traversal, distance computation, and directional transformations.
- **OCP (Open/Closed Principle):**
  - `ITopology<TCoord>` decouples coordinate geometry from board structures. If a variant or test uses a non-hexagonal coordinate space (e.g., Cartesian grid for future mini-games), `ITopology` can be implemented without changing the generic engine.
- **LSP (Liskov Substitution Principle):**
  - `HexTopology` satisfies all post-conditions of `ITopology<HexCoord>` without weakening input constraints or throwing unexpected domain exceptions.
- **ISP (Interface Segregation Principle):**
  - `ITopology<TCoord>` exposes only cohesive geometric query methods (`getNeighbors`, `getNeighbor`, `getDistance`, `areNeighbors`, `getLine`, `rotate60`).
- **DIP (Dependency Inversion Principle):**
  - The generic engine and rules strategies depend on `ITopology<TCoord>`, never on concrete UI or screen pixel representations.

## Design patterns
| Pattern | Participants | Problem it solves here | Simpler alternative rejected and why |
| --- | --- | --- | --- |
| **Strategy (GoF)** | `ITopology<TCoord>` (Strategy Interface) & `HexTopology` (Concrete Strategy) | Allows board and game rules to query adjacency, lines, and distances through a uniform geometry contract. | Hardcoding axial formulas in rules: violates DRY and couples variant rules to a specific hex coordinate formula. |
| **Static Factory (GoF)** | `BoardShape.hexagonal(radius)` & `BoardShape.fromCoords(coords)` | Creates validated, immutable standard boards (radius 2 for Sort/Merge = 19 cells; radius 4 for Lines = 61 cells) and arbitrary figures for Hexa Fit. | Public constructor with mutable arrays: risks accidental mutation and invalid radius states. |
| **Value Object (DDD)** | `HexCoord`, `BoardShape` | Guarantees value equality (`a.equals(b)`), immutability (frozen properties), and thread/reference safety across state snapshots. | Primitive `{q: number, r: number}` plain objects: lacks coordinate methods, prevents `Set`/`Map` identity lookup by reference. |

## Extensibility and infrastructure independence
- **To add a 5th variant (e.g. Hexa Fill or an irregular maze):**
  - Define its custom shape using `BoardShape.fromCoords(cells)` or a custom factory.
  - The generic engine and topology calculations remain 100% unchanged.
- **Files that would NOT change:**
  - `src/domain/topology/**`
  - `src/domain/engine/**`
- **Infrastructure independence:**
  - Pure TypeScript with 0 external packages. Runs identically in Node.js, Jest, React Native (Hermes), or Web Worker.

## Alternatives considered
1. **Offset coordinates (odd-r / even-q):**
   - *Pros:* Closer to 2D array representation `grid[row][col]`.
   - *Cons:* Direction vectors and distance formulas have complex odd/even branching. Rotations are extremely difficult to compute.
   - *Decision rejected:* Axial coordinates provide clean vector addition and trivial rotations.
2. **Cube coordinates $(x, y, z)$ directly:**
   - *Pros:* Perfectly symmetric 3D hyperplane representation.
   - *Cons:* Redundant storage of third coordinate ($z = -x-y$).
   - *Decision:* Axial $(q, r)$ stored with calculated getter `s` ($s = -q - r$) provides the best of both worlds.

## Test plan
| Spec element (flow / BR) | Test name (`should_…_when_…`) | Level |
| --- | --- | --- |
| BR-001-3, Entity Model | `should_store_axial_coordinates_and_calculate_cubic_s_when_created` | Unit |
| Entity Model | `should_return_equal_for_same_coordinates_and_distinct_key_when_compared` | Unit |
| Entity Model | `should_add_coordinates_correctly_when_offset_applied` | Unit |
| BR-002-8, FR-019 | `should_provide_six_distinct_unit_directions_when_querying_hex_directions` | Unit |
| BR-002-8 | `should_return_opposite_direction_when_inverting_direction` | Unit |
| FR-009, C-001 | `should_rotate_sixty_degrees_clockwise_and_counter_clockwise_when_rotating_coords` | Unit |
| FR-009 | `should_preserve_distance_to_origin_when_rotated` | Unit |
| FR-015, FR-020 | `should_calculate_manhattan_distance_correctly_when_measuring_between_cells` | Unit |
| FR-015 | `should_return_six_neighbors_when_querying_interior_hex_coordinate` | Unit |
| FR-005, BR-002-5 | `should_generate_straight_lines_along_each_of_the_three_axes_when_projecting_rays` | Unit |
| FR-003, BR-001-3 | `should_generate_exactly_61_cells_when_creating_radius_4_hexagonal_shape` | Unit |
| FR-014, FR-019 | `should_generate_exactly_19_cells_when_creating_radius_2_hexagonal_shape` | Unit |
| FR-008, BR-002-6 | `should_validate_containment_correctly_when_checking_coords_inside_and_outside_shape` | Unit |
| Entity Model | `should_be_immutable_and_prevent_external_modification_when_shape_created` | Unit |

## Open questions for the team
- None. The coordinate conventions match the reference architecture and standard hexagonal grid literature (Red Blob Games standard axial $q, r$ with flat-topped / pointy-topped compatibility).

## Implementation notes
Implemented domain topology modules strictly under Layer 1 (`src/domain/topology/`):
- `src/domain/topology/hex-coord.ts`: Immutable Value Object representing axial coordinates $(q, r)$ with derived cubic $s$ ($q+r+s=0$), key serialization (`"q,r"`), equality, scalar scaling, vector addition/subtraction, and invariant enforcement (integers only).
- `src/domain/topology/hex-direction.ts`: Immutable Value Object / Enum representing the 6 directions (`EAST`, `NORTHEAST`, `NORTHWEST`, `WEST`, `SOUTHWEST`, `SOUTHEAST`) and 3 axes (`Q_AXIS`, `R_AXIS`, `S_AXIS`), with helper service `HexDirections` for opposites, unit offsets, and rotation.
- `src/domain/topology/itopology.ts`: Generic domain strategy interface `ITopology<TCoord>` declaring methods for neighbor discovery, direction lookups, Manhattan distance, ray/line projection, and 60° rotations.
- `src/domain/topology/hex-topology.ts`: Domain Service implementing `ITopology<HexCoord>`.
- `src/domain/topology/board-shape.ts`: Immutable Value Object and Domain Factory for regular hexagonal grids (radius 2 = 19 cells, radius 4 = 61 cells) and arbitrary closed figures (Hexa Fit).
- `src/domain/topology/index.ts`: Barrel export.

## Verification
- `npm run typecheck`: Passed with 0 errors (TypeScript strict mode).
- `npm run lint`: Passed with 0 warnings, 0 errors.
- `npm test`: 6 test suites passed, 45 tests passed.
  - `test/domain/topology/hex-coord.test.ts`: 7 tests passed.
  - `test/domain/topology/hex-topology.test.ts`: 7 tests passed.
  - `test/domain/topology/board-shape.test.ts`: 7 tests passed.
  - `test/architecture/layer-boundaries.test.ts`: Architectural fitness test passed (zero outward layer imports).

## AI usage
- **Tool and model:** Antigravity (Google DeepMind) with Gemini 2.5 Pro.
- **Task & prompts:**
  - "dale si listo vamos con eso"
  - "ok si la apruebo, pero tambien recuerda que todo esto tiene que ser con lenguaje ubicuo porque estamos en la capa de dominio, y usar los patrones tactitcos de DDD"
- **Result:**
  - Formal proposal registered in `feat__engine-hex-topology.md`.
  - Comprehensive TDD unit test suites prepared before writing source code.
  - Implementation of pure Domain Layer classes adhering to Tactical DDD (Value Objects, Domain Services, Domain Factories).
- **AI Anomalies / Corrections caught by human & verification:**
  1. *IEEE-754 `-0` cubic coordinate:* Initial calculation `-this.q - this.r` resulted in `-0` when $(q=0, r=0)$, causing `Object.is` test failure. Corrected by normalizing `-0` to `0`.
  2. *Exception message consistency:* The error message in `BoardShape.hexagonal(-1)` was adjusted to explicitly mention both positive and non-negative integer invariant requirements.
  3. *Tactical DDD patterns reinforcement:* Human correctly reminded the agent to explicitly adhere to Tactical DDD patterns and Ubiquitous Language, avoiding generic technical labels.
- **Lessons learned:**
  - Value Objects must ensure runtime immutability via `Object.freeze` and normalize primitive representations (such as negative zero) to preserve strict equality invariants.
