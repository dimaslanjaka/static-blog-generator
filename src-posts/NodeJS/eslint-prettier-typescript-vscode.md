---
title: Eslint Prettier In Typescript Project Using Vscode
webtitle: WMI NodeJS
subtitle: "How to configure eslint with prettier to automated lint and format codes in typescript project using vscode"
lang: en
date: 2021-11-28T7:00:00
type: post
tags:
  - JS
  - NodeJS
keywords:
  - nodejs
  - eslint
  - prettier
  - vscode
  - auto
  - format
  - lint
author:
  nick: "Dimas Lanjaka"
  link: "https://github.com/dimaslanjaka"
  image: "https://i.pinimg.com/564x/32/bc/65/32bc65e19220728fb290249059a7242a.jpg"

category:
  - Programming

cover: "https://i.ytimg.com/vi/lHAeK8t94as/maxresdefault.jpg"
location: Indonesia
comments: true
---

# Auto Lint And Format Typescript Using VSCode With Eslint And Prettier

Linter becomes 2 types:
- [TSLint](https://palantir.github.io/tslint/) is a linter that must be utilized for TypeScript.
- [ESLint](https://eslint.org/) is a linter supports both JavaScript and TypeScript.
**ESLint has a more performant architecture than TSLint** and that they will **only be focusing on ESLint** when providing editor linting integration for TypeScript. Now how to automated these linter in vscode.

## Install dependencies
```shell
# using npm
npm i -D prettier eslint-config-prettier eslint-plugin-prettier eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
# or using yarn
yarn add prettier eslint-config-prettier eslint-plugin-prettier eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin --dev
```

## Create .eslintrc.js
```js
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  env: {
    browser: true, // add support for browser js (window,document,location,etc)
    amd: true, // add amd support
    node: true, // add node support (module.export,etc)
  },
  parserOptions: {
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
  },
  extends: [
    'eslint:recommended', // uses eslint default recommended
    'plugin:@typescript-eslint/eslint-recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  // specify your desired rules for eslint
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
  },
};
```

## Create .prettierrc.js
specify your desired config for prettier
```js
module.exports = {
  semi: true,
  trailingComma: "all",
  singleQuote: true,
  printWidth: 120,
  tabWidth: 2
};
```

## Create .vscode/settings.json
this will automate lint and format your codes when saving.
```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
}
```