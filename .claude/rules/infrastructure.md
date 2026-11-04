---
paths:
  - "src/infrastructure/**"
  - "index.ts"
---
# Frameworks & Infrastructure layer

Purpose: the volatile details — React Native screens and components, navigation, Expo modules, storage, network clients,
audio, i18n setup — and the composition root.

Rules:
- The composition root is the ONLY place that knows concrete classes: it builds adapters, applies AOP decorators to use cases,
  and registers each variant's Abstract Factory in a registry. Adding a variant = adding one registration here plus new classes.
- Screens render view-model state and forward user intents; no game logic, no scoring, no persistence calls in components.
- Lifecycle singletons (AudioManager, SessionManager) are provided as single instances by the composition root (DI with single scope)
  rather than global mutable state.
- Strings shown to users come from i18n resources (Spanish and English at least).
- Configuration (API base URL, feature flags) is read here and injected inward.
