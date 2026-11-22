# UC-004 Record progress

| Field | Value |
| --- | --- |
| ID | UC-004 |
| Primary actor | Player |
| Goal | Record the completed level or high score in the player's `Progress`. |
| Status | Approved |
| Linked requirements | FR-012, FR-024, FR-025, FR-026, NFR-004, C-001, C-004 |
| Entities | Variant, GameState, Level, Goal, Score, HighScore, Stars, Progress |

## Preconditions
- A game has reached a terminal state or a completed level.
- The application has a `Progress` record for the selected `Variant` or can create one.
- A progress repository port is available.

## Trigger
- The system marks the current `GameState` as victory, defeat or completed level.

## Main success scenario
1. Player completes a level or ends an endless game.
2. System calculates the result with the selected scoring policy.
3. System calculates `Stars` for a completed level or compares the result with `HighScore` for an endless variant.
4. System updates the selected `Progress` with levels completed, stars and scores.
5. System saves the updated `Progress` through the progress repository port.
6. System presents the result and the available next, retry or home actions.

## Alternative flows
- **A1 (at step 3) the result does not improve the existing record:** 1. System keeps the existing `HighScore` or `Stars`. 2. Use case continues at step 6.
- **A2 (at step 1) the player loses a level:** 1. System does not mark the level completed. 2. System presents retry and navigation actions. 3. Use case ends.

## Exception flows
- **E1 (at step 5) the progress repository is unavailable:** System keeps the calculated result in the current session, reports the persistence error and presents the result without claiming that local progress was saved.

## Postconditions
- Success: The progress repository contains the updated `Progress`, and the result identifies whether a new record was achieved.
- Failure: The current game result remains available, but the previous persisted `Progress` is unchanged.

## Business rules
- BR-004-1: Hexa Fit calculates `Stars` from the configured moves and time policy.
- BR-004-2: Hexa Lines and Hexa Merge compare endless-game results with `HighScore`.
- BR-004-3: A defeated level does not increment completed levels.
- BR-004-4: Progress persistence is accessed through an application port, not directly through local storage or a network client.
- BR-004-5: Scoring and star calculation are strategies supplied to the generic game flow.

## Open questions
- What are the exact move and time thresholds for 0–3 `Stars` in Hexa Fit?
- Does a Hexa Merge victory allow the player to keep playing and continue accumulating `Score`?
- Is defeated endless-game progress saved when the score does not beat `HighScore`?
- Which progress record wins when local and backend progress are later synchronized?
