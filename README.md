# HexaBlock Suite — Client

<!-- Badges: CI, coverage, license, release -->

Mobile app with four hex-grid puzzle variants (Hexa Lines, Hexa Fit, Hexa Sort, Hexa Merge) built on a single generic engine.

> Work in progress. Sections below are placeholders to be completed as the project evolves.

## Architecture

Clean Architecture with four layers. Source code dependencies only point inwards:

```
src/infrastructure  →  src/adapters  →  src/application  →  src/domain
```

| Folder | Layer | Contains |
|---|---|---|
| `src/domain` | Entities | Generic engine, board, topology, rule abstractions |
| `src/application` | Use Cases | Generic use cases and the ports they depend on |
| `src/adapters` | Interface Adapters | Presenters, view models, mappers, port implementations |
| `src/infrastructure` | Frameworks | React Native screens, Expo, storage, network, composition root |

The dependency rule is enforced by ESLint (`no-restricted-imports` in `eslint.config.js`): an inner layer that imports an outer layer, or React / React Native / Expo, fails `npm run lint` and CI. `test/architecture/layer-boundaries.test.ts` pins that configuration.

Inner layers also avoid structural coupling in their names: ports and methods state intent (`IProgressRepository.save`), never the mechanism (`postToApi`, `sendEmail`). Each layer folder has a README with its rules.

Diagram: TBD (see `/docs`).

## Generic Engine

TBD — `HexBoard<TCell>`, `IGameRules<TCell, TMove, TState>`, `GameEngine<TCell, TMove, TState>` and bounded generics rationale.

## Design Patterns

TBD

## SOLID

TBD

## AOP

TBD

## Getting Started

Prerequisites: Node.js 24 and npm. Expo Go on a device, or an Android emulator / iOS simulator.

```bash
npm install
npm start        # Expo dev server; press a for Android, i for iOS
```

## Tests

```bash
npm test         # Jest (jest-expo preset)
npm run lint     # ESLint, including the layer dependency rule
npm run typecheck
```

Tests follow the AAA pattern and are named `should_[expected_result]_when_[condition]`. CI (`.github/workflows/ci.yml`) runs lint, typecheck and tests on every pull request.

## AI Usage

See [AI_USAGE.md](AI_USAGE.md).

## Contributing

- Branch from `main` and open a pull request; direct pushes to `main` are blocked.
- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/) in English.

## License

TBD
