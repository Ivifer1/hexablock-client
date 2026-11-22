---
paths:
  - "test/**"
  - "src/**/*.test.ts"
  - "src/**/*.test.tsx"
---
# Testing rules

- Tests derive from specs: the main flow of a `UC-###` is the happy-path test, each alternative flow a scenario, each business rule an assertion.
  Put the ID in the `describe` (`describe('UC-010 Slide tiles in Hexa Merge', …)`).
- Name: `should_<expected_result>_when_<condition>` (e.g. `should_clear_three_lines_when_piece_completes_all_axes`).
- Structure: AAA with `// Arrange`, `// Act`, `// Assert` comments; one behaviour per test.
- Test behaviour through public APIs, not private details; tests must survive refactors.
- The generic engine is tested with a fake cell/move/state type (test double) to prove it does not depend on any variant.
- Use seeded random sources and fake clocks; never real randomness, time or network.
- Mocks/stubs/fakes replace ports (repositories, gateways). Prefer hand-written fakes over deep mocking.
- Mandatory per variant: line clearing on the 3 axes (Lines), exact coverage (Fit), cascade transfer (Sort), merge on collision (Merge),
  game-over conditions, undo/redo where applicable.
- Before accepting a test, prove it can fail: break the rule temporarily and see it go red.
- Never skip (`.skip`, `xit`), delete or weaken a test to make the suite pass.
