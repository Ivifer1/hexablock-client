# Implementation notes — Inicio

Status: Pending approval

No source files are changed for this screen yet. Implementation begins only
after the approved use case and change record exist.

## Intended seams

- Data source: `IGameModeRegistry`.
- Presenter/controller: adapter layer, to keep React Native components free of
  game rules.
- View model: focused Home DTO containing descriptors and localized progress
  state.
- Navigation: entry kind decides direct game or level selection.
- P-18: session and ranking are part of the mandatory screen.
