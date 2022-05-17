---
category:
  - Programming
  - JS
date: 2022-05-02T13:01:50+07:00
description: How to implement import.meta on typescript hybrid esm and commonjs compiler
tags:
  - NodeJS
  - ESM
  - TS
  - JS
  - CommonJS
title: How to use import.meta on typescript hybrid compiler
updated: 2022-05-02T13:01:50+07:00
uuid: a5434cb6-fe27-4888-8192-0f32468a6165
comments: true
wordcount: 208
subtitle: How to implement import.meta on typescript hybrid esm and commonjs compiler
excerpt: How to implement import.meta on typescript hybrid esm and commonjs compiler
url: https://www.webmanajemen.com/2022/05/use-import-meta-cjs.html
type: post
permalink: /2022/05/use-import-meta-cjs.html
lang: en
---

## explanation
Using typescript hybrid compiler to compile for ESM and CommonJS is a experimental for NodeJS.
Some function/magic function/constructor is not supported by CommonJS. So, you must define them manually, such as: __dirname, __filename

## __dirname and __filename resolver for ESM and CommonJS
```ts
export const getDirname = () => {
  // get the stack
  const { stack } = new Error();
  // get the third line (the original invoker)
  const invokeFileLine = stack.split(`\n`)[2];
  // match the file url from file://(.+.(ts|js)) and get the first capturing group
  const __filename = invokeFileLine.match(/file:\/\/(.+.(ts|js))/)[1];
  // match the file URL from file://(.+)/ and get the first capturing group
  //     the (.+) is a greedy quantifier and will make the RegExp expand to the largest match
  const __dirname = invokeFileLine.match(/file:\/\/(.+)\//)[1];
  return { __dirname, __filename };
};
export default getDirname;
```

## Usage
```ts
import { getDirname } from './dirname.ts'; // to prevent called by ESM, we using static import
const __resolve = getDirname();
const __filename = __resolve.__filename;
const __dirname = dirname(__filename);
console.log(__dirname, __filename); // /media/dimaslanjaka/DATA/Repositories/traffic-generator/express/src/public/routes /media/dimaslanjaka/DATA/Repositories/traffic-generator/express/src/public/routes/index.ts
```
## Usage Force Unix Style
Install upath
```bash
npm i upath
```
Call them
```ts
import path from 'upath';
import { getDirname } from 'config';
const { dirname } = path;
const __resolve = getDirname();
const __filename = __resolve.__filename;
const __dirname = dirname(__filename);
```

This is trick for resolving __dirname and __filename on typescript ESM hybrid compiler
