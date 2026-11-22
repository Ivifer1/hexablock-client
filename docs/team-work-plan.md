# HexaBlock client — team work plan

## Team assignment

| Person | Repository role | Client responsibilities |
| --- | --- | --- |
| Leonardo Ibarra | Frontend | React Native screens, navigation, presentation adapters, UI DTO mapping, i18n, Expo integration and composition wiring |
| Sebastián Llambí | Game engine | Generic domain engine, hex board, geometry, strategies, variant rules, scoring, history and domain/application unit tests |
| Ivifer Pita | Backend | Backend repository only: API, authentication, progress persistence and leaderboard |

Leonardo and Sebastián work on this repository. Ivifer Pita does not change this repository unless an API contract is being synchronized by all teams.

## Ownership boundaries

### Leonardo Ibarra — Frontend

Own:

- `src/infrastructure/App.tsx`
- React Native and Expo infrastructure
- Navigation
- Screens and UI components
- `src/adapters/presentation/**`
- Controllers and presenters
- Screen view models
- UI-facing implementations of application output ports
- i18n resources and UI event translation
- Client composition wiring for UI dependencies

May read:

- `src/application/**`
- `src/domain/**`
- `docs/specs/**`
- `docs/ui-context/**`

Must not:

- Add game rules, board validation, scoring or merge/line/sort algorithms to a screen or adapter
- Import concrete domain entities directly into UI components
- Import domain or use-case types from an infrastructure screen
- Read local storage or call HTTP directly from a component
- Branch on `gameId` or variant names to choose behavior

### Sebastián Llambí — Game engine

Own:

- `src/domain/**`
- Generic `HexBoard<TCell>` and axial hex geometry
- `IGameRules`, `GameEngine`, `IPieceSource`, `IScoringPolicy`, history abstractions
- Variant strategy implementations
- Abstract factories
- Seeded randomness contracts and domain deterministic behavior
- Engine and variant unit tests

May change:

- Generic application use cases when they truly operate on every variant
- Application ports that describe randomness, clock or progress intent

Must not:

- Import React, React Native, Expo or infrastructure
- Read local storage or call HTTP
- Test UI behavior
- Branch on concrete variant names inside the generic engine
- Copy `GameEngine` or a generic use case for one variant

### Ivifer Pita — Backend

Ivifer Pita owns `hexablock-backend`, not this repository. The client exposes only the external need through application ports:

- `IProgressRepository.save/find`
- `ILeaderboardGateway`
- `ISessionProvider` or an equivalent session port if P-18 is approved

Ivifer Pita must not implement game-board rules or a second copy of the HexaBlock engine.

## Work streams

| Priority | Area | Owner | Deliverable |
| --- | --- | --- | --- |
| 1 | Hex geometry and board | Sebastián Llambí | `HexCoord`, `HexBoard<TCell>`, neighbours and axis iteration |
| 2 | Generic engine contracts | Sebastián Llambí | `IGameRules`, `IScoringPolicy`, `IPieceSource`, `GameEngine` |
| 3 | Seeded random port | Sebastián Llambí + Leonardo Ibarra | Application port and infrastructure adapter |
| 4 | Generic use cases | Sebastián Llambí | Start, apply move, undo/redo and progress use cases |
| 5 | Output presenters | Leonardo Ibarra | HUD, controls, level selection, victory and defeat presenters |
| 6 | Home screen | Leonardo Ibarra | Hex selector and selected-game card matching `docs/specs/screens/01-inicio.md` and `docs/ui-context/screens/01-inicio/proposed-design.png` |
| 7 | Progress adapter | Leonardo Ibarra | Local repository implementation behind `IProgressRepository` |
| 8 | API contract alignment | Leonardo Ibarra + Ivifer Pita | Matching DTO and endpoint contracts across repositories |

## Suggested branches

| Person | Branch prefix | Example |
| --- | --- | --- |
| Leonardo Ibarra | `feat/frontend-*` or `feat/home-*` | `feat/frontend-home-screen` |
| Sebastián Llambí | `feat/domain-*` or `feat/engine-*` | `feat/domain-generic-engine` |
| Cross-repo contract | `feat/client-contract-*` | `feat/client-contract-progress-api` |

Never branch or commit directly to `main`.

## Implementation sequence

### Sebastián Llambí

1. Read the approved UC and the linked requirements.
2. Read `.agents/rules/domain.md`, `.agents/rules/solid.md` and `docs/specs/entity-model.md`.
3. Create the proposal change record and wait for human approval.
4. Add failing AAA unit tests for the public engine behavior.
5. Implement only domain/application changes owned by this work stream.
6. Run targeted Jest, `npm run typecheck`, `npm run lint` and the architecture tests.
7. Update the domain README and change record verification section.

### Leonardo Ibarra

1. Read `docs/specs/screens/01-inicio.md`, `docs/specs/screens/10-textos.md`, `docs/ui-context/screens/01-inicio/proposed-design.md` and `docs/ui-context/design-tokens.css`.
2. Read `.agents/rules/adapters.md`, `.agents/rules/infrastructure.md` and the approved output DTO ports.
3. Create the proposal change record and wait for human approval.
4. Add failing presenter/controller/UI tests or fixtures.
5. Implement React Native components and adapters from view models.
6. Keep UI state plain: components do not validate moves or calculate scores.
7. Validate 360 px Spanish/English layouts and run the full test commands.

## Handoff rules

- Sebastián exposes domain behavior only through public classes and interfaces.
- Leonardo consumes application ports and DTOs, never concrete engine implementations.
- Ivifer exposes backend operations through the contract agreed with Leonardo.
- A change to an agreed port or DTO requires a small contract note in the client change record before implementation.
- Open questions are recorded in the spec or ADR and are never invented inside code.

## Definition of done

A task is done when:

1. Its UC/requirement IDs are Approved.
2. The proposal is Approved and its change record is complete.
3. Tests are added before implementation and fail for the right reason.
4. Only the owner's layer and agreed shared application contracts changed.
5. `npm run typecheck`, `npm run lint` and `npm test` pass.
6. The change record records implementation, verification and AI usage.
7. The PR explains the Clean Architecture, SOLID and pattern decisions.
