# UC-006 Navigate the primary menu

| Field | Value |
| --- | --- |
| ID | UC-006 |
| Primary actor | Player |
| Goal | Navigate between the primary play action, global points ranking and settings |
| Status | Approved |
| Linked requirements | FR-001, FR-029, C-008 |
| Entities | Variant, Score |

## Preconditions
- The app has opened Inicio.
- A navigation menu is visible below the selected game content.

## Trigger
- The Player selects an action in the primary menu.

## Main success scenario
1. Player opens Inicio.
2. System displays Puntos on the left, Jugar in the center and Ajustes on the right.
3. System shows the Jugar icon filled and the Puntos and Ajustes icons outline.
4. Player activates Jugar.
5. System opens the direct game destination when the selected Variant entry kind is `partida_directa`.
6. System opens the level-selection destination when the selected Variant entry kind is `por_niveles`.

## Alternative flows
- **A1 (at step 4 the Player activates Puntos):** 1. Player activates Puntos. 2. System marks Puntos as selected and shows its icon filled. 3. System opens the global points ranking. 4. The use case ends.
- **A2 (at step 4 the Player activates Ajustes):** 1. Player activates Ajustes. 2. System marks Ajustes as selected and shows its icon filled. 3. System opens Ajustes. 4. The use case ends.
- **A3 (at step 4 the Player has no active session and activates Puntos):** 1. Player activates Puntos. 2. System opens Login. 3. System keeps Puntos as the intended destination. 4. Player completes login. 5. System opens the global points ranking. 6. The use case ends.

## Exception flows
- **E1 (at step 4 Puntos is unavailable):** 1. System keeps Puntos visible as outline. 2. System opens no destination. 3. The use case ends.

## Postconditions
- Success: The selected menu action is the filled menu item and the system opens exactly one destination.
- Failure: The menu selection and the current Inicio content remain unchanged.

## Business rules
- BR-006-1: The primary menu contains Puntos on the left, Jugar in the center and Ajustes on the right.
- BR-006-2: Jugar is the principal action and remains visually prominent.
- BR-006-3: The selected menu action displays one representative filled icon and text below the icon.
- BR-006-4: Non-selected menu actions display representative outline icons and text below each icon.
- BR-006-5: Puntos opens the global points ranking represented by the existing ranking destination.
- BR-006-6: A player without session can activate Puntos and must complete login before ranking access.
- BR-006-7: Ajustes opens the existing Ajustes destination.
- BR-006-8: Jugar determines its destination only from the selected Variant entry kind.
- BR-006-9: A 360 px layout displays every menu label without clipping.
- BR-006-10: Menu text changes with the selected locale without restarting the app.

## Open questions
- The project defines a global ranking but no tournament entity or flow.
- The menu is fixed to Puntos, Jugar and Ajustes; no additional item is specified.
