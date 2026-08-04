// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const angular = require('@angular-eslint/eslint-plugin');
const angularTemplate = require('@angular-eslint/eslint-plugin-template');
const angularTemplateParser = require('@angular-eslint/template-parser');

const ANGULAR_RECOMMENDED = [
  'contextual-lifecycle',
  'no-empty-lifecycle-method',
  'no-input-rename',
  'no-inputs-metadata-property',
  'no-output-native',
  'no-output-on-prefix',
  'no-output-rename',
  'no-outputs-metadata-property',
  'prefer-inject',
  'prefer-on-push-component-change-detection',
  'prefer-standalone',
  'use-pipe-transform-interface',
];

const TEMPLATE_RECOMMENDED = ['banana-in-box', 'eqeqeq', 'no-negated-async', 'prefer-control-flow'];

module.exports = [
  {
    ignores: [
      'projects/**/*',
      'dist/**',
      'node_modules/**',
      '.angular/**',
      'coverage/**',
      'out-tsc/**',
    ],
  },
  {
    files: ['**/*.ts'],
    plugins: {
      '@typescript-eslint': tseslint,
      '@angular-eslint': angular,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ['./tsconfig.json', './e2e/tsconfig.json'],
        tsconfigRootDir: __dirname,
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        navigator: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        location: 'readonly',
        history: 'readonly',
        fetch: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
        process: 'readonly',
        django: 'readonly',
        cookieconsent: 'readonly',
      },
    },
    rules: {
      ...eslint.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      ...Object.fromEntries(ANGULAR_RECOMMENDED.map((r) => [`@angular-eslint/${r}`, 'error'])),
      'no-undef': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@angular-eslint/prefer-standalone': 'off',
      '@angular-eslint/prefer-on-push-component-change-detection': 'off',
      '@angular-eslint/prefer-inject': 'warn',
      '@angular-eslint/no-empty-lifecycle-method': 'off',
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: 'uds', style: 'kebab-case' },
      ],
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: 'uds', style: 'camelCase' },
      ],
      '@typescript-eslint/consistent-type-definitions': 'error',
      '@typescript-eslint/dot-notation': 'off',
      '@typescript-eslint/explicit-member-accessibility': 'off',
      'brace-style': ['error', '1tbs'],
      'id-blacklist': 'off',
      'id-match': 'off',
      'no-underscore-dangle': 'off',
    },
  },
  {
    files: ['**/*.html'],
    plugins: {
      '@angular-eslint/template': angularTemplate,
    },
    languageOptions: {
      parser: angularTemplateParser,
    },
    rules: {
      ...Object.fromEntries(TEMPLATE_RECOMMENDED.map((r) => [`@angular-eslint/template/${r}`, 'error'])),
    },
  },
];
