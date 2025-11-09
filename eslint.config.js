// eslint.config.js (flat config)
const { defineConfig } = require('eslint/config');
const expo = require('eslint-config-expo/flat');

module.exports = defineConfig([
  // Expo’s recommended config
  ...expo,

  // Jest/test file globals so ESLint stops complaining
  {
    files: ['**/*.test.js', '**/*.test.jsx', '**/__tests__/**/*.[jt]s?(x)'],
    languageOptions: {
      globals: {
        jest: true,
        test: true,
        expect: true,
        describe: true,
        beforeEach: true,
        afterEach: true,
        beforeAll: true,
        afterAll: true,
      },
    },
    rules: {
      // our test mock returns a component; don't force display-name in tests
      'react/display-name': 'off',
    },
  },

  // ignore build/cache paths
  {
    ignores: ['dist/*', '.expo/*', 'node_modules/*', '.jest-cache/*'],
  },
]);
