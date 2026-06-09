// @ts-check
import { default as angular, default as pkg } from '@angular-eslint/eslint-plugin';
import angularTemplate from '@angular-eslint/eslint-plugin-template';
import { default as angularTemplateParser } from '@angular-eslint/template-parser';
import markdown from '@eslint/markdown';
import angularEslint from 'angular-eslint';
import boundaries from 'eslint-plugin-boundaries';
import header from 'eslint-plugin-header';
import jsdoc from 'eslint-plugin-jsdoc';
import prettier from 'eslint-plugin-prettier';
import tseslint from 'typescript-eslint';

const { configs: angularConfigs } = pkg;

header.rules.header.meta.schema = false;

// Define the configuration
export default [
  {
    ignores: [
      '.angular/**',
      'dist/**',
      'documentation/**',
      'out-tsc/**',
      'playwright-report/**',
      'test-results/**',
      'tmp/**',
    ],
  },
  // Configuration for TypeScript files
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: './tsconfig.spec.json',
      },
    },
    processor: angularEslint.processInlineTemplates,
    plugins: {
      '@angular-eslint': angular,
      tseslint,
      jsdoc,
      prettier,
      boundaries,
      header,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...angularConfigs.recommended.rules,
      ...jsdoc.configs['recommended-typescript'].rules,
      'prettier/prettier': 'warn',
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: 'app', style: 'camelCase' },
      ],
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: 'app', style: 'kebab-case' },
      ],
      '@angular-eslint/prefer-on-push-component-change-detection': 'off',
      'header/header': [
        2,
        'block',
        [
          '*',
          { pattern: ' * .+', template: ' * Short module description' },
          ' * @copyright The GHGA Authors',
          ' * @license Apache-2.0',
          ' ',
        ],
        2,
        { lineEndings: 'linux' },
      ],
      'jsdoc/require-jsdoc': [
        'warn',
        {
          exemptEmptyConstructors: true,
          require: {
            FunctionDeclaration: true,
            MethodDefinition: true,
            ClassDeclaration: true,
            ArrowFunctionExpression: false,
            FunctionExpression: true,
          },
        },
      ],
      'jsdoc/require-description': [
        'warn',
        {
          contexts: ['FunctionDeclaration', 'MethodDefinition', 'ClassDeclaration'],
        },
      ],
      ...boundaries.configs.strict.rules,
      'boundaries/dependencies': 'off',
    },
    settings: {
      'boundaries/legacy-templates': false,
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
      },
      'boundaries/elements': [
        // The first matching pattern will be used as the element type.
        // The element types correspond to the layers of the architecture matrix.
        // The name of the vertical slice is captured as the context value.
        {
          type: 'main',
          mode: 'full',
          pattern: 'src/main.ts',
        },
        {
          type: 'config',
          mode: 'full',
          pattern: 'src/app/**/*.config.ts',
        },
        {
          type: 'main-app',
          mode: 'full',
          pattern: 'src/app/app.ts',
        },
        {
          type: 'routes',
          mode: 'full',
          pattern: 'src/app/**/*-routes.ts',
        },
        {
          type: 'features',
          pattern: 'src/app/*/features',
          mode: 'folder',
          capture: ['context'],
        },
        {
          type: 'spec',
          pattern: 'src/app/**/*.spec.ts|tests/**/*.ts',
          mode: 'full',
        },
        {
          type: 'ui',
          pattern: 'src/app/*/ui',
          mode: 'folder',
          capture: ['context'],
        },
        {
          type: 'service',
          pattern: 'src/app/*/services',
          mode: 'folder',
          capture: ['context'],
        },
        {
          type: 'pipe',
          pattern: 'src/app/*/pipes',
          mode: 'folder',
          capture: ['context'],
        },
        {
          type: 'model',
          pattern: 'src/app/*/models',
          mode: 'folder',
          capture: ['context'],
        },
        {
          type: 'util',
          pattern: 'src/app/*/utils',
          mode: 'folder',
          capture: ['context'],
        },
        {
          type: 'mock',
          mode: 'folder',
          pattern: 'src/mocks',
        },
        {
          type: 'tooling',
          mode: 'file',
          pattern: ['setup-test.ts', 'playwright.config.ts', 'vitest.config.ts'],
        },
      ],
    },
  },
  // Configuration for HTML template files
  {
    files: ['src/app/**/*.html'],
    languageOptions: {
      parser: angularTemplateParser,
    },
    plugins: {
      '@angular-eslint/template': angularTemplate,
    },
    rules: {
      ...angularTemplate.configs.recommended.rules,
      ...angularTemplate.configs.accessibility.rules,
      '@angular-eslint/template/no-positive-tabindex': 'error',
    },
  },
  // Configuration for Markdown files
  {
    files: ['**/*.md'],
    plugins: {
      markdown,
    },
    language: 'markdown/commonmark',
    rules: {
      'markdown/fenced-code-language': 'error',
      'markdown/heading-increment': 'error',
      'markdown/no-duplicate-headings': 'error',
      'markdown/no-empty-links': 'error',
      'markdown/no-html': 'error',
      'markdown/no-invalid-label-refs': 'error',
      'markdown/no-missing-label-refs': 'error',
    },
  },
];
