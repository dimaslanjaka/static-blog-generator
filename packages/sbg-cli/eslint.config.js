import baseConfig from '../../eslint.config.mjs';
import tsParser from '@typescript-eslint/parser';
import globals from 'globals';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  ...baseConfig,
  {
    // Ignore certain files and directories from linting
    ignores: [
      '**/*.md', // Markdown files
      '**/tmp/**/*', // Temporary files
      '**/*.html', // HTML files
      '**/*.py', // Python files
      '**/*.txt', // Text files
      '**/app/**/*', // Application-specific files
      '**/dist/**/*', // Distribution/build files
      '**/node_modules/**/*' // Node.js dependencies
    ]
  },

  {
    linterOptions: {
      // Report unused ESLint disable comments to help keep the code clean and maintainable
      reportUnusedDisableDirectives: true
    },
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        ...globals.browser, // Browser global variables
        ...globals.amd, // AMD module globals
        ...globals.node, // Node.js global variables
        ...globals.jest, // Jest Environment
        $: 'readonly', // jQuery object
        jQuery: 'readonly', // jQuery object
        adsbygoogle: 'writable', // Google Ads
        hexo: 'readonly' // Hexo static site generator object
      },
    },

    rules: {
      'no-empty-function': 'off',
      '@typescript-eslint/no-empty-function': 'off',
    },
  },
];