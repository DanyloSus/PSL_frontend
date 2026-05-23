import storybook from "eslint-plugin-storybook";

import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'
import react from 'eslint-plugin-react'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import importPlugin from 'eslint-plugin-import'
import prettierRecommended from 'eslint-plugin-prettier/recommended'
import testingLibrary from 'eslint-plugin-testing-library'
import jestDom from 'eslint-plugin-jest-dom'
import vitest from '@vitest/eslint-plugin'
import checkFile from 'eslint-plugin-check-file'
import boundaries from 'eslint-plugin-boundaries'

export default defineConfig([
  globalIgnores(['dist', 'node_modules', 'build', 'coverage', 'public', '**/routeTree.gen.ts']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      react.configs.flat.recommended,
      react.configs.flat['jsx-runtime'],
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      jsxA11y.flatConfigs.recommended,
      importPlugin.flatConfigs.recommended,
      importPlugin.flatConfigs.typescript,
      jestDom.configs['flat/recommended'],
      testingLibrary.configs['flat/react'],
      vitest.configs.recommended,
      prettierRecommended,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2020,
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      react: { version: 'detect' },
      'import/resolver': {
        typescript: { alwaysTryTypes: true },
      },
      'boundaries/elements': [
        { type: 'feature', pattern: 'src/features/*', capture: ['featureName'] },
        { type: 'app', pattern: 'src/app' },
        { type: 'components', pattern: 'src/components' },
        { type: 'hooks', pattern: 'src/hooks' },
        { type: 'lib', pattern: 'src/lib' },
        { type: 'types', pattern: 'src/types' },
        { type: 'utils', pattern: 'src/utils' },
      ],
    },
    plugins: {
      'check-file': checkFile,
      boundaries,
    },
    rules: {
      // Boundaries
      'boundaries/dependencies': [
        'error',
        {
          default: 'allow',
          rules: [
            // features may not import from other features
            {
              from: [{ type: 'feature', captured: { featureName: '{{featureName}}' } }],
              disallow: [{ to: { type: 'feature', captured: { featureName: '!{{featureName}}' } } }],
            },
            // features may not import from app
            { from: [{ type: 'feature' }], disallow: [{ to: { type: 'app' } }] },
            // shared layers may not import from features or app
            {
              from: [
                { type: 'components' },
                { type: 'hooks' },
                { type: 'lib' },
                { type: 'types' },
                { type: 'utils' },
              ],
              disallow: [{ to: { type: 'feature' } }, { to: { type: 'app' } }],
            },
          ],
        },
      ],

      // Imports
      'import/no-cycle': 'error',
      'import/no-duplicates': 'error',
      'import/newline-after-import': ['error', { count: 1 }],
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling'], 'index', 'object'],
          pathGroups: [
            { pattern: 'react', group: 'builtin', position: 'before' },
            { pattern: 'components/**', group: 'internal', position: 'before' },
            { pattern: 'ui/**', group: 'internal', position: 'before' },
            { pattern: '**/styles', group: 'object', position: 'after' },
            { pattern: 'api|features|stores/**', group: 'parent', position: 'after' },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'import/default': 'off',
      'import/no-named-as-default-member': 'off',
      'import/no-named-as-default': 'off',

      // Core
      'linebreak-style': ['error', 'unix'],
      'no-empty': 'error',
      'no-nested-ternary': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-arrow-callback': 'error',
      'prefer-spread': 'error',
      'prefer-rest-params': 'error',
      'prefer-destructuring': 'off',
      'no-unused-expressions': 'off',
      'no-empty-function': 'off',
      'require-await': 'off',
      'default-case': 'error',
      'default-case-last': 'error',
      'default-param-last': 'off',
      'eqeqeq': ['error', 'always', { null: 'ignore' }],
      'no-use-before-define': 'error',
      'no-unused-vars': ['warn', { vars: 'all', args: 'after-used', ignoreRestSiblings: true }],
      'no-template-curly-in-string': 'warn',
      'no-duplicate-imports': ['error'],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../../*'],
              message: "Use absolute imports with @/ instead of relative paths with multiple '../'",
            },
          ],
        },
      ],
      'id-length': [
        'warn',
        { min: 2, exceptions: ['_', 'i', 'j', 't', 'm', 'p', 'r', 'x', 'y', 'z'] },
      ],
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'return' },
      ],

      // React
      'react/prop-types': 'off',
      'react/display-name': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-key': 'error',
      'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],

      // React Hooks
      'react-hooks/exhaustive-deps': 'off',

      // Accessibility
      'jsx-a11y/anchor-is-valid': 'off',

      // TypeScript
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': ['off'],
      '@typescript-eslint/explicit-module-boundary-types': ['off'],
      '@typescript-eslint/no-empty-function': ['off'],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-mixed-enums': 'error',
      '@typescript-eslint/default-param-last': 'error',
      '@typescript-eslint/prefer-destructuring': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'variable',
          types: ['boolean'],
          format: ['camelCase', 'UPPER_CASE'],
          custom: {
            regex:
              '^(?:is|has|should|can|did|will|are)[A-Z][a-zA-Z0-9]*$|^(?:IS|HAS|SHOULD|CAN|DID|WILL|ARE)_[A-Z0-9_]*$',
            match: true,
          },
        },
        {
          selector: 'parameter',
          types: ['boolean'],
          format: ['camelCase'],
          custom: {
            regex: '^(?:is|has|should|can|did|will|are)[A-Z][a-zA-Z0-9]*$',
            match: true,
          },
        },
      ],

      // Prettier
      'prettier/prettier': ['error', {}, { usePrettierrc: true }],

      // File naming
      'check-file/filename-naming-convention': [
        'error',
        { '**/*.{ts,tsx}': 'KEBAB_CASE' },
        { ignoreMiddleExtensions: true },
      ],
    },
  },
  // Folder naming convention
  {
    files: ['src/**/!(__tests__)/*'],
    plugins: { 'check-file': checkFile },
    rules: {
      'check-file/folder-naming-convention': ['error', { '**/*': 'KEBAB_CASE' }],
    },
  },
  // Component file size limit
  {
    files: ['**/components/**/*.{tsx,jsx}'],
    rules: {
      'max-lines': ['warn', { max: 150, skipBlankLines: true, skipComments: true }],
    },
  },
  // Exempt TanStack Router generated/convention files from filename rules
  {
    files: ['**/__root.tsx'],
    plugins: { 'check-file': checkFile },
    rules: {
      'check-file/filename-naming-convention': 'off',
    },
  },
  ...storybook.configs["flat/recommended"]
])
