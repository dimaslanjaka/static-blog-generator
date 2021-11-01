---
title: Install google chrome kali linux/debian/etc
webtitle: WMI Gitlab
subtitle: open terminal, type 64 bitwget
  https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb 32
  bit wget
lang: en
date: 2019-07-21T20:26:00.001+07:00
type: post
tags: []
author:
  nick: Dimas Lanjaka Kumala Indra
  link: https://www.blogger.com/profile/17555754514989936273
  email: noreply@blogger.com
modified: 2019-07-23T01:56:17.590+07:00
category:
  - Linux/Unix
comments: true
cover: https://res.cloudinary.com/dimaslanjaka/image/fetch/https://www.pngarts.com/files/3/Linux-PNG-Image-Background.png
location: ""

---

<div dir="ltr" style="text-align: left;" trbidi="on">open terminal, type:<br>&nbsp;64 bit<br><pre>wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb<br></pre>&nbsp;32 bit <br><pre>wget https://dl.google.com/linux/direct/google-chrome-stable_current_i386.deb<br></pre>wait until download complete, the type:  <br>&nbsp;64 bit<br><pre>dpkg -i google-chrome-stable_current_amd64.deb<br></pre>&nbsp;32 bit <br><pre>dpkg -i google-chrome-stable_current_i386.deb<br></pre> then, fix chrome installation and depencies: <pre><br>apt update -y &amp;&amp; apt upgrade -y &amp;&amp; apt --fix-broken install<br></pre> done, find chrome in app lists, now available. good luck </div><img src="https://res.cloudinary.com/dimaslanjaka/image/fetch/https://www.pngarts.com/files/3/Linux-PNG-Image-Background.png">