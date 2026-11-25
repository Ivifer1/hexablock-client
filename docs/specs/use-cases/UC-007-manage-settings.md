# UC-007 Manage application settings

| Field | Value |
| --- | --- |
| ID | UC-007 |
| Primary actor | Player |
| Goal | Configure audio, theme appearance, language, and account session from Ajustes |
| Status | Draft |
| Linked requirements | FR-027, FR-028, FR-029, C-004, C-008 |
| Entities | — |

## Preconditions
- The Player opens Ajustes from Inicio (`HOME`) or Pausa (`PAUSE`).

## Trigger
- The Player enters Ajustes and interacts with an audio, theme, language, account, or back control.

## Main success scenario
1. System displays the Ajustes header with a back button, the title, and the release version badge to the right of the title.
2. System displays current persisted values for music, sound effects, dark mode, available languages, and account session state.
3. Player toggles music, sound effects, or dark mode, or selects an available language.
4. System persists the preference and applies the change immediately without restarting the app.
5. Player activates the back button (or system back).
6. System returns to the origin screen (`HOME` or `PAUSE`).

## Alternative flows
- **A1 (at step 3, Player enables sound effects):** 1. System persists sound effects as enabled. 2. System enables sound effects on the audio engine and triggers a short confirmation sound effect.
- **A2 (at step 3, Player has no active session and activates Sign in):** 1. Player activates the Sign in action in the Account card. 2. System navigates to Login.
- **A3 (at step 3, Player has an active session and requests Sign out):** 1. Player activates Sign out. 2. System shows a confirmation dialog with Cancel and Confirm actions. 3. Player selects Confirm. 4. System closes the session, updates the Account card to guest state, and hides the dialog.
- **A4 (at step 3 of A3, Player cancels Sign out):** 1. Player selects Cancel. 2. System closes the dialog and preserves the active session.
- **A5 (at step 1, origin is `HOME` vs `PAUSE`):** 1. When opened from `HOME`, System displays the primary bottom menu with Ajustes active. 2. When opened from `PAUSE`, System hides the primary bottom menu.

## Exception flows
- **E1 (at step 4, persisting music, sound effects, language, or theme fails):** 1. System reverts or keeps the control at its last persisted value without triggering side effects. 2. System displays the save error banner (`settings.error_save`).

## Postconditions
- Success: Persisted preferences and active UI theme/locale/audio reflect the Player's choices.
- Failure: Persisted preferences remain unchanged and the UI reflects the true persisted state.

## Business rules
- BR-007-1: Turning music off stops background music immediately; turning sound effects off silences all sound effects immediately.
- BR-007-2: Turning sound effects on plays a short confirmation sound effect only after persistence succeeds.
- BR-007-3: Dark mode changes the theme across all subscribed screens immediately without restarting.
- BR-007-4: Language options render dynamically from the locale catalog using each language's native name without country flag emojis.
- BR-007-5: Adding a third language requires only catalog/translation registration without modifying Ajustes presentation or UI components (OCP).
- BR-007-6: Changing language updates all visible texts across screens immediately without restarting.
- BR-007-7: When preference persistence fails, the control rolls back to its previous persisted value and displays `settings.error_save`.
- BR-007-8: When unauthenticated, the Account card offers the Sign in CTA styled consistently with Inicio; when authenticated, Sign out requires explicit confirmation.
- BR-007-9: The release version badge appears directly to the right of the Ajustes title when configured.
- BR-007-10: The bottom menu is visible only when Ajustes is opened from Inicio (`HOME`) and hidden when opened from Pausa (`PAUSE`).
