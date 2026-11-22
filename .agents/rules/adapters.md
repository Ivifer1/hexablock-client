---
paths:
  - "src/adapters/**"
---
# Interface Adapters layer

Purpose: translate between the inner layers and the outside world.

Contains: presenters and view models per screen, controllers that turn UI gestures into commands, repository and gateway
implementations of application ports, mappers (domain ⇄ DTO / persisted JSON, including each variant's state serialization),
Adapter-pattern wrappers around external libraries, Facades such as `GameServiceFacade`.

Allowed imports: `src/application/**`, `src/domain/**`, and libraries needed to adapt (never `src/infrastructure/**`).

Rules:
- This is the first layer where technical names are allowed (`AsyncStorageProgressRepository`, `HttpLeaderboardGateway`, `JsonLevelSource`).
- Adapters implement ports exactly; they add no business rules. If you need a rule, it belongs in the domain.
- View models expose plain data and intent methods; screens stay dumb. One view model per screen, generic over the variant when the screen is shared.
- Mappers are pure and tested; serialization of a variant state is registered per variant, not handled with a switch.
- Wrap third-party APIs (storage, HTTP, audio, analytics) in an Adapter so they can be swapped without touching inner layers.
