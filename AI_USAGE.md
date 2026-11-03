# AI Usage

## Tools

TBD

## Task Log

| Date | Task | Prompt | Result | Changes made |
|------|------|--------|--------|--------------|
| 2026-10-31 | Client project scaffold | "Set up the client: Expo + TypeScript, four Clean Architecture layers, a lint rule that blocks inner layers from importing outer layers, and CI" | Expo base project, `src/` layer folders with READMEs, ESLint `no-restricted-imports` rule per layer, architecture test, GitHub Actions workflow | Pending team review in the PR. Config passed to ESLint directly in the test so Jest does not need experimental flags; Node types kept out of `tsconfig` so `domain` cannot use Node APIs |

## Critical Evaluation

TBD — estimated percentage of AI-assisted work and errors detected.
