import js from '@eslint/js'
import pluginImport from 'eslint-plugin-import'
import pluginNode from 'eslint-plugin-node'
import pluginPromise from 'eslint-plugin-promise'

export default [
  js.configs.recommended,

  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly'
      }
    },
    plugins: {
      node: pluginNode,
      import: pluginImport,
      promise: pluginPromise
    },
    rules: {
      // General
      'no-unused-vars': 'warn',

      // Backend environment
      'node/no-unsupported-features/es-syntax': 'off',

      // Import hygiene
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always'
        }
      ]
    }
  }
]
