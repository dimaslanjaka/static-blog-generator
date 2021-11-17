---
title: Node Options For NodeJS
webtitle: WMI NodeJS
subtitle: "Usage, explanations of node options for nodejs"
lang: en
date: 2021-11-17T16:00:00
type: post
tags:
  - JS
  - NodeJS
keywords:
  - nodejs
  - arguments
  - cli
author:
  nick: "Dimas Lanjaka"
  link: "<Your Profile Link Here>"

category:
  - Programming

cover: "https://www.bleepstatic.com/content/hl-images/2020/08/04/nodejs-header.jpg"
location: Indonesia
comments: true
---

# NODEJS OPTIONS [ NODE_OPTIONS ]

Node.js accompanies an assortment of CLI choices. These choices uncover worked in investigating, different ways of executing scripts, and other accommodating runtime choices.

To see this documentation as a manual page in a terminal, run 'man hub'. [Read more](https://nodejs.org/api/cli.html)

## How to setup multiple options on GitHub Workflow
```yaml
jobs:
  build:
    name: Build www.webmanajemen.com
    runs-on: ubuntu-latest
    env:
      NODE_OPTIONS: "--experimental-vm-modules --max_old_space_size=8192"
```

## How to performance run nodejs on low devices
The recommended amounts for a "low memory device".

for 32-bit and/or Android are:
```shell
node --max-executable-size=96 --max-old-space-size=128 --max-semi-space-size=1 app.js
```
for 64-bit non-android are:
```shell
node --max-executable-size=192 --max-old-space-size=256 --max-semi-space-size=2 app.js
```