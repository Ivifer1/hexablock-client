# Change record: feat/infrastructure-motion

Status: PROPOSED
<!-- Only a human changes this line to "Status: APPROVED" (hooks block the agent from doing it). -->
Author(s): Leonardo Ibarra with Antigravity
Date: 2026-11-25

## Spec and traceability
- Use cases: UC-005, UC-006 (Home presentation & reduced-motion accessibility support)
- Requirements: FR-001, C-004, C-008
- Business rules covered: Reduced-motion respect (`reduceMotion` disables non-essential spring/timing motion) and responsive mode selection interactions.

## Problem
The app relied on inline `react-native` `Animated.Value` instances and manual `GestureResponder` swipe handlers scattered across `HomeScreen`, `HexModeSelector`, `HexShowcaseFrame`, and `ModeSelectorTile`. Upgrading to `react-native-reanimated` (`4.7.1`), `react-native-worklets` (`0.13.0`), and `react-native-gesture-handler` (`~3.3.0`) directly inside screens would tightly couple UI components to third-party animation/gesture APIs and leak framework dependencies.

## Proposed design
Introduce a decoupled motion and gesture facade inside `src/infrastructure/motion/` behind an ISP-compliant `IMotionAdapter` interface so screens and reusable components never import `react-native-reanimated`, `react-native-worklets`, or `react-native-gesture-handler` directly.

| Type | Kind | Layer | Responsibility (one sentence) |
| --- | --- | --- | --- |
| `IMotionAdapter` | interface (adapter port) | infrastructure/motion | Defines 5 cohesive motion/gesture UI primitives (`Root`, `Scale`, `Pulse`, `Fade`, `Swipeable`) without third-party types. |
| `reanimatedMotionAdapter` | adapter object | infrastructure/motion | Implements `IMotionAdapter` using `react-native-reanimated` and `react-native-gesture-handler` in a single isolated module. |
| `MotionProvider` / `useMotionAdapter` / facade components | React context + facade | infrastructure/motion | Injects the active `IMotionAdapter` and exposes `MotionRoot`, `AnimatedScale`, `AnimatedPulse`, `AnimatedFade`, and `SwipeableSurface`. |
| `MOTION_SPRINGS` / `MOTION_TIMINGS` | presets | infrastructure/motion | Centralizes spring physics and timing durations derived from `src/infrastructure/theme` tokens. |
| `useReducedMotion` | hook | infrastructure/motion | Subscribes to `AccessibilityInfo` reduced-motion preferences with safe unmount cleanup. |

## Clean Architecture
- Dependency directions: `infrastructure/HomeScreen` and `infrastructure/home/*` → `infrastructure/motion` (facade/types) ← `ReanimatedMotionAdapter`.
- Zero edits to `src/domain/`, `src/application/`, or `src/adapters/`; all animation and gesture libraries remain strictly confined to `src/infrastructure/motion/ReanimatedMotionAdapter.tsx`.
- Wired at `src/infrastructure/App.tsx` via `<MotionRoot>` (which defaults to `reanimatedMotionAdapter` via `MotionProvider` context and can be overridden in tests or alternative adapters).

## SOLID
- **SRP:** `useReducedMotion` handles OS accessibility subscription, `presets.ts` holds motion constants, `MotionContext.tsx` resolves the injected adapter, and `ReanimatedMotionAdapter.tsx` encapsulates Reanimated/Gesture Handler bindings.
- **OCP:** Swapping or extending motion implementations (e.g., a CSS/web-only adapter or reduced-motion static adapter) requires adding a new `IMotionAdapter` implementation and passing it to `<MotionProvider adapter={...}>`, without modifying `HomeScreen`, `HomeModeCard`, `HexShowcaseFrame`, or `ModeSelectorTile`.
- **LSP:** Any `IMotionAdapter` implementation honors the same primitive props (`MotionRootProps`, `AnimatedScaleProps`, `AnimatedPulseProps`, `AnimatedFadeProps`, `SwipeableSurfaceProps`) and `reduceMotion` contract without throwing.
- **ISP:** `IMotionAdapter` exposes only 5 focused primitive components rather than a monolithic animation API.
- **DIP:** Screens and UI components depend on `IMotionAdapter` / facade components (`AnimatedScale`, `AnimatedPulse`, `AnimatedFade`, `SwipeableSurface`, `MotionRoot`), not concrete `react-native-reanimated` or `react-native-gesture-handler` APIs.

