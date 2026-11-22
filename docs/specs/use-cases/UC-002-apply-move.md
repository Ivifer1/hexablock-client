# UC-002 Apply a move

| Field | Value |
| --- | --- |
| ID | UC-002 |
| Primary actor | Player |
| Goal | Apply one valid `Move` and receive the resulting immutable `GameState`. |
| Status | Approved |
| Linked requirements | FR-004, FR-005, FR-006, FR-009, FR-014, FR-015, FR-016, FR-017, FR-019, FR-020, FR-021, FR-022, NFR-001, NFR-002, C-001, C-002 |
| Entities | Variant, HexBoard, BoardShape, GameState, Move, Piece, Tray, ColorStack, Tile, Direction, Score, Goal |

## Preconditions
- An active `GameState` exists.
- The player has selected a `Move` supported by the selected `Variant`.
- The move input identifies only cells included by the current `BoardShape`.

## Trigger
- The player submits a `Move`.

## Main success scenario
1. Player submits a `Move`.
2. System asks the selected rules strategy to validate the `Move` against the current `GameState`.
3. System applies the valid `Move` and produces a new `GameState` without mutating the previous snapshot.
4. System updates the `HexBoard`, `Tray`, `Score` and status according to the selected rules and scoring policy.
5. System obtains any required random content through the injected seeded random source.
6. System presents the resulting `GameState`.

## Alternative flows
- **A1 (at step 2) the move is invalid:** 1. System rejects the `Move`. 2. System presents the unchanged `GameState` and an invalid-move result.
- **A2 (at step 4) the move completes a goal:** 1. System marks the corresponding `Goal` as completed. 2. System presents the resulting state with victory when all required goals are complete.
- **A3 (at step 4) no valid move remains:** 1. System marks the `GameState` as defeated when the variant defines a defeat condition. 2. System presents the final state.

## Exception flows
- **E1 (at step 5) the random source fails:** System reports the error and does not publish a partially applied state.
- **E2 (at step 6) the output boundary fails:** System keeps the resulting state available to the application caller and reports the presentation error through the application error boundary.

## Postconditions
- Success: A new `GameState` snapshot is available, with its board, score, tray and status consistent with the accepted move.
- Failure: The previous `GameState` remains unchanged and no score, progress or history entry is committed.

## Business rules
- BR-002-1: A move that does not satisfy the selected rules strategy cannot change the `GameState`.
- BR-002-2: A valid move changes the board only through the selected rules strategy.
- BR-002-3: Random content is requested only through the injected random-source abstraction.
- BR-002-4: The generic engine does not branch on a concrete `Variant`; variant differences are supplied by strategies and factories.
- BR-002-5: Hexa Lines clears completed lines on the three `Axis` values and applies its configured score policy.
- BR-002-6: Hexa Fit accepts only placements inside its figure without gaps or overlaps.
- BR-002-7: Hexa Sort applies adjacent `ColorStack` transfers until its cascade strategy reaches a stable state.
- BR-002-8: Hexa Merge slides tiles in the selected `Direction`, merges equal `Tile` values according to its merge strategy, and adds a random tile after a valid move.

## Open questions
- Can a Hexa Merge tile merge more than once in one move?
- What exact line bonus, combo and streak formulas apply to Hexa Lines?
- What tie-break and cascade order apply when Hexa Sort has equivalent neighbours?
- What exact invalid-move result does the output boundary present?
