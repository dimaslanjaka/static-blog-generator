---
title: "[Bash] Menghapus spasi pertama pada file"
webtitle: WMI Gitlab
subtitle: <pre><br />IFS=$'\n'<br /> for f in $(find . -type f -name ' *')<br />
  do <br />     mv $f ${f/\.\/ /\.\/}<br /> done<br /></pre><div
lang: en
date: 2019-02-02T21:59:00.000+07:00
type: post
tags: []
author:
  nick: Dimas Lanjaka Kumala Indra
  link: https://www.blogger.com/profile/17555754514989936273
  email: noreply@blogger.com
modified: 2019-02-02T21:59:42.969+07:00
category:
  - Linux/Unix
comments: true
cover: https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2048px-No_image_available.svg.png
location: ""

---

<pre><br>IFS=$'\n'<br> for f in $(find . -type f -name ' *')<br> do <br>     mv $f ${f/\.\/ /\.\/}<br> done<br></pre>