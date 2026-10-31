// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

// Clean Architecture dependency rule: source code dependencies only point inwards.
// infrastructure -> adapters -> application -> domain
const layer = (name) => ({
  group: [`**/${name}`, `**/${name}/**`],
  message: `This layer must not depend on the outer "${name}" layer. Depend on a port instead.`,
});

const uiAndFrameworkPackages = {
  group: ['react', 'react/**', 'react-native', 'react-native/**', 'expo', 'expo-*', '@expo/**'],
  message: 'Inner layers must not depend on UI or framework packages. Depend on a port instead.',
};

const restrictImports = (patterns) => ({
  'no-restricted-imports': ['error', { patterns }],
});

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  {
    files: ['src/domain/**'],
    rules: restrictImports([
      layer('application'),
      layer('adapters'),
      layer('infrastructure'),
      uiAndFrameworkPackages,
    ]),
  },
  {
    files: ['src/application/**'],
    rules: restrictImports([layer('adapters'), layer('infrastructure'), uiAndFrameworkPackages]),
  },
  {
    files: ['src/adapters/**'],
    rules: restrictImports([layer('infrastructure')]),
  },
]);
