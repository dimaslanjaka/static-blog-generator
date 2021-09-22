---
title: Badword
webtitle: RegExp
subtitle: "Match string not containing string, exclude badwords"
lang: en
date: 2021-9-22
type: post
tags:
  - RegExp

author:
  nick: "Dimas Lanjaka"
  link: "<Your Profile Link Here>"

category:
  - Regular Expression

cover: "/RegExp/RegExp/badwords.png"
location: Indonesia
comments: false
---

<!--toc-->

## Main Expression
```regexp {#regexp-main}
^((?!badword).)*$
```

<!-- script /RegExp/RegExp/badwords.js -->