## Design patterns
| Pattern | Participants (role → class/module) | Problem it solves here | Simpler alternative rejected and why |
| --- | --- | --- | --- |
| Adapter | Target: `IMotionAdapter`; Adaptee: `react-native-reanimated` & `react-native-gesture-handler`; Adapter: `reanimatedMotionAdapter` | Isolates volatile native animation/gesture APIs to one file. | Direct imports in every screen/component would scatter third-party coupling and complicate Jest mocking and upgrades. |
| Facade | Facade: `src/infrastructure/motion/index.ts` (`MotionRoot`, `AnimatedScale`, `AnimatedPulse`, `AnimatedFade`, `SwipeableSurface`) | Hides shared values, animated styles, and pan gesture setup behind declarative React components. | Exposing `useSharedValue` wrappers would leak Reanimated concepts into screens. |
| Strategy (via React Context DI) | Context: `MotionProvider`; Strategy: `IMotionAdapter` | Allows injecting fake or alternative motion adapters at runtime or in tests. | Hardcoding `ReanimatedMotionAdapter` directly inside facade exports would block testability/swappability. |

## Extensibility and infrastructure independence
- To swap the animation engine (e.g., a different gesture/animation library or mock), create a new object implementing `IMotionAdapter` and pass it to `<MotionProvider adapter={customAdapter}>`.
- Files that would NOT change: `src/domain/**`, `src/application/**`, `src/adapters/**`, `src/infrastructure/HomeScreen.tsx`, `src/infrastructure/HexModeSelector.tsx`, `src/infrastructure/home/HexShowcaseFrame.tsx`, `src/infrastructure/home/HomeModeCard.tsx`, `src/infrastructure/home/ModeSelectorTile.tsx`.
- Jest setup (`jest.setup.js`) guards React Native mocks behind `isReactNativeTestEnv` so `@jest-environment node` architecture tests remain unaffected.

## Alternatives considered
1. **React Bits (`reactbits.dev`):** Rejected because React Bits targets React Web DOM (`<div>`, `<canvas>`, CSS/Tailwind, GSAP/OGL) and is incompatible with Expo / React Native native targets.
2. **HyperFrames (`heygen-com/hyperframes`):** Rejected because it is an HTML-to-MP4 video rendering engine (headless Chrome + FFmpeg), not a real-time interactive mobile UI animation library.
3. **Inline `react-native-reanimated` imports in screens:** Rejected because it violates decoupling and makes future API upgrades or test isolation harder.

## Test plan
| Spec element (flow / BR) | Test name (`should_…_when_…`) | Level (unit / integration / e2e / UI) |
| --- | --- | --- |
| Motion facade primitives | `should_render_children_through_default_reanimated_motion_primitives_when_mounted` | UI |
| Reduced motion & key transitions | `should_update_primitives_cleanly_when_trigger_keys_and_reduce_motion_change` | UI |
| DIP / Strategy swap | `should_delegate_to_injected_motion_adapter_when_custom_provider_is_used` | UI |
| Accessibility reduced-motion hook | `should_read_and_subscribe_to_reduced_motion_preference_when_hook_is_used` | unit |
| Package isolation boundary | `should_keep_animation_and_gesture_packages_isolated_to_infrastructure_motion_module` | architecture/unit |

## Open questions for the team
1. Should `eslint.config.js` be updated (guardrail change requiring human review) to add `'react-native-*'` to `uiAndFrameworkPackages` so ESLint itself also blocks any accidental `react-native-reanimated` / `react-native-gesture-handler` / `react-native-worklets` imports in `domain`, `application`, and `adapters`?
2. Should `babel.config.js` be created explicitly or continue relying on `babel-preset-expo` auto-detecting `react-native-worklets/plugin`?

## Implementation notes
- Installed via `npx expo install`: `react-native-reanimated@4.7.1`, `react-native-worklets@0.13.0`, `react-native-gesture-handler@~3.3.0`.
- `babel-preset-expo` automatically injects `react-native-worklets/plugin` when `react-native-worklets` is installed, so no duplicate `babel.config.js` plugin entry was added.
- `ReanimatedSwipeable` uses the non-deprecated RNGH v3 `usePanGesture` hook (`runOnJS: true`, `onDeactivate`) with `GestureDetector`.
- `jest.setup.js` mocks `react-native-worklets` using `react-native-worklets/lib/module/mock`, initializes `react-native-reanimated` (`setUpTests()`), loads `react-native-gesture-handler/jestSetup`, and bypasses `useEnsureGestureHandlerRootView` only in the Jest RN environment so isolated component tests (`HomeScreen`) render cleanly without `<MotionRoot>`.

## Verification
- `npm run check:solid` (`eslint .` && `tsc --noEmit` && `jest test/architecture`): passed (0 ESLint errors/warnings, 0 TypeScript errors, 3/3 architecture suites, 55/55 tests passed).
- `npm test`: passed (14/14 suites, 151/151 tests passed, including `test/infrastructure/motion.test.tsx` and `test/infrastructure/home-screen.test.tsx`).

## AI usage
- Tool/model: Antigravity (Gemini)
- Summary: Evaluated React Bits and HyperFrames compatibility, installed Expo SDK 58-compatible Reanimated/Worklets/Gesture Handler on `feat/infrastructure-motion` from `dev`, designed and implemented `src/infrastructure/motion/` adapter+facade, migrated Home components, and wrote unit/isolation tests.
