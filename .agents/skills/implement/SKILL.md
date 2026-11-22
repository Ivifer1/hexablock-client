---
name: implement
description: Implement an approved use case end to end (proposal → human approval → tests → code → verification → explanation). Use when the team says "implement UC-###" or asks for a feature that has an approved spec.
argument-hint: "UC-###"
---
# /implement UC-### — spec-driven implementation

Follow these steps in order. Hooks block shortcuts; if a hook blocks you, read its message and comply.

1. **Context.** Read the use case, its linked requirements, the entity model, `.agents/rules/solid.md`, `CLAUDE.md`, relevant ADRs, and the code it touches.
   If the use case is not `Approved`, stop and offer `/spec`.
2. **Branch.** If on `main`, create `feat/<scope>-<short-name>` (or `fix/…`, `refactor/…`).
3. **Proposal.** Delegate to the `architect` subagent to write the proposal into the branch change record (`Status: PROPOSED`). Ensure the design explicitly defines Clean Architecture layer boundaries, Port/Interface segregation (DIP/ISP), and SOLID principles compliance (`.agents/rules/solid.md`).
   Read it critically and fix weak justifications or architectural violations.
4. **Ask for approval.** Present the proposal to the team in Spanish (design summary, architectural decisions, SOLID compliance strategy) and STOP.
   Do not continue until a human has set `Status: APPROVED` in the file. Never write that line yourself.
5. **Tests first.** Delegate to `test-engineer`: tests from the main flow, alternatives, and business rules. Confirm they fail for the right reason.
6. **Implement.** Make the smallest change that makes tests pass, working layer by layer from the inside out (domain → application → adapters → infrastructure).
   - **SOLID Principles Guardrails:**
     - **SRP (Single Responsibility):** Ensure UI components only render ViewModels, Presenters only format data, Controllers only handle input translation, and Use Cases only execute core business logic.
     - **OCP (Open/Closed):** Extend behavior through polymorphism/Strategy pattern (e.g., `IGameMode`, `ICellPresenter`) instead of modifying `switch` or `if/else` logic.
     - **LSP (Liskov Substitution):** Ensure all concrete implementations fulfill interface contracts completely without throwing `NotImplementedException` or breaking expectations.
     - **ISP (Interface Segregation):** Keep Input (`IInputPort`) and Output (`IOutputPort`) interfaces lean and targeted.
     - **DIP (Dependency Inversion):** Depend on abstractions. Inject all concrete dependencies externally via the `CompositionRoot`.
   Respect the approved design; if you need to deviate, stop, explain why, and update the proposal for re-approval.
7. **Verify.** Run `npm run typecheck`, `npm run lint`, and `npm test` (backend: also `npm run test:e2e`). Run the `design-reviewer` subagent to audit Clean Architecture layer boundaries and SOLID compliance (`.agents/rules/solid.md`), then fix every blocking finding.
8. **Record.** Fill "Implementation notes", "Verification", and "AI usage" in the change record; update `docs/specs/dashboard.md` and, if the engine's extension points changed, `docs/EXTENSIBILITY.md` (client) or the OpenAPI docs (backend).
9. **Explain.** Finish with `## Explicación del cambio` in Spanish (format in `CLAUDE.md`).
10. Offer `/commit-pr`. Do not push or merge without the team's go-ahead.