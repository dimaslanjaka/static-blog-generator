---
Category:
  - Programming
  - IDE
cover: https://fabianlee.org/wp-content/uploads/2021/12/vscode-logo.png
date: 2022-02-20T07:00:00+07:00
tags:
  - VSCode
title: Custom PATH VSCode Integrated Terminal Options
updated: 2022-04-04T18:26:00+07:00
uuid: 3b1b7031-6ca3-4888-8c93-4812c6cc40c2
webtitle: VSCode
lang: en
category:
  - Uncategorized
thumbnail: https://fabianlee.org/wp-content/uploads/2021/12/vscode-logo.png
photos:
  - https://fabianlee.org/wp-content/uploads/2021/12/vscode-logo.png
author:
  name: Dimas Lanjaka
  link: https://www.webmanajemen.com/
  email: dimaslanjaka@gmail.com
  image:
    url: https://res.cloudinary.com/dimaslanjaka/image/fetch/https://imgdb.net/images/3600.jpg
    width: 1944
    height: 2592
  social_links:
    github: https://github.com/dimaslanjaka
    youtube: https://youtube.com/p/L3n4r0x
comments: true
wordcount: 127
description: Custom PATH VSCode Integrated Terminal Options - Website Manajemen Indonesia
subtitle: Custom PATH VSCode Integrated Terminal Options - Website Manajemen Indonesia
excerpt: Custom PATH VSCode Integrated Terminal Options - Website Manajemen Indonesia
url: https://www.webmanajemen.com/2022/02/vscode-integrated-terminal-options.html
permalink: /2022/02/vscode-integrated-terminal-options.html
type: post
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