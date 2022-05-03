---
date: 2022-04-24T00:00:00+07:00
description: all about nodemon
title: nodemon
updated: 2022-04-24
uuid: c0c30a89-10ff-4888-8a1b-0225815a65ed
category:
  - Uncategorized
tags: []
comments: true
wordcount: 32
subtitle: all about nodemon
excerpt: all about nodemon
url: https://www.webmanajemen.com/NodeJS/nodemon.html
permalink: /NodeJS/nodemon.html
lang: en
type: post
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
