# Requirements catalog — client

Status: Draft — extracted with AI from the brief ("Enunciado Proyecto Semestral HexaBlock Suite v1.0", 2026-10-23).
**The team must review it** (merge duplicates, fix wording, answer open questions) before using it as source of truth.
IDs are stable and never reused. The backend repo has its own catalog; cross-repo references use `backend:FR-###`.

## Functional requirements
| ID | Requirement | Brief § |
| --- | --- | --- |
| FR-001 | The home screen shows the suite name, access to settings and a game selector with the four variants. | 5.1 |
| FR-002 | Level-based variants (Hexa Fit, Hexa Sort) have a level selection screen with progress indicator and locked levels. | 5.1 |
| FR-003 | Hexa Lines is played on a radius-4 hexagonal board (61 cells) with a tray of 3 pieces of 1 to 5 cells. | 1.1 |
| FR-004 | In Hexa Lines the player drags a piece to any free position where it fits completely; there is no gravity. | 1.1 |
| FR-005 | In Hexa Lines a completed line on any of the 3 axes is cleared and scores; several lines at once produce a combo. | 1.1 |
| FR-006 | In Hexa Lines a new tray is generated when the 3 pieces are used; the game ends when no available piece fits. | 1.1 |
| FR-007 | Hexa Lines score = placed cells + line bonus + combo and streak multiplier. | 1.1 |
| FR-008 | Each Hexa Fit level defines a closed figure and a fixed set of pieces whose total area equals the figure's area. | 1.2 |
| FR-009 | In Hexa Fit the player places all pieces inside the figure with no gaps or overlaps, rotating them in multiples of 60°, and may remove and reposition pieces. | 1.2 |
| FR-010 | Hexa Fit is won when the figure is fully covered; there is no defeat condition. | 1.2 |
| FR-011 | Hexa Fit supports unlimited undo and redo. | 1.2, 5.1 |
| FR-012 | Hexa Fit awards stars per level based on number of moves and time. | 1.2 |
| FR-013 | Hexa Fit has at least 15 hand-designed levels with progressive difficulty, loaded from configuration files. | 1.2, 5.1 |
| FR-014 | Hexa Sort is played on a radius-2 board (19 cells) where each cell can hold a stack of coloured tiles; the player places the offered stack on an empty cell. | 1.3 |
| FR-015 | In Hexa Sort, same-colour top tiles of adjacent stacks transfer toward the stack with more of that colour, in cascade, until no transfer is possible. | 1.3 |
| FR-016 | In Hexa Sort a stack reaching 10 tiles of one colour is removed and counts as a met goal. | 1.3 |
| FR-017 | Hexa Sort is won when the level's goal count is reached and lost when the board is full with no valid move. | 1.3 |
| FR-018 | Hexa Sort has at least 10 hand-designed levels with progressive difficulty, loaded from configuration files. | 5.1 |
| FR-019 | Hexa Merge is played on a radius-2 board with power-of-two tiles; the player slides in one of 6 directions and all tiles move to the edge. | 1.4 |
| FR-020 | In Hexa Merge two equal colliding tiles merge into one tile of double value; after each valid move a 2 or 4 appears on a random empty cell. | 1.4 |
| FR-021 | Hexa Merge is won when the target tile appears (e.g. 2048) and lost when no move changes the board. | 1.4 |
| FR-022 | Hexa Merge score = sum of the values produced by merges. | 1.4 |
| FR-023 | Hexa Merge supports undoing one move. | 1.4, 5.1 |
| FR-024 | Hexa Lines and Hexa Merge are endless games that record the high score. | 5.1 |
| FR-025 | A victory screen shows the score and offers next level or new game; a defeat screen offers retry. | 5.1 |
| FR-026 | The player's progress per variant (levels completed, stars, scores) persists locally. | 5.1 |
| FR-027 | The app plays sound effects and background music, with a mute option. | 5.1 |
| FR-028 | The app is available in at least Spanish and English. | 5.1 |
| FR-029 | The app syncs progress and scores with the backend and shows the global leaderboard (see backend:FR-005..FR-007). | 3.4, 5.2 |

## Non-functional requirements
| ID | Requirement | Brief § |
| --- | --- | --- |
| NFR-001 | Random generation is injectable and reproducible with a seed, so games can be tested deterministically. | 1.4 |
| NFR-002 | Domain and use cases are testable in isolation, without UI or database. | 3.4 |
| NFR-003 | Automated tests (unit, integration, UI) run in CI on every pull request. | 3.6 |
| NFR-004 | Scoring criteria per variant are defined and documented by the team. | 5.1 |

## Constraints
| ID | Constraint | Brief § |
| --- | --- | --- |
| C-001 | One generic engine (`HexBoard<TCell>`, `IGameRules<TCell,TMove,TState>`, `GameEngine<TCell,TMove,TState>`, `IPieceSource<TPiece>`, `IScoringPolicy<TState>`, `IProgressModel`); variants are instantiations, never copies. | 2, 3.1 |
| C-002 | A new variant or small rule change is added with new classes or configuration only; documented in `docs/EXTENSIBILITY.md`. | 3.1 |
| C-003 | Bounded generics where the engine needs capabilities, justified in the README. | 3.1 |
| C-004 | Clean Architecture with 4 layers and the dependency rule pointing inwards. | 3.4 |
| C-005 | SOLID applied and documented with one real example per principle. | 3.2 |
| C-006 | GoF patterns from the three categories; Strategy and Abstract Factory mandatory. | 3.3 |
| C-007 | At least one AOP aspect implemented without libraries (decorators/proxies over the generic use case). | 3.5 |
| C-008 | Technology: TypeScript, Expo, React Native (language with generics). | header |
| C-009 | GitHub with protected branches, PRs, Conventional Commits in English. | 2, 6.2 |
| C-010 | README in English with the required sections; `AI_USAGE.md` at the root. | 6, 7 |
| C-011 | Class, layer and extensibility diagrams in `/docs` (image + editable source). | 4 |
| C-012 | Delivered as an Android or iOS executable in a GitHub release, by 2026-12-14. | 8 |

## Open questions (brief is silent; the team decides and records an ADR or a BR)
- Hexa Merge: can a tile merge more than once per move? Is the target tile configurable?
- Hexa Sort: tie-break when two neighbours hold the same amount of the colour; order of cascade resolution.
- Hexa Lines: definition of "streak"; exact line bonus and multipliers.
- Hexa Fit: star thresholds (moves, seconds) per level; can a placed piece be rotated in place?
- Which settings exist (language, mute, …)? Is login required to play, or only to sync?
