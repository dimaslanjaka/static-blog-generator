---
title: disable vscode alert: File is a CommonJS module; it may be converted to an ES module
subtitle: disable vscode alert: File is a CommonJS module; it may be converted to an ES module
cover: https://i.stack.imgur.com/Xo2sA.png
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
