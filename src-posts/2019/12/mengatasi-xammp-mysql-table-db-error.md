---
title: Mengatasi XAMMP mysql table db error must be repaired
webtitle: WMI Gitlab
subtitle: "Mengatasi XAMMP mysql table db error must be repaired (WINDOWS
  7,8,10) Buka CMD Ketik Command berikut (satu per satu):"
lang: en
date: 2019-12-11T23:19:00.001+07:00
type: post
tags: []
author:
  nick: Dimas Lanjaka Kumala Indra
  link: https://www.blogger.com/profile/17555754514989936273
  email: noreply@blogger.com
modified: 2019-12-11T23:19:57.047+07:00
category:
  - Share
  - Tips & Tricks
comments: true
cover: https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2048px-No_image_available.svg.png
location: ""

---

<div dir="ltr" style="text-align: left;" trbidi="on">  Mengatasi XAMMP mysql table db error must be repaired (WINDOWS 7,8,10)   <br>  <ol>    <li>Buka CMD</li>    <li>Ketik Command berikut (satu per satu):</li>    <pre><br>      cd c:\ [enter]<br>      cd c:\xammp\mysql\bin [enter]<br>      .\mysqlcheck -u root -p --auto-repair --check --all-databases [enter]<br>    </pre>    <li>Selesai</li>  </ol></div>