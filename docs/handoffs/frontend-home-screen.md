# Handoff — Frontend Home Screen

## Objective

Implement the HexaBlock Inicio and game-selector screen for the client with the
attached 360 px mockup and the repository's existing UI specifications.

## Branch

- Branch: `feat/frontend-home-screen`
- Base: `dev`
- Owner: Leonardo Ibarra
- Scope: frontend and interface adapters only
- Do not implement gameplay, board validation or backend behavior on this branch

## Current state

- `dev` is synchronized with `origin/dev`.
- Fase 1 is already merged.
- UC-001 to UC-004 are approved and describe generic engine/start/progress flows.
- `docs/specs/screens/01-inicio.md` describes the Inicio contract.
- `docs/ui-context/screens/01-inicio/proposed-design.md` and
  `docs/ui-context/screens/01-inicio/proposed-design.png` describe the attached proposed design.
- `docs/ui-context/design-tokens.css` provides the local visual tokens.
- Figma MCP could not inspect the Design System node `1:76` because the
  Starter plan reached its tool-call limit.
- The attached Inicio mockup is the primary visual reference until Figma
  component-library access is available.

## First task in the next session

Create the approved frontend use case and design proposal:

1. Read `docs/specs/use-cases/UC-000-template.md` and
   `docs/specs/requirements.md`.
2. Create the next free use case, likely `UC-005-select-game-on-home`.
3. Link the UC to `SUI-01`, `SUI-02`, `SUI-04`, `SUI-08`, `PRG-02`,
   `INT-01`, `INT-02` and `P-18`, which is resolved for session/ranking scope.
4. Set the UC to `Status: Draft`, update `docs/specs/dashboard.md`, and ask
   a human to approve it.
5. Create `docs/ai/change-records/feat__frontend-home-screen.md` from
   `docs/ai/change-records/TEMPLATE.md`.
6. Set the change record to `Status: PROPOSED` and wait for human approval.

Do not mark a spec or change record `Approved` as the agent.

## Approved implementation scope

After approval:

- Add plain React Native screen components for Inicio.
- Reuse existing Fase 0 output DTOs or add a focused home DTO only if the
  approved proposal requires it.
- Add a presenter/controller seam in `src/adapters/presentation`.
- Keep game selection data-driven through `GameModeDescriptor`.
- Render four descriptors; prove that a fifth descriptor renders without
  layout/branch changes.
- Keep text keys in i18n/catalog structures rather than JSX literals.
- Preserve a 360 px width in Spanish and English.
- Use 44 px minimum touch targets and the existing token equivalents.
 - Include P-18 session and ranking behavior in the mandatory screen.

## Mockup requirements

- HexaBlock header mark and suite title.
- Settings action in the header.
- Rotating or selectable hexagonal game selector.
- Selected mode at top, with Lines/Merge/Fit/Sort as supporting modes.
- One selected-mode detail card below the selector.
- Entry-kind badge:
  - `partida_directa`
  - `por_niveles`
- Progress chip or placeholder.
- Primary play button.
 - Login/session entry and ranking access are mandatory for P-18.
- Loading, normal, first-time, error and empty states.

## Files to inspect

- `docs/specs/screens/01-inicio.md`
- `docs/ui-context/screens/01-inicio/proposed-design.md`
- `docs/specs/screens/10-textos.md`
- `docs/ui-context/design-tokens.css`
- `src/application/ports/output/ILevelSelectionOutputPort.ts`
- `src/application/ports/output/index.ts`
- `src/application/modes/game-mode-descriptor.ts`
- `src/adapters/`
- `src/infrastructure/App.tsx`
- `test/architecture/layer-boundaries.test.ts`

## Tests to add first

- `should_render_all_registered_modes_when_home_loads`
- `should_render_added_fifth_mode_when_descriptor_is_registered`
- `should_emit_direct_entry_when_lines_or_merge_is_selected`
- `should_emit_levels_entry_when_fit_or_sort_is_selected`
- `should_render_progress_placeholder_when_progress_is_loading`
- `should_render_without_progress_when_progress_read_fails`
- `should_render_empty_state_when_no_modes_are_registered`
- `should_remain_readable_when_viewport_is_360_px_in_each_language`

Tests must use AAA structure and public behavior. UI fixtures may be plain
ViewModels; they must not instantiate the game engine.

## Verification commands

```bash
npx --no-install jest test/<focused-test>.test.ts --runInBand
npm run typecheck
npm run lint
npm test -- --runInBand
```

## Open decisions

- P-18 resolved: Inicio includes session/login and ranking access.
- Initial selection resolved: Hexa Lines is the first-launch default.
- Last selection resolved: Inicio restores the most recently selected mode.
- Selector resolved: tap and drag/gesture rotation both select a mode and animate the dial.
- Center preview resolved: every selected mode loads a descriptor-provided preview.
- Exact Figma component mapping once Figma MCP access is restored.

## Stop conditions

Stop and ask for approval or clarification if:

- A game rule is needed in a screen or presenter.
- A UI component imports a domain entity or use case.
- A variant name is used to choose layout or navigation.
- Figma assets conflict with the local token model.
- The session/P-18 behavior changes the mandatory scope.
