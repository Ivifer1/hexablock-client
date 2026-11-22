# HexaBlock Suite — Project Overview & Architecture Rules

Mobile app with four hex-grid puzzle variants (Hexa Lines, Hexa Fit, Hexa Sort, Hexa Merge) built on ONE generic engine.
University project (Desarrollo de Software, UCAB), graded on design quality.
Stack: Expo + React Native + TypeScript (strict), Jest (jest-expo), ESLint, Node 24. Backend: `hexablock-backend`.

## Commands
- `npm test` · `npm run lint` · `npm run typecheck` · `npm start` (Expo)
- One test file: `npx --no-install jest path/to/file.test.ts`

## Communication Language
- Team communication & explanation: **Spanish**.
- Committed assets (code, comments, docs, commits, PRs): **English**.

## Non-negotiable Architectural Rules
1. **One Generic Engine:** `HexBoard<TCell>`, `IGameRules<TCell, TMove, TState>`, `GameEngine<TCell, TMove, TState>`, `IPieceSource<TPiece>`, `IScoringPolicy<TState>`, `IProgressModel` are written once. Each variant is an instantiation. Never copy board, rendering, persistence, or game flow per variant. Use Strategy pattern for variations.
2. **Open/Closed Principle:** Adding a variant or rule must only add new classes/configuration. Modifying `GameEngine` or existing use cases for a variant is forbidden.
3. **Clean Architecture Inward Rule:** `infrastructure → adapters → application → domain`. Domain/Application must not import React, React Native, Expo, or outer framework layers.
4. **SOLID & GoF Patterns:** Strategy and Abstract Factory are mandatory. Every pattern introduced requires justification.
5. **Infrastructure is a Detail:** External concerns (storage, clock, randomness, audio) are reached strictly via domain ports (`IProgressRepository`). The random source must be injectable and seeded for reproducible tests.
6. **AOP without Libraries:** Cross-cutting concerns (logging, timing, errors) are implemented using Decorators/Proxies around use cases.
7. **Testing Standards:** AAA pattern, named `should_<expected>_when_<condition>`. Engine is tested with fake cell types.
8. **Git Workflow:** Feature branch per change, Conventional Commits in English, PR to `main`.
9. **AI Transparency:** Record contributions in change records + `AI_USAGE.md`.

## Workflow Steps
1. **Spec:** Behaviour lives in `docs/specs/` (`FR/NFR/C-###`, use cases `UC-###`).
2. **Design Proposal:** Copy `docs/ai/change-records/TEMPLATE.md` to `docs/ai/change-records/<branch>.md`. Set `Status: PROPOSED`.
3. **Tests First:** Write tests before implementation.
4. **Implement:** Smallest change satisfying the spec.
5. **Verify:** Typecheck, lint, test execution, design review.
6. **Explain:** End every code-changing turn with a Spanish explanation (`## Explicación del cambio`).

## Explanation Format (Spanish)
End code modifications with `## Explicación del cambio` covering:
- **Qué y por qué:** UC/Requirement IDs and problem solved.
- **Capas:** Touched files and Clean Architecture layer validation.
- **SOLID:** Satisfied principles per class.
- **Patrones:** Pattern name, class roles, and trade-off justification.
- **Extensibilidad:** What adding a 5th variant modifies vs. avoids.
- **Pruebas:** Test suite verification.
- **Riesgos y decisiones abiertas:** Critical decisions for team review.

## Coding Standards
- TypeScript strict (no `any`, prefer `readonly` and immutable state).
- Small classes with single responsibility, constructor injection, interface dependency.
- Domain terms in inner layers (`board`, `piece`, `line`, `merge`).

## Critical Prohibitions
- Never commit/push directly to `main` or force-push.
- Never edit lint rules, harness configs, or skip tests to bypass checks.