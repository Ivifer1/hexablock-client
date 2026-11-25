/* global jest */
const isReactNativeTestEnv =
  typeof globalThis.__DEV__ !== 'undefined' &&
  typeof globalThis.window !== 'undefined';

if (isReactNativeTestEnv) {
  jest.mock('react-native-worklets', () => require('react-native-worklets/lib/module/mock'));
  require('react-native-reanimated').setUpTests();
  require('react-native-gesture-handler/jestSetup');

  jest.mock(
    'react-native-gesture-handler/src/v3/detectors/useEnsureGestureHandlerRootView',
    () => ({ useEnsureGestureHandlerRootView: () => undefined }),
  );
  jest.mock(
    'react-native-gesture-handler/lib/module/v3/detectors/useEnsureGestureHandlerRootView',
    () => ({ useEnsureGestureHandlerRootView: () => undefined }),
  );
}
