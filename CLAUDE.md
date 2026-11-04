# HexaBlock Suite — client

Mobile app with four hex-grid puzzle variants (Hexa Lines, Hexa Fit, Hexa Sort, Hexa Merge) built on ONE generic engine.
University project (Desarrollo de Software, NRC 15671), graded on design quality, not on "it works". Due 2026-12-14.
Stack: Expo + React Native + TypeScript (strict), Jest (jest-expo), ESLint. Node 24. Backend lives in a separate repo (`hexablock-backend`).

## Commands
- `npm test` · `npm run lint` · `npm run typecheck` · `npm start` (Expo)
- One test file: `npx --no-install jest path/to/file.test.ts`

## Language
- Talk to the team in **Spanish**. Everything committed (code, comments, docs, commits, PRs) is in **English**.

## Non-negotiable rules (from the professor's brief; violating any of them loses points)
1. **One generic engine.** `HexBoard<TCell>`, `IGameRules<TCell, TMove, TState>`, `GameEngine<TCell, TMove, TState>`,
   `IPieceSource<TPiece>`, `IScoringPolicy<TState>`, `IProgressModel` are written once. Each variant is an *instantiation*
   (TCell = Color, PieceId, ColorStack, number). Never copy board, rendering, persistence or game flow per variant.
   No `if/switch` on the variant inside the engine or the use cases: put the difference behind a Strategy.
2. **Open/Closed is tested live.** Adding a fifth variant or a scoring/board/piece rule must only add new classes or
   configuration. If your change edits `GameEngine` or an existing use case to support one variant, the design is wrong: stop and propose another.
3. **Clean Architecture, dependency rule inwards:** `infrastructure → adapters → application → domain`.
   Domain and application import no React, React Native, Expo or other framework, and no outer layer. Layer rules: `.claude/rules/`.
4. **SOLID everywhere**, and **GoF patterns** where they solve a real variability problem. Strategy and Abstract Factory
   (one factory per variant) are mandatory. Every pattern you introduce gets a justification in the change record.
5. **Infrastructure is a detail.** Randomness, clock, logging, storage, network, audio and i18n are reached through ports
   declared in the inner layer with intent names (`IProgressRepository.save`, never `saveToAsyncStorage`). The random source
   is injectable and seeded so every game is reproducible in tests.
6. **AOP without libraries:** cross-cutting concerns (logging, timing, error handling, caching, auth) are decorators/proxies
   around the generic use case. Never put `console.log` or try/catch-retry logic inside business code.
7. **Tests:** AAA, named `should_<expected>_when_<condition>`, behaviour not implementation. The engine is tested with a fake
   cell type. Every business rule in a use case spec has a test. Seeded randomness in tests.
8. **Git:** feature branch per change, Conventional Commits in English (`feat(hexa-sort): implement cascade transfer`), PR to `main`.
9. **AI transparency:** every significant AI contribution is recorded (change record + `AI_USAGE.md`). The team must be able to
   explain every line in the defence, so prefer clear code over clever code.

## Workflow (spec first; hooks enforce it, do not try to work around them)
1. **Spec.** Behaviour lives in `docs/specs/` (requirements `FR/NFR/C-###`, entity model, use cases `UC-###`). If the requested
   behaviour has no approved use case, write or update it with `/spec` and ask the team to review it. Never invent rules:
   if the brief is ambiguous, list the open question.
2. **Design proposal.** On a feature branch, copy `docs/ai/change-records/TEMPLATE.md` to `docs/ai/change-records/<branch>.md`
   (slashes become `__`) and fill the proposal sections (use the `architect` subagent). Set `Status: PROPOSED`.
   Present it in Spanish and **wait**. Only a human sets `Status: APPROVED`; until then `src/**` is locked. Tests may be written.
3. **Tests first** from the use case flows and business rules (`test-engineer` subagent).
4. **Implement** the smallest change that satisfies the spec. Synchronize, do not regenerate: touch only what the spec change requires.
5. **Verify**: typecheck, lint and tests green; run the `design-reviewer` subagent on the diff and fix what it finds.
6. **Explain** (see below), update the change record, then `/commit-pr`. Merging is a human decision.
Use `/implement UC-###` to run steps 2–6 and `/sync UC-###` when an existing use case changed.

## How to explain every change to the humans
End every turn that changed code with a section titled `## Explicación del cambio`, in Spanish, that covers:
- **Qué y por qué**: the use case / requirement IDs and the problem solved.
- **Capas**: each file touched and its Clean Architecture layer; confirm that no dependency points outwards.
- **SOLID**: only the principles actually at play, each with the concrete class and how it is satisfied (or the trade-off).
- **Patrones**: pattern name, the role each class plays (e.g. Strategy: `IScoringPolicy` = strategy, `GameEngine` = context), and why it beats the simpler alternative.
- **Extensibilidad**: what a fifth variant or a rule change would add, and which files it would NOT touch.
- **Pruebas**: the tests that prove the behaviour (names) and how you checked they fail when the rule is broken.
- **Riesgos y decisiones abiertas**: what the team should double-check or decide.
Short, concrete, with class names. No marketing language.

## Coding standards
- TypeScript strict; no `any` (use generics or `unknown` + narrowing); prefer `readonly` and immutable state; pure functions in the domain.
- Small classes with one reason to change; constructor injection; depend on interfaces; composition over inheritance
  except for the Template Method turn skeleton.
- Names speak the game's language in inner layers (`board`, `piece`, `line`, `merge`); technical names start in adapters.
- Bounded generics when the engine needs a capability (`TCell extends IMergeable<TCell>`); document why in the README.
- New dependency = ask the team first and check the package really exists (no hallucinated imports).

## Where things are
- Specs: `docs/specs/` · Architecture decisions: `docs/adr/` · Change records: `docs/ai/change-records/`
- Extensibility guide (mandatory deliverable): `docs/EXTENSIBILITY.md` · Diagrams (source + PNG): `docs/diagrams/`
- Layer rules load automatically from `.claude/rules/` when you touch those folders.

## Never
- Commit or push to `main`, force-push, use `--no-verify`, or change git identity/config.
- Edit the harness (`.claude/`, this file), lint rules, architecture tests or CI to make a check pass.
- Disable a lint rule, skip a test, or weaken an assertion to go green. Fix the cause or ask.
- Approve your own design proposal or mark a spec `Approved`.
