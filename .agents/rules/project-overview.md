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
9. **AI Transparency & Anomaly Tracking:** Record all AI contributions in change records and `AI_USAGE.md`. Every entry MUST document any incorrect suggestions, antipatterns, or bugs proposed by the AI and how the team caught and corrected them.
10. **Three-Gate Quality Checklists:** Strict adherence to `.agents/checklists/`:
    - Gate 1: `pre_implementation.md` (Design proposal approved by human BEFORE editing `src/**`).
    - Gate 2: `post_implementation.md` (Clean Architecture isolation, SOLID, GoF, and tests pass).
    - Gate 3: `pre_commit.md` (Documentation updated, AI_USAGE with anomalies logged, Conventional Commits).

## Workflow Steps
1. **Spec:** Behaviour lives in `docs/specs/` (`FR/NFR/C-###`, use cases `UC-###`).
2. **Design Proposal (Gate 1):** Copy `docs/ai/change-records/TEMPLATE.md` to `docs/ai/change-records/<branch>.md`. Set `Status: PROPOSED`. Stop and wait for human approval (`Status: APPROVED`).
3. **Tests First:** Write tests before implementation using In-Memory Fakes and AAA.
4. **Implement:** Smallest change satisfying the spec.
5. **Verify (Gate 2):** Typecheck, lint, test execution, Clean Architecture layers review.
6. **Audit & Commit (Gate 3):** Update change record, log AI usage with anomalies in `AI_USAGE.md`, then commit with Conventional Commits.
7. **Explain:** End every code-changing turn with a Spanish explanation (`## Explicación del cambio`).

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