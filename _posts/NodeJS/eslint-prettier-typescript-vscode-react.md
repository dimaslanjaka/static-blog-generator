---
cover: https://miro.medium.com/max/1400/1*N9n5F63ne3HimpJ10d1HEw.jpeg
date: 2022-04-19T09:37:38+0000
subtitle: How to auto format using eslint and prettier in typescript react
  project using vscode
tags:
  - Eslint
  - TS
  - JS
title: Eslint Prettier Auto Format In Typescript React Project
updated: 2022-04-19T11:20:17+0000
uuid: 6cba6ec8-458e-4888-8cb9-d446bfd0cdf4
category:
  - Programming
  - JS
comments: true
wordcount: 408
excerpt: How to auto format using eslint and prettier in typescript react
  project using vscode
description: How to auto format using eslint and prettier in typescript react
  project using vscode
url: https://www.webmanajemen.com/NodeJS/eslint-prettier-typescript-vscode-react.html
permalink: /NodeJS/eslint-prettier-typescript-vscode-react.html
lang: en
thumbnail: https://miro.medium.com/max/1400/1*N9n5F63ne3HimpJ10d1HEw.jpeg
photos:
  - https://miro.medium.com/max/1400/1*N9n5F63ne3HimpJ10d1HEw.jpeg
type: post
---

## Auto format Tsx files in VSCode
Assuming you've got `eslint` extension installed on Visual Studio Code, you should add the following to your settings.

## Install dependencies
using specific stable versions:
```bash
npm install --save-dev @types/react@16.9.34 @types/react-dom@16.9.6 @typescript-eslint/eslint-plugin@^5.20.0 @typescript-eslint/parser@^5.20.0 eslint@^8.13.0 eslint-config-prettier@^8.5.0 eslint-plugin-prettier@^4.0.0 eslint-plugin-react@^7.29.4 prettier@2.6.2 react-scripts@3.4.1
```
using latest stable versions:
```bash
npm install --save-dev @types/react @types/react-dom @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint eslint-config-prettier eslint-plugin-prettier eslint-plugin-react prettier react-scripts 
```
using airbnb latest stable versions:
```
npm i -D prettier eslint eslint-config-airbnb-typescript eslint-config-prettier eslint-plugin-import eslint-plugin-jsx-a11y@^6.2.3 eslint-plugin-prettier eslint-plugin-react eslint-plugin-react-hooks
```

## .eslintrc.js
```js
// https://www.google.com/search?channel=fs&client=ubuntu&q=%40typescript-eslint%2Feslint-plugin%2Fdist%2Fconfigs%2Fbase.json
// https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/src/configs/base.ts
// fix base.json
const { join } = require('upath');
const { writeFileSync, existsSync } = require('fs');
const dest = 'node_modules/@typescript-eslint/eslint-plugin/dist';
const filebase = join(__dirname, dest, 'configs/base.json');
if (!existsSync(filebase)) {
  const base = {
    parser: '@typescript-eslint/parser',
    parserOptions: { sourceType: 'module' },
    plugins: ['@typescript-eslint']
  };
  writeFileSync(filebase, JSON.stringify(base));
}

exports = {
  root: true,
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  extends: [
    'plugin:react/recommended',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  plugins: ['react', '@typescript-eslint'],
  rules: {
    'arrow-body-style': 'off',
    'prefer-arrow-callback': 'off'
  }
};
```

## .eslintrc.js with airbnb
```js
// https://www.google.com/search?channel=fs&client=ubuntu&q=%40typescript-eslint%2Feslint-plugin%2Fdist%2Fconfigs%2Fbase.json
// https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/src/configs/base.ts

const { join } = require('upath');
const { writeFileSync, existsSync } = require('fs');
const dest = 'node_modules/@typescript-eslint/eslint-plugin/dist';
const filebase = join(__dirname, dest, 'configs/base.json');
if (!existsSync(filebase)) {
  const base = {
    parser: '@typescript-eslint/parser',
    parserOptions: { sourceType: 'module' },
    plugins: ['@typescript-eslint']
  };
  writeFileSync(filebase, JSON.stringify(base));
}

exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: '.'
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'plugin:prettier/recommended',
    'airbnb-typescript',
    'prettier',
    'prettier/@typescript-eslint',
    'prettier/react'
  ],
  rules: {
    // Make prettier code formatting suggestions more verbose.
    'prettier/prettier': ['warn'],
    // Disable <Fragment> => <> replacement. Feel free to change
    'react/jsx-fragments': 'off',
    // Disable prefer default export
    'import/prefer-default-export': 'off'
  },
  overrides: [
    {
      files: ['**/*.tsx'],
      rules: {
        'react/prop-types': 'off',
        'react/jsx-props-no-spreading': 'off'
      }
    }
  ]
};
```

## .prettierrc
```jsonc
{
  "$schema": "https://json.schemastore.org/prettierrc",
  "semi": true,
  "printWidth": 120,
  "singleQuote": true,
  "trailingComma": "none",
  "tabWidth": 2
}
```

## .vscode/settings.json
```jsonc
{
  "eslint.format.enable": true,
  "editor.formatOnSave": false,
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact",
  ],
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.fixAll.stylelint": true
  }
}
```

## tsconfig.json
```jsonc
{
  "include": [
    "./src/*"
  ],
  "compilerOptions": {
    "lib": [
      "dom",
      "es2015"
    ],
    "jsx": "react",
    "esModuleInterop": true,
    "target": "es5",
    "allowJs": true,
    "noImplicitAny": false,
    "skipLibCheck": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true
  }
}
```

## example package.json devDependencies
```json
{
  "devDependencies": {
    "@types/react": "16.9.34",
    "@types/react-dom": "16.9.6",
    "@typescript-eslint/eslint-plugin": "^5.20.0",
    "@typescript-eslint/parser": "^5.20.0",
    "eslint": "^8.13.0",
    "eslint-config-prettier": "^8.5.0",
    "eslint-plugin-prettier": "^4.0.0",
    "eslint-plugin-react": "^7.29.4",
    "prettier": "2.6.2",
    "react-scripts": "3.4.1"
  }
}
```

## manual run with scripts package.json
```json
{
  "scripts": {
    "lint": "eslint --ext .js,.jsx,.ts,.tsx src --color",
    "format": "prettier --write src/**/*.{ts,tsx,scss,css,json}"
  }
}
```
