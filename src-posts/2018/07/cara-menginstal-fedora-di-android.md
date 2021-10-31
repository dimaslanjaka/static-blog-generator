---
title: Cara Install Fedora Di Android
webtitle: WMI Gitlab
subtitle: Halo semuanya, hanya ingin memberi Anda pembaruan cepat di Fedora
dalam proyek chroot Android. Berikut tutorial cara menginstal fedora di
lang: en
date: 2018-07-27T11:57:00.000+07:00
type: post
tags: []
author:
nick: Dimas Lanjaka Kumala Indra
link: https://www.blogger.com/profile/17555754514989936273
email: noreply@blogger.com
modified: 2018-11-12T12:49:24.632+07:00
category:
- Tools
- PHP
- Android
- Tips & Tricks
comments: true
cover: https://res.cloudinary.com/dimaslanjaka/image/fetch/https://lh3.googleusercontent.com/-r2rcHfz-Dto/WSb5DKBPBkI/AAAAAAAAB4I/H0a69gufG-UXKzPcAr2M-O9jhNZ_Nf5uACHM/%255BUNSET%255D
location: ""
---

<img alt="Fedora android installation" class="w3-image w3-center" src="https://res.cloudinary.com/dimaslanjaka/image/fetch/https://lh3.googleusercontent.com/-r2rcHfz-Dto/WSb5DKBPBkI/AAAAAAAAB4I/H0a69gufG-UXKzPcAr2M-O9jhNZ_Nf5uACHM/%255BUNSET%255D" title="fedora android installation"><br><div>Halo semuanya, hanya ingin memberi Anda pembaruan cepat di Fedora dalam proyek chroot Android. <br>Berikut tutorial cara menginstal fedora di android melalui termux emulator android :<br><br><br><ol><li>Install <a href="https://play.google.com/store/apps/details?id=com.termux" rel="noopener noreferer nofollow" target="_blank">Termux</a>&nbsp;(<a href="https://termux.com/" rel="noopener noreferer nofollow">https://termux.com</a>)</li><li>Buka termuxnya dan copy kode berikut, satu persatu. (Tanda [#] merupakan komentar). <br><pre><br>#Update &amp; upgrade command shell<br>apt update<br>#please wait -then<br>apt upgrade<br><br>#Installing Git<br>apt install git<br><br>#Installing Curl<br>apt install curl<br><br>#Installing Wget<br>apt install wget<br></pre><br>Instalasi Basic Command dan upgrade sudah selesai. Disini anda sudah memumpuni untuk menjalankan command prompt linux secara lancar. </li><li>Kemudian lanjutkan ke penginstalan nya. <br><blockquote>Disini saya menggunakan directory Root/Home dari Termux nya sendiri <b>Jadi <i>pastikan anda memiliki penyimpanan yang memumpuni, saya sarankan Free 2GB</i></b></blockquote><br><pre><br>git clone https://github.com/nmilosev/termux-fedora.git<br>cd termux-fedora<br>chmod +x termux-fedora.sh<br></pre></li><li>Nah disini anda sudah mendownload fedora berbasis IMAGE. <br><b>Beberapa <i>IMAGE</i> untuk chipset tertentu yang sudah terdownload</b> (coba di masukkan command <i>ls</i>) <br><ol><li>f25_arm ini untuk chipset 32bit </li><li>f25_arm64 ini untuk chipset 64bit</li></ol><br><blockquote>Penjelasan : <ul><li>f26alpha_arm ini untuk install fedora versi 26 untuk chipset 32bit namun statusnya alpha belum stabil </li><li>f26alpha_arm64 sama seperti di atas namun untuk chipset 64bit </li></ul></blockquote>  Untuk menginstal ImageNya cukup ketik command berikut : <pre><br>#choose image <br>./termux-fedora.sh f25_arm<br></pre></li><li>Jika proses instalasi telah selesai kita bisa langsung masuk ke chroot fedora, dengan command berikut pada terminal termux. <pre>startfedora</pre>Untuk keluar dari fedora cukup masukkan command berikut di terminal. <pre>exit</pre></li></ol></div><br><div>Tag: <br> install Fedora Android, Fedora, Termux, Android, Termux Fedora </div>