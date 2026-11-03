# Layer 1 — Domain (Entities)

The generic engine: board, topology, cells, pieces and the rule abstractions shared by every variant.

- Depends on nothing outside this folder: no other layer, no React, React Native or Expo.
- Names speak the game's language (`board`, `piece`, `line`, `merge`), never technical details (`json`, `http`, `storage`, `pixel`).
