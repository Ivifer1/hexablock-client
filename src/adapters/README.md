# Layer 3 — Interface Adapters

Presenters, view models, controllers, mappers and the implementations of the ports declared in `application`.

- Depends on `application` and `domain`, never on `infrastructure`.
- This is the first layer where technical names (`HttpProgressRepository`, `JsonLevelSource`) belong.
