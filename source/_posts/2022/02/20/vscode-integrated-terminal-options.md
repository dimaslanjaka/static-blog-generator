---
Category:
  - Programming
  - IDE
date: 2022-02-20T07:00:00+07:00
tags:
  - VSCode
title: VSCode Integrated Terminal Options
updated: 2022-02-20T07:00:00+07:00
uuid: d187db4f-84c5-4888-845d-a57a9da1f610
webtitle: VSCode
lang: en
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