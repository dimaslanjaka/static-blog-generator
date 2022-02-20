---
title: VSCode Integrated Terminal Options
webtitle: VSCode
date: 2022-02-20T07:00:00+07:00
updated: 2022-02-20T07:00:00+07:00
tags:
  - VSCode
Category:
  - Programming
  - IDE
---

## Windows Env
Add path into vscode terminal windows
```json
{
  "terminal.integrated.env.windows": {
    "PATH": "${env:PATH};C:\\bin;C:\\another\\folder"
  }
}
```

## MAC OSX Env
Add path into vscode terminal mac osx
```json
{
  "terminal.integrated.env.osx": {
    "PATH": "/home"
  }
}
```
Now open Terminal and look at PATH
```shell
echo $PATH
/usr/local/bin:/usr/bin:/bin:/usr/sbin:/home
```