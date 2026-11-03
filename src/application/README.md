# Layer 2 — Application (Use Cases)

Generic use cases (one per action, not one per game) and the ports they need, such as `IProgressRepository` or `ILevelSource`.

- Depends only on `domain`.
- Anything external (persistence, network, randomness, time) is reached through a port defined here and implemented in an outer layer.
- Port and method names state intent (`save(progress)`, `notify(player, message)`), never the mechanism (`postToApi`, `sendEmail`). Mechanism names in an inner layer are structural coupling.
