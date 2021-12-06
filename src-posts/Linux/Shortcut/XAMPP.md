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

```shell
XAMPP=/usr/share/applications/xampp-control-panel.desktop
sudo touch $XAMPP
sudo gedit $XAMPP
```

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

<ul>
    <li>
        <p>
            If you use a 32-bit system:
        </p>
        <pre><code>sudo -H /opt/lampp/manager-linux.run
</code></pre>
    </li>
    <li>
        <p>
            If you use a 64-bit system:
        </p>
        <pre><code>sudo -H /opt/lampp/manager-linux-x64.run
</code></pre>
    </li>
</ul>
