---
cover: https://miro.medium.com/max/1400/1*HSXWWE7wkg9phEJ7ImhT2Q.jpeg
date: 2022-03-30T03:32:29+07:00
title: Force Change ALl End Of Line VSCode To LF
updated: 2022-03-30T03:32:29+07:00
uuid: 2f56d454-ee7d-4888-838d-8c92369290cb
category:
  - Uncategorized
tags: []
thumbnail: https://miro.medium.com/max/1400/1*HSXWWE7wkg9phEJ7ImhT2Q.jpeg
photos:
  - https://miro.medium.com/max/1400/1*HSXWWE7wkg9phEJ7ImhT2Q.jpeg
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
wordcount: 51
description: Force Change ALl End Of Line VSCode To LF - Website Manajemen Indonesia
subtitle: Force Change ALl End Of Line VSCode To LF - Website Manajemen Indonesia
excerpt: Force Change ALl End Of Line VSCode To LF - Website Manajemen Indonesia
url: https://www.webmanajemen.com/2022/03/vscode-force-lf.html
permalink: /2022/03/vscode-force-lf.html
type: post
---

## Git change all crlf to lf for vscode
```shell
git add -A
git commit -m "Commit Message Before Changing End Of Line"
git push
# begin changing end of line globally
git config core.autocrlf false
git rm --cached -r .
git reset --hard
```

## Change VSCode `settings.json` Option
```json
{
  "files.eol": "\n"
}
```
![Preview settings.json](https://imgs.developpaper.com/imgs/287058866-5bfb8bd1d4851_articlex.png)