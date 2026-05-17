import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import fs from 'fs-extra';
import jsonc from 'jsonc-parser';
import { fileURLToPath } from 'node:url';
import tseslint from 'typescript-eslint';
import path from 'upath';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prettierConfigJson = jsonc.parse(fs.readFileSync(path.join(__dirname, './.prettierrc.json'), 'utf-8'));

export default [
  {
    ignores: ['**/node_modules/**', '**/dist/**']
  },

  js.configs.recommended,

  ...tseslint.configs.recommended,

  {
    files: ['**/*.{js,cjs,mjs,ts,cts,mts}'],

    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        hexo: 'readonly'
      }
    },

    plugins: {
      '@typescript-eslint': tseslint.plugin,
      prettier: prettierPlugin
    },

    rules: {
      'prettier/prettier': ['error', prettierConfigJson],

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

      // Disable rules conflicting with prettier
      'arrow-body-style': 'off',
      'prefer-arrow-callback': 'off'
    }
  },

  {
    files: ['**/*.js'],
    rules: {
      '@typescript-eslint/no-var-requires': 'off'
    }
  },

  // Must be last
  prettierConfig
];
