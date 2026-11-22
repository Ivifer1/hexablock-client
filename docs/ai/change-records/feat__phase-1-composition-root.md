# Change record: feat/phase-1-composition-root

Status: APPROVED
<!-- Only a human changes this line to "Status: APPROVED" (hooks block the agent from doing it). -->
Author(s): Leoibarrapp with Copilot
Date: 2026-11-22

## Spec and traceability
- Use cases: None approved yet; this is the architecture plan's Fase 1.
- Requirements: Architecture strategy Fase 1, Clean Architecture dependency rule.
- Business rules covered: None; this phase wires contracts and does not implement gameplay.

## Problem
The client currently contains the Fase 0 application output contracts but has no composition boundary or adapter-facing presentation seam. The Expo entry point is still the scaffold and cannot assemble a framework-independent application flow without coupling screens to application details.

## Proposed design
Add the smallest Fase 1 skeleton: a generic mode descriptor/registry contract in the application layer, a presentation adapter that stores the latest output DTOs, and an infrastructure composition root that creates the registry and exposes the assembled application dependencies. The Expo `App` will consume only the composition root's public result and render a neutral scaffold; no game rules, variant conditionals, or concrete game implementations will be introduced.

| Type | Kind | Layer | Responsibility |
| --- | --- | --- | --- |
| `GameModeDescriptor` | interface | application | Describes mode metadata without exposing a concrete variant. |
| `IGameModeRegistry` | port | application | Resolves registered descriptors by stable identifier. |
| `GameModeRegistry` | class | adapters | Implements descriptor lookup without knowing UI frameworks. |
| `OutputStateStore` | class | adapters | Captures output DTOs for the future presentation boundary. |
| `CompositionRoot` | class | infrastructure | Wires the registry and output adapters in one place. |

## Clean Architecture
- Dependency directions introduced: `infrastructure → adapters → application`; the new application contracts depend only on standard TypeScript types.
- Ports declared: `IGameModeRegistry` in `src/application`; `GameModeRegistry` and `OutputStateStore` implement ports/contracts in `src/adapters`.
- Wiring: `CompositionRoot` in `src/infrastructure` is the only module that instantiates concrete adapters.
- `domain` remains untouched and has no dependency on outer layers.

## SOLID
Only the principles actually at play:
- **SRP:** `GameModeRegistry` resolves descriptors; `OutputStateStore` stores presentation state; `CompositionRoot` only wires dependencies.
- **OCP:** a new mode is added through a descriptor and registration, without changing consumers or introducing a variant switch.
- **LSP:** `GameModeRegistry` fulfils the `IGameModeRegistry` lookup contract for every registered descriptor.
- **ISP:** the registry port exposes only descriptor lookup; output state is not mixed into it.
- **DIP:** infrastructure depends on application contracts, while application does not import Expo or React Native.

## Design patterns
| Pattern | Participants (role → class) | Problem it solves here | Simpler alternative rejected and why |
| --- | --- | --- | --- |
| Registry | registry → `GameModeRegistry`, entry point → `CompositionRoot` | Keeps mode selection data-driven and localizes assembly. | A switch in `App` would couple UI to variants and violate OCP. |
| Composition Root | composition root → `CompositionRoot` | Centralizes concrete construction and dependency injection. | Instantiating adapters in screens spreads infrastructure knowledge. |
| Adapter | adapter → `OutputStateStore` | Provides a framework-neutral presentation seam for output DTOs. | Passing React components through application ports would violate layer boundaries. |

## Extensibility and infrastructure independence
- To add a fifth variant / related rule, create its descriptor and register it in the composition configuration; gameplay rules remain a later phase concern.
- Files that would NOT change: output ports, DTOs, domain, and existing consumers of the registry contract.
- Expo, React Native, storage, and network details can be replaced at the composition boundary without changing application contracts.

## Alternatives considered
An immediate implementation of all four game factories was rejected because Fase 2 owns the generic engine and Fase 4 owns concrete mode integration. A UI-local registry was rejected because it would make infrastructure concerns leak into the presentation layer.

## Test plan
| Spec element | Test name (`should_…_when_…`) | Level |
| --- | --- | --- |
| Descriptor lookup | `should_return_registered_descriptor_when_identifier_exists` | unit |
| Unknown lookup | `should_return_none_when_identifier_is_not_registered` | unit |
| Duplicate protection | `should_reject_duplicate_identifier_when_registering_mode` | unit |
| Composition wiring | `should_expose_registered_modes_when_composition_root_is_created` | integration |
| Layer direction | `should_allow_infrastructure_to_depend_on_adapters_and_application` | architecture |

## Open questions for the team
- Should Fase 1 expose an empty registry only, or should it register placeholder descriptors for the four variants before Fase 4?
- Should an unknown mode lookup return `undefined` or an explicit application error result?

## Implementation notes
Implemented the Fase 1 skeleton without introducing gameplay rules or concrete variants:

- Added the application-level `GameModeDescriptor` and `IGameModeRegistry` contracts.
- Added `GameModeRegistry` and `OutputStateStore` in the adapters layer.
- Added `CompositionRoot` as the infrastructure assembly boundary and wired it into `App`.
- Kept the registry empty until Fase 4 defines the concrete mode factories; the UI renders a neutral zero-mode state.
- No domain files or Fase 0 DTO/ports were changed.

## Verification
- `npm run typecheck` — passed.
- `npm run lint` — passed.
- `npm test -- --runInBand` — passed, 3 suites and 21 tests.
- Targeted phase tests — passed, 2 suites and 5 tests.
- Dependency direction was preserved: application has no framework imports; adapters do not import infrastructure.

## AI usage
- Tool: Copilot SDK in VS Code.
- Prompt: implement and commit the architecture plan's Fase 1 on a new branch after human approval.
- Produced: the proposal, application mode contracts, adapter registry/state store, composition root, focused tests, and documentation updates.
- Team decision: human approval was required and recorded before editing `src/**`; no gameplay variant or engine behavior was invented.
