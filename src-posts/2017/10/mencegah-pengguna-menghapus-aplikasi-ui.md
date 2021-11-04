---
title: Mencegah Pengguna Menghapus Aplikasi UI Modern di Windows 8
webtitle: WMI Gitlab
subtitle: Ada pengaturan lain di GPE yang mencegah pencopotan pemasangan
  aplikasi yang terpasang. Inilah cara mengaktifkannya .. br /><img
lang: en
date: 2017-10-17T00:47:00.000+07:00
type: post
tags:
  - Tips & Tricks
author:
  nick: Dimas Lanjaka Kumala Indra
  link: https://www.blogger.com/profile/17555754514989936273
  email: noreply@blogger.com
modified: 2017-10-17T00:47:03.001+07:00
category: []
comments: true
cover: https://4.bp.blogspot.com/-w5jNzr6G-40/UMwiN9YrkUI/AAAAAAAAWtA/rYrCZ839NCU/s1600/Uninstall-Modern-UI-Apps.png
location: ""

---

Ada pengaturan lain di GPE yang mencegah pencopotan pemasangan aplikasi     yang terpasang. Inilah cara mengaktifkannya .. <br><img alt="Uninstall Modern UI Apps" height="249" src="https://4.bp.blogspot.com/-w5jNzr6G-40/UMwiN9YrkUI/AAAAAAAAWtA/rYrCZ839NCU/s1600/Uninstall-Modern-UI-Apps.png" title="Copot pemasangan UI Modern Apps" width="700"><br><h3>    Mencegah Pencabutan Aplikasi UI Modern </h3><ol><li>        Mulai Group Policy Editor dengan mengetikkan <code>gpedit.msc</code> di         kotak Run, dan tekan Enter.     </li><li>        Navigasikan ke User Configuration&gt; Administrative Templates&gt;         Start Menu dan Taskbar.     </li><li>        Dalam daftar kebijakan di sisi kanan cari setting yang disebut "Cegah         pengguna menguninstall aplikasi dari Start", klik dua kali di dalamnya.     </li><li>        Dalam dialog properties, pilih tombol radio berlabel "Enabled", lalu         klik tombol OK.     </li></ol>Itu dia. Sekarang ketika Anda klik kanan pada ubin layar Start, opsi     uninstall tidak akan muncul lagi. <br><center>    <ins id="aswift_0_expand"><ins id="aswift_0_anchor"></ins></ins></center>Jika Anda tidak dapat segera melihat perubahannya, jalankan perintah     berikut di command prompt: <br><pre>  gpupdate / force </pre>