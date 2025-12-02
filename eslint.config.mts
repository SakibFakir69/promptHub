import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import globals from 'globals';

export default [
  // Base JS rules
  {
    ...js.configs.recommended,
  },

  // TypeScript rules
  {
    files: ['**/*.ts', '**/*.mts'],
    languageOptions: {
      parser: tsParser,
      sourceType: 'module',
      ecmaVersion: 'latest',
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      // Disable strict "any" rule for flexibility
      '@typescript-eslint/no-explicit-any': 'off',

      // Allow unused vars only if starts with _
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],

      // Allow require() inside TS if needed
      '@typescript-eslint/no-var-requires': 'off',
    },
  },

  // Global ignore list
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**'],
  },
];
