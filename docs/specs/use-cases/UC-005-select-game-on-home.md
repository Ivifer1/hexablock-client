# UC-005 Select a game from the home screen

| Field | Value |
| --- | --- |
| ID | UC-005 |
| Primary actor | Player |
| Goal | Select one registered game variant and open the destination defined by that variant |
| Status | Approved |
| Linked requirements | FR-001, FR-024, FR-026, FR-028, FR-029, C-002, C-004, C-008 |
| Entities | Variant, Progress |

## Preconditions
- The app has opened Inicio.
- The GameModeRegistry contains zero or more Variant descriptors.
- The player's locale is Spanish or English.

## Trigger
- The Player opens Inicio or returns to Inicio from any other screen.

## Main success scenario
1. Player opens Inicio.
2. System displays the suite name and the settings action.
3. System renders one selector item for every registered Variant.
4. System renders the selected Variant detail with name, description, entry-kind badge and progress summary.
5. Player selects an available Variant.
6. System moves that Variant to the selected position and updates the detail card.
7. System loads a visual preview of the selected Variant in the center of the selector.
8. Player activates the primary play action.
9. System opens the direct game destination when the selected Variant entry kind is `partida_directa`.
10. System opens the level-selection destination when the selected Variant entry kind is `por_niveles`.

## Alternative flows
- **A1 (at step 5 the Player taps a non-selected Variant):** 1. Player taps a selector item. 2. System animates the selector so the Variant moves to the selected position. 3. The use case continues at step 6.
- **A2 (at step 5 the Player rotates the selector):** 1. Player performs a rotation gesture. 2. System animates the selector and selects the Variant that arrives at the selected position. 3. The use case continues at step 6.
- **A3 (at step 5 the selected Variant is already active):** 1. Player activates the primary action. 2. The use case continues at step 8 or 9 according to entry kind.
- **A4 (at step 8 progress is loading):** 1. System retains the registered Variant list. 2. System displays a progress placeholder in the detail card. 3. The use case continues at step 9 or 10.
- **A5 (at step 8 no progress record exists):** 1. System displays `common.best_none` for a direct-entry Variant. 2. System displays `Niveles: 0 de N` for a level-entry Variant. 3. The use case continues at step 9 or 10.

## Exception flows
- **E1 (at step 3 no Variants are registered):** 1. System displays `home.empty`. 2. System keeps the settings action available. 3. The use case ends.
- **E2 (at step 4 progress cannot be read):** 1. System renders the Variant list and detail card without a progress summary. 2. System displays `home.error_progress`. 3. The use case continues at step 5.
- **E3 (at step 5 the Player opens settings):** 1. Player activates INI-02. 2. System opens Ajustes. 3. The use case ends.
- **E4 (at step 8 a registered Variant has an unsupported entry kind):** 1. System keeps the current detail card. 2. System emits no navigation event. 3. The use case ends.

## Postconditions
- Success: A registered Variant is selected and the system opens exactly one destination determined only by its entry kind.
- Failure: The system leaves the registered Variant list and the selected detail unchanged.

## Business rules
- BR-005-1: The selector renders every registered Variant descriptor without a variant-specific layout branch.
- BR-005-2: The selected Variant determines the detail name, description, entry-kind badge, progress summary and center preview.
- BR-005-3: Entry kind `partida_directa` opens the Partida destination.
- BR-005-4: Entry kind `por_niveles` opens the level-selection destination.
- BR-005-5: Progress loading and progress read failure do not prevent Variant selection or play navigation.
- BR-005-6: Every displayed text is resolved by an i18n key in the selected locale.
- BR-005-7: A layout at 360 px displays all mandatory Inicio text without clipping in Spanish or English.
- BR-005-8: Inicio includes the session indicator and ranking access.
- BR-005-9: The selector supports both tap-to-select and rotation gesture.
- BR-005-10: Tap and gesture changes animate the wheel until the selected Variant reaches the selected position.
- BR-005-11: The selected Variant is visually larger and more prominent than supporting Variants.
- BR-005-12: The center of the selector loads a preview of the selected Variant.
- BR-005-13: On return to Inicio, the last selected Variant becomes the selected Variant.
- BR-005-14: Hexa Lines is the selected Variant on the first app launch until the Player selects another Variant.
- BR-005-15: Every Variant descriptor provides a preview key that identifies a local static preview asset.

## Open questions
- Preview format resolved: every Variant provides a local static image asset.
- Preview source resolved: assets are stored under `assets/ui/home-previews/` and selected by `previewKey`.
