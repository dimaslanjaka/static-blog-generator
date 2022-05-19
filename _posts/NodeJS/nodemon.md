---
date: 2022-04-24T00:00:00+07:00
description: all about nodemon
title: nodemon
updated: 2022-04-24T00:00:00+07:00
uuid: c0c30a89-10ff-4888-8a1b-0225815a65ed
category:
  - Uncategorized
tags: []
author:
  name: Dimas Lanjaka
  link: https://www.webmanajemen.com/
  email: dimaslanjaka@gmail.com
  image:
    url: https://res.cloudinary.com/dimaslanjaka/image/fetch/https://imgdb.net/images/3600.jpg
    width: 1944
    height: 2592
  social_links:
    github: https://github.com/dimaslanjaka
    youtube: https://youtube.com/p/L3n4r0x
comments: true
wordcount: 32
subtitle: all about nodemon
excerpt: all about nodemon
url: https://www.webmanajemen.com/NodeJS/nodemon.html
permalink: /NodeJS/nodemon.html
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
