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
**ESLint has a more performant architecture than TSLint** and that they will **only be focusing on ESLint** when providing editor linting integration for TypeScript. Now how to automated these linter in vscode without **[prettier plugin](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)**

## Install dependencies
```shell
# using npm
npm i -D prettier eslint-config-prettier eslint-plugin-prettier eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
# or using yarn
yarn add prettier eslint-config-prettier eslint-plugin-prettier eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin --dev
```

## install and activate VSCode ESLint extension for auto Linter And Formatter
[Download Here](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

## Create .eslintrc.js
```js
module.exports = {
  root: true, // Specifies your current project has own eslint rules without extends parent folder eslint rules
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
    '@typescript-eslint/explicit-function-return-type': 'off', // disable function without return type
    "no-unused-vars": "off", // disable original eslint unused-vars
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }], // enable typescript-eslint unused-vars and allow unused vars start with underscore (_)
    "@typescript-eslint/no-explicit-any": "off", // allow any types
    "@typescript-eslint/no-this-alias": [ // rules for this binding
      "error",
      {
        allowDestructuring: false, // Disallow `const { props, state } = this`; true by default
        allowedNames: ["self"], // Allow `const self = this`; `[]` by default
      },
    ],
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

# create tsconfig.json (if not created yet)
for example tsconfig.json for node 12
```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "display": "Node 12",
  "extends": "@tsconfig/node12/tsconfig.json",
  "compilerOptions": {
    "preserveConstEnums": true,
    "allowJs": true,
    "outDir": "./dist"
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "**/node_modules/**",
    "**/*.spec.ts",
    "**/*.test.ts",
    "**/__tests__/**"
  ]
}
```

## Finish
now your vscode format and lint your codes automatically.