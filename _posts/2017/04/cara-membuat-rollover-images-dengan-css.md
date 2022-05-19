---
author:
  nick: Unknown
  link: ""
  email: noreply@blogger.com
category:
  - Programming
comments: true
cover: https://3.bp.blogspot.com/-JOfTRWkg06Y/V_z6BpgKHjI/AAAAAAAAL3M/vF_yc-oNkd8BjbQOElXOiHEx7Jj93k25wCLcB/s200/css-rollover-image-change-on-hover.png
date: 2017-04-12T01:34:00+07:00
lang: en
modified: 2017-04-12T01:34:02.094+07:00
subtitle: CSS Rollover Efek Gambar Ganti Gambar pada gambarHoverRollover adalah
  fitur desain di mana gambar berubah ketika mouse melayang di
tags:
  - CSS
  - HTML
title: Cara membuat Rollover Images Dengan CSS
type: post
uuid: 66cec86c-5d34-4888-8a7d-3bc86d928a6d
webtitle: WMI Gitlab
updated: 2017-04-12T01:34:02+07:00
thumbnail: https://3.bp.blogspot.com/-JOfTRWkg06Y/V_z6BpgKHjI/AAAAAAAAL3M/vF_yc-oNkd8BjbQOElXOiHEx7Jj93k25wCLcB/s200/css-rollover-image-change-on-hover.png
photos:
  - https://3.bp.blogspot.com/-JOfTRWkg06Y/V_z6BpgKHjI/AAAAAAAAL3M/vF_yc-oNkd8BjbQOElXOiHEx7Jj93k25wCLcB/s200/css-rollover-image-change-on-hover.png
description: CSS Rollover Efek Gambar Ganti Gambar pada gambarHoverRollover
  adalah fitur desain di mana gambar berubah ketika mouse melayang di
wordcount: 1577
excerpt: CSS Rollover Efek Gambar Ganti Gambar pada gambarHoverRollover adalah
  fitur desain di mana gambar berubah ketika mouse melayang di
url: https://www.webmanajemen.com/2017/04/cara-membuat-rollover-images-dengan-css.html
permalink: /2017/04/cara-membuat-rollover-images-dengan-css.html
---

<div dir="ltr" trbidi="on"><div class="post"><h1><span>CSS Rollover Efek Gambar - Ganti Gambar pada gambar&nbsp;</span></h1><h1><span>HoverRollover adalah fitur desain di mana gambar berubah ketika mouse melayang di atasnya. Pikirkan sebuah bola lampu yang menyala dan mati ketika Anda memindahkan kursor mouse Anda ke dalam area halaman. Ketika halaman sedang loading, gambar rollover dimuat ke dalamnya untuk Pastikan bahwa efek rollover ditampilkan dengan cepat intervening.This digunakan untuk diimplementasikan menggunakan JavaScript, yang cukup mudah dengan hanya sejumlah kecil script Terlibat. Untuk membuat gambar rollover fungsional, onmouseover dan onmouseout atribut yang digunakan untuk tag link. Kode ini kemudian ditambahkan ke blog gadget atau ke dalam posting baru. Hal ini terbukti memiliki sejumlah kelemahan, namun, yang mengapa banyak pengembang web menggunakan metode CSS-satunya.</span></h1><div class="post-body"><div id="adsense-target"><br><div class="separator"><img alt="css rollover image" border="0" height="200" src="https://3.bp.blogspot.com/-JOfTRWkg06Y/V_z6BpgKHjI/AAAAAAAAL3M/vF_yc-oNkd8BjbQOElXOiHEx7Jj93k25wCLcB/s200/css-rollover-image-change-on-hover.png" title="CSS Rollover Image Effect" width="200"></div><br><h2>Cara membuat Gambar Rollover Menggunakan CSS.</h2><span>Berikut adalah cara untuk menerapkan </span><span><i>gambar</i> <i>rollover</i> </span><span>menggunakan CSS.</span><br><br><h4>The Image</h4><span>Tempatkan kedua </span><span><i>gambar</i></span><span> <i>statis</i> dan </span><span><i>rollover </i></span><span>dalam satu file dan memastikan bahwa gambar rollover ditempatkan di atas satu statis. </span><span>Untuk mencapai efek rollover, kami akan menulis kode untuk menampilkan gambar statis dan memotong gambar hover, sehingga negara hanya satu gambar yang ditampilkan pada suatu waktu.</span><br><br><span>Untuk tutorial ini, kita akan menggunakan berikut sebagai gambar CSS rollover.</span><br><br><div class="separator"><img alt="html rollover image" border="0" src="https://1.bp.blogspot.com/-NtrjKUd-0fs/V_ewyJEdB_I/AAAAAAAAL28/D3OfCvvRv4oADehdckX0d919xFeggWZOwCLcB/s180/rollover-image-light-bulb-on-off.png" title="CSS Rollover Image "></div><br><h3><span>Membuat HTML jangkar Elemen untuk Gambar</span></h3><span>Alih-alih menambahkan file gambar dalam tag &lt;img, kami akan menampilkannya sebagai gambar latar belakang dari sebuah tag (anchor):</span><br><br><blockquote class="tr_bq">&lt;a class="rolloverimage" href="<span>#URL</span>"&gt;Rollover Image&lt;/a&gt;</blockquote><br>Note: if you want to make the image clickable, replace <span>#URL</span> with the url of the webpage where you want the link to point to.<br><br><h3>Menggunakan CSS untuk menentukan background image.</h3><br><span>Untuk menciptakan efek mouseover gambar, kami akan menggunakan: hover CSS pseudo-kelas. </span><span>Kemudian, kita akan menggunakan properti background-posisi dan menetapkan nilai-nilai ke 0 0 untuk memindahkan gambar latar belakang ke sudut kiri atas yang akan menciptakan efek rollover.</span><br><blockquote class="tr_bq">&lt;style type="text/css"&gt;<br>.rolloverimage{<br>display: block;<br>width: <span>56px</span>;<br>height: <span>90px</span>;<br>background: url('<span>https://1.bp.blogspot.com/-NtrjKUd-0fs/V_ewyJEdB_I/AAAAAAAAL28/D3OfCvvRv4oADehdckX0d919xFeggWZOwCLcB/s180/rollover-image-light-bulb-on-off.png</span>') bottom;<br>text-indent: -99999px;<br>}<br>.rolloverimage:hover{<br>background-position: 0 0;<br>}<br>&lt;/style&gt;</blockquote><span>Catatan: Ganti teks warna biru dengan url dari file gambar Anda.</span><span> Silahkan membayar perhatian pada lebar dan tinggi nilai-nilai ditandai dengan warna merah, ini harus berbeda tergantung pada file Anda, di mana nilai tinggi adalah untuk hanya satu gambar dan tidak seluruh file gambar!</span><br><br><h4>Hasilnya</h4><span>Arahkan kursor mouse bola lampu untuk melihat efek rollover image dalam tindakan:</span><br><br>&nbsp; &nbsp;<a href="https://jsfiddle.net/dimaslanjaka/sjh3bnz8/1/" rel="noopener noreferer nofollow" target="_blank">The Demo Results</a>&nbsp;(Click To View The Result)<br><br>Menambahkan Rollover Image untuk Blogger.<br><br></div></div></div></div>