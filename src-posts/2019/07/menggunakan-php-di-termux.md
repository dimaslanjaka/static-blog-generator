---
title: Menggunakan PHP di termux
webtitle: WMI Gitlab
subtitle: Instalasipkg update -ypkg upgrade -ypkg install php curl wget git
-yContoh Penggunaan PHP (CLI) pada termuxbuat file
lang: en
date: 2019-07-28T06:38:00.002+07:00
type: post
tags: []
author:
nick: Dimas Lanjaka Kumala Indra
link: https://www.blogger.com/profile/17555754514989936273
email: noreply@blogger.com
modified: 2019-07-28T06:38:50.642+07:00
category:
- PHP
comments: true
cover: https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2048px-No_image_available.svg.png
location: ""
---

<div dir="ltr" style="text-align: left;" trbidi="on"><b>Instalasi</b><br><br><pre>pkg update -y<br>pkg upgrade -y<br>pkg install php curl wget git -y<br></pre><b>Contoh Penggunaan PHP (CLI) pada termux</b><br><br><i>buat file php</i><pre><code><span class="html"><span class="default">&lt;?php<br><br>parse_str</span><span class="keyword">(</span><span class="default">implode</span><span class="keyword">(</span><span class="string">'&amp;'</span><span class="keyword">, </span><span class="default">array_slice</span><span class="keyword">(</span><span class="default">$argv</span><span class="keyword">, </span><span class="default">1</span><span class="keyword">)), </span><span class="default">$_GET</span><span class="keyword">);<br></span><span class="default">?&gt;</span></span></code><br></pre><i>Usage/penggunaan</i><pre><br>php -f namafile.php a=1 b[]=2 b[]=3<br><br>//output<br>//$_GET['a'] to '1' and $_GET['b'] to array('2', '3').<br></pre></div>