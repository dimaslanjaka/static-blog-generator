---
title: Fix openssl encrypt decrypt [PHP]
webtitle: WMI Gitlab
subtitle: "Warning openssl_decrypt(): IV passed is only 12 bytes long, cipher
  expects an IV of precisely 16 bytes, padding with \\0 in PATH_FILE on"
lang: en
date: 2019-07-31T16:03:00.001+07:00
type: post
tags:
  - PHP
author:
  nick: Dimas Lanjaka Kumala Indra
  link: https://www.blogger.com/profile/17555754514989936273
  email: noreply@blogger.com
modified: 2019-07-31T16:03:49.913+07:00
category: []
comments: true
cover: https://res.cloudinary.com/dimaslanjaka/image/fetch/https://dimaslanjaka.github.io/assets/img/phpjs.svg?.png
location: ""

---

<div dir="ltr" style="text-align: left;" trbidi="on"><pre type="Example ERROR PHP">Warning: openssl_decrypt(): IV passed is only 12 bytes long, cipher expects an IV of precisely 16 bytes, padding with \0 in PATH_FILE on line LINE_N<br>openssl_encrypt(): IV passed is only 12 bytes long, cipher expects an IV of precisely 16 bytes, padding with \0 in PATH_FILE on line LINE_N<br></pre><h4>How to fix the errors</h4><br><ol style="text-align: left;"><li>Ensure your <b>SALT</b>&nbsp;only using <b>NUMBER ONLY</b>&nbsp;and <i>Minimum length of </i><b style="font-style: italic;">SALT</b>&nbsp;is <b>12</b>.</li><li>Ensure your PHP version is 7 or above</li></ol><blockquote class="tr_bq">That's how to fix openssl_encrypt() and openssl_decrypt() errors</blockquote></div><img src="https://res.cloudinary.com/dimaslanjaka/image/fetch/https://dimaslanjaka.github.io/assets/img/phpjs.svg?.png">