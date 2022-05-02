---
title: How to use import.meta on typescript hybrid compiler
description: How to implement import.meta on typescript hybrid esm and commonjs compiler
date: 2022-05-02T06:01:50+0000
updated: 2022-05-02T06:01:50+0000
tags:
  - NodeJS
  - ESM
  - TS
  - JS
  - CommonJS
category:
  - Programming
---

## explanation
Using typescript hybrid compiler to compile for ESM and CommonJS is a experimental for NodeJS.
Some function/magic function/constructor is not supported by CommonJS. So, you must define them manually, such as: __dirname, __filename

## __dirname for ESM and CommonJS
