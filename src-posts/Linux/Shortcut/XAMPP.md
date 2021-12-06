---
title: XAMPP
webtitle: Desktop Shortcut
subtitle: "How to configure shortcut desktop for xampp linux"
lang: en
date: 2021-12-06T23:25:00
type: post
tags:
  - PHP
  - Apache
  - MySQL
keywords:
  - xampp
  - apache
  - MySQL
  - shortcut
author:
  nick: "Dimas Lanjaka"
  link: "https://github.com/dimaslanjaka"
  image: "https://i.pinimg.com/564x/32/bc/65/32bc65e19220728fb290249059a7242a.jpg"

category:
  - Programming

cover: "https://i.ytimg.com/vi/lHAeK8t94as/maxresdefault.jpg"
location: Indonesia
comments: true
---

- Open Terminal, Type below codes
```shell
XAMPP=/usr/share/applications/xampp-control-panel.desktop
sudo touch $XAMPP
sudo gedit $XAMPP
```

- content `/usr/share/applications/xampp-control-panel.desktop`
```desktop
[Desktop Entry]
Encoding=UTF-8
Name=XAMPP Control Panel
Comment=Start and Stop XAMPP
Exec=sudo -H /opt/lampp/manager-linux-x64.run
Icon=/opt/lampp/htdocs/favicon.ico
Categories=Application
Type=Application
Terminal=false
```
- If you use a 32-bit system:
```shell
sudo -H /opt/lampp/manager-linux.run
```
- If you use a 64-bit system:
```shell
sudo -H /opt/lampp/manager-linux-x64.run
```

## Result
![Screenshot from 2021-12-07 02-45-08](https://user-images.githubusercontent.com/12471057/144911998-7459f8b8-1816-447e-a0c7-898a2cd4da49.png)
