const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');
const tsParser = require('@typescript-eslint/parser');
const globals = require('globals');
const jsonc = require('jsonc-parser');
const fs = require('node:fs');
const path = require('node:path');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

const prettierrc = jsonc.parse(fs.readFileSync(path.resolve(__dirname, '.prettierrc.json'), 'utf-8'));

module.exports = [
  {
    ignores: [
      '**/*.md',
      '**/tmp/**/*',
      '**/*.html',
      '**/*.py',
      '**/*.txt',
      '**/app/**/*',
      '**/dist/**/*',
      '**/node_modules/**/*'
    ]
  },
  ...compat.extends(
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ),
  {
    linterOptions: {
      reportUnusedDisableDirectives: true
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.amd,
        ...globals.node,
        $: 'readonly',
        jQuery: 'readonly',
        adsbygoogle: 'writable',
        hexo: 'readonly'
      },
      parser: tsParser,
      ecmaVersion: 2020,
      sourceType: 'module'
    },
    rules: {
      'prettier/prettier': [
        'error',
        Object.assign(prettierrc, {
          overrides: [
            {
              excludeFiles: ['*.min.js', '*.min.cjs', '*.min.css', '*.min.html', '*.min.scss'],
              files: ['*.js', '*.css', '*.sass', '*.html', '*.md', '*.ts'],
              options: { semi: true }
            },
            {
              files: ['*.ejs', '*.njk', '*.html'],
              options: { parser: 'html' }
            }
          ]
        })
      ],
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
          allowedNames: ['self', 'hexo']
        }
      ],
      'arrow-body-style': 'off',
      'prefer-arrow-callback': 'off'
    }
  },
  {
    files: ['**/*.js', '**/*.cjs'],
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-require-imports': 'off'
    }
  }
];
