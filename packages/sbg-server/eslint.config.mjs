import globals from 'globals';
import { parse } from 'jsonc-parser';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import baseConfig from '../../eslint.config.mjs';

// __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// load .prettierrc.json with jsonc-parser
const prettier = parse(
  fs.readFileSync(path.join(__dirname, '.prettierrc.json'), 'utf8')
);

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  // replaces .eslintignore
  {
    ignores: [
      'source/libs/codemirror/**',
      'source/libs/fontawesome/**',
      'src/public/**'
    ]
  },

  ...baseConfig,

  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.amd,
        ...globals.node
      }
    },

    rules: {
      'prettier/prettier': ['error', prettier]
    }
  }
]
