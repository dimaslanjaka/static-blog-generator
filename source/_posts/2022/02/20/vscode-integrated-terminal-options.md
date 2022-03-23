---
Category:
  - Programming
  - IDE
cover: https://www.webmanajemen.com/2022/02/20/vscode-integrated-terminal-options/44d04e1c89459529cb6f08a9b0044d0f.png
date: 2022-02-20T07:00:00+07:00
tags:
  - VSCode
title: Custom PATH VSCode Integrated Terminal Options
updated: 2022-02-20T07:00:00+07:00
uuid: 3b1b7031-6ca3-4888-8c93-4812c6cc40c2
webtitle: VSCode
category:
  - Uncategorized
lang: en
thumbnail: https://www.webmanajemen.com/2022/02/20/vscode-integrated-terminal-options/44d04e1c89459529cb6f08a9b0044d0f.png
photos:
  - https://fabianlee.org/wp-content/uploads/2021/12/vscode-logo.png
---

Determining custom path on vscode IDE made easily development programs within multiple platforms.

## Linux Env
Add custom path to terminal linux
```json
{
  "terminal.integrated.env.linux": {
    "PATH": "./bin:${env:PATH}"
  }
}
```

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
