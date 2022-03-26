---
title: disable vscode alert: File is a CommonJS module; it may be converted to an ES module
subtitle: disable vscode alert: File is a CommonJS module; it may be converted to an ES module
cover: https://i.stack.imgur.com/Xo2sA.png
date: 2022-03-26T04:27:16+0000
updated: 2022-03-26T04:27:16+0000
tags:
  - TS
  - JS
  - IDE
---

### open settings.json file
insert below option
```jsonc
{
    "javascript.suggestionActions.enabled": false, // disable vscode alert on javascript
    "typescript.suggestionActions.enabled": false // disable vscode alert on typescript
}
```

### [Preview Example] it should be looks like:
![Preview Setting](https://i.stack.imgur.com/2AUwp.png)
