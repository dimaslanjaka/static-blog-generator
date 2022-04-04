---
title: Custom PATH VSCode Integrated Terminal Options
webtitle: VSCode
date: 2022-02-20T07:00:00+07:00
updated: 2022-04-04T18:26:00+0700
cover: https://fabianlee.org/wp-content/uploads/2021/12/vscode-logo.png
tags:
  - VSCode
Category:
  - Programming
  - IDE
---

Determining custom path on vscode IDE made easily development programs within multiple platforms.

## VSCode Environment
| `${workspaceFolder}` | workspace folder root                   |
| -------------------- | --------------------------------------- |
| `${env:PATH}`        | existing vscode path (mixed with system |

## Linux Environment
Add custom path to terminal linux
```json
{
  "terminal.integrated.env.linux": {
    "PATH": "${workspaceFolder}/bin:${env:PATH}"
  }
}
```

## Windows Environment
Add path into vscode terminal windows
```json
{
  "terminal.integrated.env.windows": {
    "PATH": "${env:PATH};${workspaceFolder}\\bin;C:\\another\\folder"
  }
}
```

## MAC OSX Environment
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

### Also See
- [vscode alert: CommonJS may be converted to an es module](/2022/03/26/file-is-a-commonjs-module-it-may-be-converted-to-an-es-module.html)
- [vscode crossplatform settings](/p/search.html?q=vscode+crossplatform+setting)