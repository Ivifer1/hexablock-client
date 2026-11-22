# UC-003 Undo or redo a move

| Field | Value |
| --- | --- |
| ID | UC-003 |
| Primary actor | Player |
| Goal | Restore a previous or next `GameState` according to the variant's history policy. |
| Status | Approved |
| Linked requirements | FR-011, FR-023, C-001, C-002, C-004 |
| Entities | Variant, GameState, Move |

## Preconditions
- An active game exists.
- The selected `Variant` supplies a history policy.

## Trigger
- The player selects undo or redo.

## Main success scenario
1. Player selects undo or redo.
2. System asks the history policy whether the requested transition is available.
3. System restores the corresponding immutable `GameState` snapshot.
4. System presents the restored state and the updated availability of undo and redo.

## Alternative flows
- **A1 (at step 2) the requested transition is unavailable:** 1. System leaves the current `GameState` unchanged. 2. System presents the current state with the requested action disabled.
- **A2 (at step 2) the player selected undo in Hexa Fit:** 1. System applies the unlimited undo policy. 2. Use case continues at step 3.
- **A3 (at step 2) the player selected undo in Hexa Merge:** 1. System applies the one-move undo policy. 2. Use case continues at step 3.

## Exception flows
- **E1 (at step 3) the history snapshot is inconsistent:** System reports the history error and keeps the current `GameState` unchanged.

## Postconditions
- Success: The selected historical `GameState` is active and no entity snapshot has been mutated.
- Failure: The current `GameState` and history remain unchanged.

## Business rules
- BR-003-1: The history policy is injected into the generic game flow and is not selected by a variant conditional in the engine.
- BR-003-2: Hexa Fit supports unlimited undo and redo.
- BR-003-3: Hexa Merge supports undoing one move.
- BR-003-4: The undo and redo stacks contain complete `GameState` snapshots sufficient to restore board, tray, score and status.

## Open questions
- What history policy applies to Hexa Lines and Hexa Sort?
- Does a new move after undo discard all redo states or retain a branch?
- Does undo restore the random-source state, or does the game record generated values with each snapshot?
