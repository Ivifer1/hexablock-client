---
paths:
  - "src/**"
---
# Design pattern map (GoF) — use these where they fit, justify each in the change record

Mandatory: **Strategy** (rules, scoring, piece source, undo policy) and **Abstract Factory** (one factory per variant producing
a coherent family: rules, piece source, scoring policy, board shape, progress model).

Expected uses from the brief (team decides final placement; record it in an ADR):
| Pattern | Where it fits in HexaBlock |
| --- | --- |
| Builder | Building Hexa Fit / Hexa Sort levels from JSON step by step (figure, pieces, goals) |
| Singleton / single-scope DI | AudioManager, SessionManager (prefer DI over a static singleton) |
| Prototype | Cloning pieces and board states for rotation, preview and undo |
| Composite | Pieces as compositions of cells; level figures as compositions of regions |
| Decorator | `TimedRulesDecorator`, `BonusMultiplierDecorator`; AOP aspects around use cases |
| Adapter | Wrapping storage, HTTP, audio, analytics libraries behind ports |
| Facade | `GameServiceFacade` over audio / persistence / network |
| Observer | Domain events (`LineCleared`, `StackMerged`, `TileMerged`, `GameOver`) to UI, score, audio, analytics |
| Command | Moves as objects for history, undo and redo |
| State | Game lifecycle: Menu, Playing, Resolving, Paused, GameOver, Victory |
| Template Method | Turn skeleton validate → apply → resolve → evaluate |
| Iterator | Traversing the board by axis, ring or neighbourhood |

Rules: do not add a pattern for its own sake. For each one, state the problem it solves, the participants (which class plays
which role) and the simpler alternative you rejected.
