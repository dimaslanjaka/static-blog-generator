import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import fs from 'fs-extra';
import globals from 'globals';
import jsonc from 'jsonc-parser';
import { fileURLToPath } from 'node:url';
import tseslint from 'typescript-eslint';
import path from 'upath';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prettierConfigJson = jsonc.parse(fs.readFileSync(path.join(__dirname, './.prettierrc.json'), 'utf-8'));

const baseLanguageOptions = {
  ecmaVersion: 2020,
  sourceType: 'module'
};

const prettierRule = {
  'prettier/prettier': ['error', prettierConfigJson]
};

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    ignores: ['**/node_modules/**', '**/dist/**']
  },

  js.configs.recommended,

  /**
   * ---------------- TS ONLY ----------------
   */
  {
    files: ['**/*.{ts,cts,mts}'],
    languageOptions: {
      ...baseLanguageOptions,
      parser: tseslint.parser,
      globals: {
        ...globals.jest, // Jest testing framework globals
        ...globals.browser, // Browser global variables
        ...globals.amd, // AMD module globals
        ...globals.node, // Node.js global variables
        $: 'readonly', // jQuery object
        jQuery: 'readonly', // jQuery object
        adsbygoogle: 'writable', // Google Ads
        hexo: 'readonly' // Hexo static site generator object
      }
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      prettier: prettierPlugin
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...prettierRule,

      '@typescript-eslint/explicit-function-return-type': 'off',
      'no-unused-vars': 'off',

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_'
        }
      ],

      '@typescript-eslint/no-explicit-any': 'off',

      '@typescript-eslint/no-this-alias': [
        'error',
        {
          allowDestructuring: false,
          allowedNames: ['self']
        }
      ],

      'arrow-body-style': 'off',
      'prefer-arrow-callback': 'off'
    }
  },

  /**
   * ---------------- JS + CJS ----------------
   */
  {
    files: ['**/*.{js,cjs}'],
    languageOptions: {
      ...baseLanguageOptions,
      globals: {
        ...globals.jest, // Jest testing framework globals
        ...globals.browser, // Browser global variables
        ...globals.amd, // AMD module globals
        ...globals.node, // Node.js global variables
        $: 'readonly', // jQuery object
        jQuery: 'readonly', // jQuery object
        adsbygoogle: 'writable', // Google Ads
        hexo: 'readonly' // Hexo static site generator object
      }
    },
    plugins: {
      prettier: prettierPlugin
    },
    rules: {
      ...prettierRule,

      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_'
        }
      ],

      'arrow-body-style': 'off',
      'prefer-arrow-callback': 'off'
    }
  },

  /**
   * ---------------- MJS (ESM strict) ----------------
   */
  {
    files: ['**/*.mjs'],
    languageOptions: {
      ...baseLanguageOptions,
      globals: {
        ...globals.jest, // Jest testing framework globals
        ...globals.browser, // Browser global variables
        ...globals.amd, // AMD module globals
        ...globals.node, // Node.js global variables
        $: 'readonly', // jQuery object
        jQuery: 'readonly', // jQuery object
        adsbygoogle: 'writable', // Google Ads
        hexo: 'readonly' // Hexo static site generator object
      }
    },
    plugins: {
      prettier: prettierPlugin
    },
    rules: {
      ...prettierRule,

      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_'
        }
      ],

      'arrow-body-style': 'off',
      'prefer-arrow-callback': 'off',

      // ESM restriction
      'no-restricted-syntax': [
        'error',
        {
          selector: 'CallExpression[callee.name="require"]',
          message: 'require() is not allowed in ESM (.mjs). Use import instead.'
        }
      ]
    }
  },

  prettierConfig
];
