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

const innerPurityRules = {
  'no-restricted-globals': [
    'error',
    {
      name: 'fetch',
      message: 'Inner layers must depend on a gateway port instead of calling fetch directly.',
    },
    {
      name: 'setTimeout',
      message: 'Inner layers must depend on a port instead of timers.',
    },
    {
      name: 'setInterval',
      message: 'Inner layers must depend on a port instead of timers.',
    },
  ],
  'no-restricted-properties': [
    'error',
    {
      object: 'Math',
      property: 'random',
      message: 'Use an injectable IRandomSource port instead of Math.random() in inner layers.',
    },
    {
      object: 'Date',
      property: 'now',
      message: 'Use an injectable IClock port instead of Date.now() in inner layers.',
    },
  ],
  'no-restricted-syntax': [
    'error',
    {
      selector: "NewExpression[callee.name='Date']",
      message: 'Use an injectable IClock port instead of new Date() in inner layers.',
    },
    {
      selector: "BinaryExpression[operator='instanceof']",
      message: 'Avoid instanceof in inner layers; use polymorphism or a Strategy (OCP/LSP).',
    },
  ],
};

const srpComplexityRules = {
  complexity: ['error', 10],
  'max-depth': ['error', 3],
  'max-params': ['error', 5],
  'max-lines': ['warn', { max: 350, skipBlankLines: true, skipComments: true }],
};

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    rules: {
      'no-console': 'error',
    },
  },
  {
    files: ['src/domain/**'],
    rules: {
      ...restrictImports([
        layer('application'),
        layer('adapters'),
        layer('infrastructure'),
        uiAndFrameworkPackages,
      ]),
      ...innerPurityRules,
    },
  },
  {
    files: ['src/application/**'],
    rules: {
      ...restrictImports([layer('adapters'), layer('infrastructure'), uiAndFrameworkPackages]),
      ...innerPurityRules,
    },
  },
  {
    files: ['src/adapters/**'],
    rules: restrictImports([layer('infrastructure'), uiAndFrameworkPackages]),
  },
  {
    files: ['src/domain/**', 'src/application/**', 'src/adapters/**'],
    rules: srpComplexityRules,
  },
]);
