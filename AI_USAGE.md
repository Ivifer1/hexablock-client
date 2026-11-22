# AI Usage

## Tools

TBD

## Task Log

| Date | Task | Prompt | Result | Changes made |
|------|------|--------|--------|--------------|
| 2026-10-31 | Client project scaffold | "Set up the client: Expo + TypeScript, four Clean Architecture layers, a lint rule that blocks inner layers from importing outer layers, and CI" | Expo base project, `src/` layer folders with READMEs, ESLint `no-restricted-imports` rule per layer, architecture test, GitHub Actions workflow | Pending team review in the PR. Config passed to ESLint directly in the test so Jest does not need experimental flags; Node types kept out of `tsconfig` so `domain` cannot use Node APIs |
| 2026-11-22 | Implement architecture plan Fase 1 | "Implement and commit Fase 1 on a new branch after approval" | Fase 1 composition skeleton, mode registry contracts, output state adapter, focused tests and verification | Human approval recorded in `feat__phase-1-composition-root.md`; no gameplay rules or concrete variants added |
| 2026-11-22 | Propose Fase 2 use cases | "Start the proposals for Fase 2 on a new branch without implementing" | Four draft executable use cases covering game start, move application, history and progress | Open rules were left as explicit questions; no `src/**` files changed |
| 2026-11-22 | Approve Fase 2 specs and design proposal | "Approve the use cases and start the Fase 2 design using the Figma design system and Inicio mockup" | UC-001 through UC-004 marked Approved, Fase 2 design record created, Inicio visual handoff mapped to local tokens | Figma MCP returned its Starter-plan call limit; no Figma-specific assets or components were invented |
| 2026-11-22 | Assign repository work streams | "Divide the client work for Leonardo Ibarra (Frontend) and Sebastian Llambi (Engine), with Ivifer Pita documented as Backend" | Added a repository team plan with ownership boundaries, branches, handoffs and definition of done | Backend work remains in the separate backend repository; no client source code changed |
| 2026-11-22 | Implement UC-005 home screen | "Implement and verify the approved Inicio selector, while respecting Clean Architecture and keeping the game engine unchanged" | Added Home application DTO/port contracts, presenter/controller adapters, generic React Native screen, composition wiring and focused tests | Team approved UC-005 and the change record, resolved P-18/session/ranking, tap-and-gesture rotation, last selection, Hexa Lines default and local preview assets; team review of final UI assets remains pending |

## Critical Evaluation

Fase 1 was largely AI-assisted and reviewed against the repository's Clean Architecture guard. The first validation exposed missing local dependencies and one incorrect type import; both were corrected before the final checks. The team must still decide the concrete mode descriptors and factories in the later integration phase.
