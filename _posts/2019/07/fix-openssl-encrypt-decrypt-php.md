---
author:
  nick: Dimas Lanjaka Kumala Indra
  link: https://www.blogger.com/profile/17555754514989936273
  email: noreply@blogger.com
category:
  - Uncategorized
comments: true
cover: https://res.cloudinary.com/dimaslanjaka/image/fetch/https://www.webmanajemen.com/assets/img/phpjs.svg?.png
date: 2019-07-31T16:03:00+07:00
lang: en
subtitle: "Warning openssl_decrypt: IV passed is only 12 bytes long, cipher
  expects an IV of precisely 16 bytes, padding with \\0 in PATH_FILE on"
tags:
  - PHP
title: Fix openssl encrypt decrypt [PHP]
type: post
uuid: 9251b369-4ea6-4888-8b29-44aa20aa58aa
webtitle: PHP
updated: 2022-04-17T07:53:39+07:00
thumbnail: https://res.cloudinary.com/dimaslanjaka/image/fetch/https://www.webmanajemen.com/assets/img/phpjs.svg?.png
photos:
  - https://res.cloudinary.com/dimaslanjaka/image/fetch/https://www.webmanajemen.com/assets/img/phpjs.svg?.png
wordcount: 174
excerpt: "Warning openssl_decrypt: IV passed is only 12 bytes long, cipher
  expects an IV of precisely 16 bytes, padding with \\0 in PATH_FILE on"
description: "Warning openssl_decrypt: IV passed is only 12 bytes long, cipher
  expects an IV of precisely 16 bytes, padding with \\0 in PATH_FILE on"
url: https://www.webmanajemen.com/2019/07/fix-openssl-encrypt-decrypt-php.html
permalink: /2019/07/fix-openssl-encrypt-decrypt-php.html
---

<div dir="ltr">
<pre>Warning: openssl_decrypt(): IV passed is only 12 bytes long, cipher expects an IV of precisely 16 bytes, padding with \0 in PATH_FILE on line LINE_N<br />openssl_encrypt(): IV passed is only 12 bytes long, cipher expects an IV of precisely 16 bytes, padding with \0 in PATH_FILE on line LINE_N</pre>
<h4>How to fix the errors</h4>
<br />
<ol>
<li>Ensure your <strong>SALT</strong>&nbsp;only using <strong>NUMBER ONLY</strong>&nbsp;and <em>Minimum length of </em><strong>SALT</strong>&nbsp;is <strong>12</strong>.</li>
<li>Ensure your PHP version is 7 or above</li>
</ol>
<blockquote>That's how to fix openssl_encrypt() and openssl_decrypt() errors</blockquote>
</div>
<p><img src="https://res.cloudinary.com/dimaslanjaka/image/fetch/https://www.webmanajemen.com/assets/img/phpjs.svg?.png" alt="" /></p>
