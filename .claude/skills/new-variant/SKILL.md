---
name: new-variant
description: Plan (and, once approved, implement) a new game variant or a rule variation on the generic engine without modifying the engine. Use for the live extensibility test, a fifth variant like Hexa Fill, or updating docs/EXTENSIBILITY.md.
argument-hint: "variant name or rule change"
---
# /new-variant — prove Open/Closed

1. Write or update the use cases for the variant with `/spec` (rules, moves, end conditions, scoring, progress model, undo policy).
2. Fill the variability table for it: cell content (TCell), board shape, move type (TMove), resolution rule, piece source,
   end of game, progress model, undo. Compare with the four existing variants.
3. Produce the plan as two explicit lists with real class/file names from the codebase:
   - **Files to create:** cell type, move type, state type, `XRules implements IGameRules<…>`, scoring policy, piece source,
     `XFactory` (Abstract Factory), level data if any, view adapter/renderer mapping, i18n strings, tests.
   - **Files NOT modified:** `GameEngine`, `HexBoard`, generic use cases, AOP decorators, persistence, other variants.
     The only allowed edits to existing files: one registration in the composition root/registry and the game-selector list.
4. If any engine or use-case edit seems necessary, that is a design smell: explain the missing extension point and propose an ADR.
5. For a small rule change (board size, scoring policy, piece shape), show exactly where it goes: configuration, a new Strategy,
   or a Decorator (e.g. `BonusMultiplierDecorator`), never an `if` in existing code.
6. Update `docs/EXTENSIBILITY.md` and the extensibility diagram source in `docs/diagrams/`.
7. Implementation goes through `/implement` with the normal approval gate.
