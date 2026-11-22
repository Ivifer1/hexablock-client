---
paths:
  - "src/domain/**"
---
# Domain layer (Entities) — the generic engine lives here

Purpose: game concepts and rules, independent of React Native, Expo, storage and network. Must be testable in total isolation.

Allowed imports: other files in `src/domain/**` and the TypeScript standard library. Nothing else.

What belongs here:
- Geometry: `HexCoord` (axial q, r), neighbours, the 3 axes, rings, 60° rotation, board shapes (hexagon of radius N, arbitrary figure).
- `HexBoard<TCell>`: written ONCE, parametrized by cell content; exposes iteration (Iterator pattern) by axis, ring and neighbourhood
  without exposing its internal representation.
- `IGameRules<TCell, TMove, TState>`, `GameEngine<TCell, TMove, TState>` (Template Method turn skeleton: validate → apply → resolve → evaluate → notify),
  `IPieceSource<TPiece>`, `IScoringPolicy<TState>`, `IProgressModel`, domain events (`LineCleared`, `StackMerged`, `TileMerged`, `GameOver`).
- Variant rules (`HexaLinesRules`, `HexaFitRules`, `HexaSortRules`, `HexaMergeRules`) and scoring policies, as implementations of the contracts.
- Capability interfaces for bounded generics (`IMergeable<T>`) and segregated capabilities (`IUndoable`, `ITimed`, `IRandomSeeded`).

Rules:
- The engine and the generic contracts never mention a concrete variant. No `if (variant === …)`, no `switch` on game id,
  no `instanceof HexaXRules`. Variation goes through Strategy (rules, scoring, piece source) chosen by the variant's Abstract Factory.
- Pure and deterministic: no `Math.random`, `Date.now`, timers, `console`, I/O or `process.env`. Randomness comes from an injected
  seeded source; time from an injected clock.
- Prefer immutable state; operations return new boards/states (Prototype/clone for previews and undo).
- Generic constraints only when the engine needs a capability, with a one-line comment saying why.
- Names in game language: board, piece, line, stack, merge, cascade. Never json, storage, pixel, http, screen.
- Every public rule has a unit test; the engine is tested with a fake cell type.
