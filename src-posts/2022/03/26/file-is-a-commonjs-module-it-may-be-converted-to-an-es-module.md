---
title: disable vscode alert: File is a CommonJS module; it may be converted to an ES module
subtitle: disable vscode alert: File is a CommonJS module; it may be converted to an ES module
cover: https://i.stack.imgur.com/Xo2sA.png
tags:
  - TS
  - JS
  - IDE
---

- open settings.json file
insert below option
```json
{
    "javascript.suggestionActions.enabled": false, // disable vscode alert on javascript
    "typescript.suggestionActions.enabled": false // disable vscode alert on typescript
}
```
