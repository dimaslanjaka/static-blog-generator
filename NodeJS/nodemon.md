---
title: nodemon
description: all about nodemon
date: 2022-04-24
updated: 2022-04-24
---

## Basic nodemon.json configuration
```json
{
  "$schema": "http://json.schemastore.org/nodemon",
  "exec": "yarn build",
  "watch": ["./src/*.ts", "./index.ts", "./webpack.*.js", "./tsconfig.json", "./package.json"],
  "ignore": ["*.test.js", ".vscode", ".gitignore", "gh-pages", "dist", "tests", "tmp", "temp", "./src/tmp"],
  "delay": 3000,
  "ext": "ts,js",
  "verbose": true
}
```
