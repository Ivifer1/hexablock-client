---
paths:
  - "src/application/**"
---
# Application layer (Use Cases)

Purpose: what the app does (start game, apply move, undo, save progress, sync leaderboard, load levels), orchestrating domain objects.

Allowed imports: `src/domain/**` and other `src/application/**` files. No React, Expo, storage or HTTP libraries.

Rules:
- ONE generic use case per action, parametrized by the variant types (`ApplyMoveUseCase<TCell, TMove, TState>`), never one per game.
  No conditionals on the variant: the variant's factory supplies the strategies.
- Every external need is a port declared here (`IProgressRepository`, `ILevelSource`, `ILeaderboardGateway`, `IClock`,
  `IRandomSource`, `IAudioPlayer`, `ISessionProvider`). Port and method names state intent (`save`, `findByGame`), never mechanism.
- Use cases receive ports through the constructor (DIP). They never instantiate adapters.
- Cross-cutting concerns are AOP decorators that implement the same use case interface and wrap it
  (`LoggingUseCaseDecorator`, `TimingUseCaseDecorator`, `RetryOnFailureDecorator`, `RequiresSessionDecorator`, `CachingUseCaseDecorator`).
  They live here or in adapters, are applied in the composition root, and work for every variant at once.
- No `console`, `Date.now`, `Math.random`, timers or `process.env` here.
- Each use case maps to a `UC-###` spec; reference the ID in a short doc comment.
- Commands (Command pattern) represent moves when history/undo is needed; the undo policy (unlimited, one step, none) is a strategy, not an `if`.
