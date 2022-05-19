---
author:
  nick: Dimas Lanjaka 2
  link: https://www.blogger.com/profile/08197822797622284515
  email: noreply@blogger.com
category:
  - Programming
  - PHP
comments: true
cover: https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2048px-No_image_available.svg.png
date: 2017-08-20T18:32:00+07:00
lang: id
subtitle: search engine optimization (SEO) orang mencari script yang bisa
  mengurai halaman web dan RSS feed dari situs-situs lain - untuk melihat kemana
  lalu lintasnya berasal dari antara lain
tags:
  - PHP
title: Parsing HTML untuk menemukan Links
type: post
uuid: aba0e536-1908-4888-8a75-1bf11361dcf3
updated: 2022-04-11T02:58:05+07:00
wordcount: 1259
excerpt: search engine optimization (SEO) orang mencari script yang bisa
  mengurai halaman web dan RSS feed dari situs-situs lain - untuk melihat kemana
  lalu lintasnya berasal dari antara lain
description: search engine optimization (SEO) orang mencari script yang bisa
  mengurai halaman web dan RSS feed dari situs-situs lain - untuk melihat kemana
  lalu lintasnya berasal dari antara lain
url: /2017/08/parsing-html-untuk-menemukan-links.html
---

<p>Dari blogging sampai log analysis dan search engine optimization (SEO) orang mencari script yang bisa mengurai halaman web dan RSS feed dari situs-situs lain - untuk melihat kemana lalu lintasnya berasal dari antara lain. <br /><a href="https://translate.googleusercontent.com/translate_c?depth=1&amp;nv=1&amp;rurl=translate.google.com&amp;sl=auto&amp;sp=nmt4&amp;tl=id&amp;u=http://www.google.com/search%3Fq%3Ddefine:parsing&amp;usg=ALkJrhjHQhEQ8CQV15d6T98UCse_Xkdwqg" target="_blank" rel="noopener noreferer nofollow"> Parsing </a> HTML Anda sendiri seharusnya tidak masalah - dengan asumsi Anda menggunakan format yang konsisten - tapi begitu Anda menetapkan pandangan Anda untuk mengurai HTML orang lain, frustrasi benar-benar terjadi. Halaman ini menyajikan beberapa ekspresi reguler dan sebuah komentar yang diharapkan akan mengarahkan Anda ke sisi yang benar. arah.</p>
<h2>1. Kasus yang paling sederhana</h2>
<p>Mari kita mulai dengan kasus yang paling sederhana - link yang diformat dengan baik tanpa atribut tambahan: <br />/&lt;a href=\"([^\"]*)\"&gt;(.*)&lt;\/a&gt;/iU<br />Ini, percaya atau tidak, adalah ekspresi reguler yang sangat sederhana (atau "regexp" singkatnya). Hal ini dapat dipecah sebagai berikut:</p>
<ul>
<li>Dimulai dengan: <strong>&lt;a href=" </strong></li>
<li>Serangkaian karakter sampai, tapi tidak termasuk, kutipan ganda berikutnya (") - tangkapan 1</li>
<li>String: <strong>"&gt; </strong></li>
<li>Serangkaian karakter apapun - ambil ke 2</li>
<li>Diakhiri dengan: <strong>&lt;/a&gt; </strong></li>
</ul>
<p>Kami juga menggunakan dua 'pengubah pola':</p>
<ul>
<li>I - pertandingan 'tidak beralasan' (huruf besar atau kecil tidak masalah)</li>
<li>U - pertandingan 'ungreedy'</li>
</ul>
<p>Pengubah pertama berarti bahwa kita cocok &lt;A&gt; dan juga &lt;a&gt;.Pengubah 'ungreedy' diperlukan karena jika tidak, string yang ditangkap kedua bisa (dengan menjadi 'serakah') meluas dari isi satu tautan sampai akhir tautan lainnya. <br />Salah satu kekurangan regexp ini adalah tidak mencocokkan tag tautan yang menyertakan jeda baris - untungnya ada modifer untuk ini juga: <br />/&lt;a\shref=\"([^\"]*)\"&gt;(.*)&lt;\/a&gt;/siU<br />Sekarang '.' Karakter akan cocok dengan karakter apapun <strong>termasuk </strong> jeda baris. Kami juga telah mengubah ruang pertama menjadi tipe karakter 'spasi' sehingga bisa cocok dengan spasi, tab atau jeda baris. Ini perlu memiliki semacam spasi pada posisi itu sehingga kami tidak cocok dengan tag lainnya seperti <tt> &lt;area&gt; </tt> . <br />Untuk informasi lebih lanjut tentang pengubah pola lihat tautan di bagian bawah halaman ini.</p>
<h2>2. Ruang untuk Atribut Ekstra</h2>
<p>Sebagian besar tag tautan berisi lebih banyak daripada sekadar atribut <tt> href </tt> . Atribut umum lainnya meliputi: rel, target dan title. Mereka dapat muncul sebelum atau sesudah atribut href: <br />/&lt;a\s[^&gt;]*href=\"([^\"]*)\"[^&gt;]*&gt;(.*)&lt;\/a&gt;/siU<br />Kami telah menambahkan pola tambahan sebelum dan sesudah atribut href. Mereka akan cocok dengan serangkaian karakter yang TIDAK mengandung simbol <tt> &gt; </tt> . Selalu lebih baik saat menulis kalimat biasa untuk menentukan karakter mana yang diizinkan dan tidak diijinkan - kecuali dengan menggunakan karakter wildcard ('.').</p>
<h2>3. Izinkan untuk Kehilangan Kutipan</h2>
<p>Sampai sekarang kami telah mengasumsikan bahwa alamat link akan ditutup dengan tanda kutip ganda. Sayangnya tidak ada yang menegakkan ini sehingga banyak orang hanya meninggalkan mereka. Masalahnya adalah kami mengandalkankutipan untuk berada di sana untuk menunjukkan di mana alamat dimulai <strong>dan </strong> diakhiri. Tanpa tanda petik kita punya masalah. <br />Ini akan cukup sederhana (bahkan sepele) untuk menulis regexp kedua, tapi di mana kesenangan saat kita bisa melakukan semuanya dengan satu: <br />/&lt;a\s[^&gt;]*href=(\"??)([^\" &gt;]*?)\\1[^&gt;]*&gt;(.*)&lt;\/a&gt;/siU<br />Apa yang bisa kukatakan? Ekspresi reguler sangat menyenangkan untuk dilakukan, tapi bila butuh waktu setengah jam untuk menyelesaikan di mana harus menambahkan ekstra <tt> ? </tt> Anda benar-benar tahu Anda ada di dalam. <br />Pertama, ada apa dengan ekstra itu <tt> ? </tt> 'S? <br />Karena kita menggunakan pengubah <tt> U </tt> , semua pola dalam regexp default menjadi 'ungreedy'. Menambahkan tambahan <tt> ? </tt> Setelah <tt> ? </tt> Atau <tt> * </tt> membalikkan perilaku itu kembali ke 'serakah' tapi hanya untuk pola sebelumnya. Tanpa ini, untuk alasan yang sulit dijelaskan, ungkapannya gagal. Pada dasarnya apapun berikut <tt> href= </tt> disamakan dengan ekspresi <tt> [^&gt;] * </tt> . <br />Kami telah menambahkan tangkapan ekstra ke regexp yang sesuai dengan kutipan ganda jika ada di sana: <tt> (\ "??) </tt> Kemudian ada backreference <tt> \\ 1 </tt> yang sesuai dengan kutipan ganda penutup - jika ada yang terbuka. <br />Untuk memenuhi tautan tanpa tanda kutip, pola yang cocok dengan alamat tautan itu sendiri telah diubah dari <tt> [^ \ "] * </tt> menjadi <tt> [^ "&gt;] *? </tt> . Itu berarti bahwa link tersebut bisa diakhiri dengan tidak hanya sekedar double quote (perilaku sebelumnya) tapi juga spasi atau simbol. <br /><strong> Ini berarti bahwa tautan dengan alamat yang berisi ruang yang tidak <a href="https://translate.googleusercontent.com/translate_c?depth=1&amp;nv=1&amp;rurl=translate.google.com&amp;sl=auto&amp;sp=nmt4&amp;tl=id&amp;u=http://www.the-art-of-web.com/javascript/escape/&amp;usg=ALkJrhhgQlceJ0y85JxN6pEo1uihCwU9VQ" rel="noopener noreferer nofollow"> terenkripsi </a> tidak lagi dapat ditangkap! </strong></p>
<h2>4. Menyempurnakan Regexp</h2>
<p>Mengingat sifat WWW, selalu ada kasus dimana ekspresi reguler terpecah. Perubahan kecil pada pola bisa memperbaikinya.</p>
<h4>Ruang di sekitar <tt>= </tt> setelah href:</h4>
<p>/&lt;a\s[^&gt;]*href\s*=\s*(\"??)([^\" &gt;]*?)\\1[^&gt;]*&gt;(.*)&lt;\/a&gt;/siU</p>
<h4>Hanya mencocokkan link yang dimulai dengan http:</h4>
<p>/&lt;a\s[^&gt;]*href=(\"??)(http[^\" &gt;]*?)\\1[^&gt;]*&gt;(.*)&lt;\/a&gt;/siU</p>
<h4>Tanda kutip tunggal di sekitar alamat link:</h4>
<p>/&lt;a\s[^&gt;]*href=([\"\']??)([^\" &gt;]*?)\\1[^&gt;]*&gt;(.*)&lt;\/a&gt;/siU<br />Dan ya, semua modifikasi ini bisa digunakan sekaligus untuk membuat satu super regexp, tapi hasilnya terlalu menyakitkan untuk diperhatikan, jadi saya akan meninggalkannya sebagai latihan. <br /><small> <strong>Catatan: </strong> Semua ungkapan di halaman ini telah diuji sampai batas tertentu, namun kesalahan dapat terjadi dalam penulisan ulang jadi mohon laporkan kesalahan yang mungkin Anda temukan saat menerapkan contoh ini. </small></p>
<h2>5. Menggunakan Regular Expression untuk mengurai HTML</h2>
<p>Menggunakan default untuk <a href="https://translate.googleusercontent.com/translate_c?depth=1&amp;nv=1&amp;rurl=translate.google.com&amp;sl=auto&amp;sp=nmt4&amp;tl=id&amp;u=http://www.php.net/preg_match_all&amp;usg=ALkJrhh1129dDB_R0FF8HFk3-SW43mC6HQ" target="_blank" rel="noopener noreferer nofollow"> preg_match_all </a> array yang dikembalikan berisi array dari 'capture' pertama, maka array dari capture kedua dan sebagainya. Dengan menangkap berarti pola yang ada di <tt> () </tt> : <br />&lt;?PHP // Original PHP code by Chirp Internet: www.chirp.com.au // Please acknowledge use of this code by including this header. $url = "http://www.example.net/somepage.html"; $input = @<a href="http://www.php.net/file_get_contents" target="_blank" rel="noopener noreferer nofollow">file_get_contents</a>($url) or die("Could not access file: $url"); $regexp = "<tt>&lt;a\s[^&gt;]*href=(\"??)([^\" &gt;]*?)\\1[^&gt;]*&gt;(.*)&lt;\/a&gt;</tt>"; if(preg_match_all("/$regexp/siU", $input, $matches)) { // $matches[2] = array of link addresses // $matches[3] = array of link text - including HTML code } ?&gt;<br />Menggunakan <tt> PREG_SET_ORDER </tt> setiap link yang cocok memiliki array itu sendiri dalam nilai pengembalian: <br />&lt;?PHP // Original PHP code by Chirp Internet: www.chirp.com.au // Please acknowledge use of this code by including this header. $url = "http://www.example.net/somepage.html"; $input = @file_get_contents($url) or die("Could not access file: $url"); $regexp = "<tt>&lt;a\s[^&gt;]*href=(\"??)([^\" &gt;]*?)\\1[^&gt;]*&gt;(.*)&lt;\/a&gt;</tt>"; if(preg_match_all("/$regexp/siU", $input, $matches, PREG_SET_ORDER)) { foreach($matches as $match) { // $match[2] = link address // $match[3] = link text } } ?&gt;<br />Jika Anda menemukan kasus di mana kode ini jatuh, beri tahu kami menggunakan tautan Masukan di bawah ini. <br />Sebelum menggunakan skrip ini atau yang serupa untuk mengambil halaman dari situs-situs lain, kami sarankan Anda membaca artikel terkait tentang <a href="https://translate.googleusercontent.com/translate_c?depth=1&amp;nv=1&amp;rurl=translate.google.com&amp;sl=auto&amp;sp=nmt4&amp;tl=id&amp;u=http://www.the-art-of-web.com/php/parse-robots/&amp;usg=ALkJrhjrLqmtVYLbvSKuXC4IPjyv8ZpsIg" rel="noopener noreferer nofollow"> pengaturan agen pengguna dan penguraian robots.txt </a> .</p>
<h2>6. Pertama memeriksa robots.txt</h2>
<p>Seperti disebutkan di atas, sebelum menggunakan script untuk mendownload file Anda harus selalu <a href="https://translate.googleusercontent.com/translate_c?depth=1&amp;nv=1&amp;rurl=translate.google.com&amp;sl=auto&amp;sp=nmt4&amp;tl=id&amp;u=http://www.the-art-of-web.com/php/parse-robots/&amp;usg=ALkJrhjrLqmtVYLbvSKuXC4IPjyv8ZpsIg" rel="noopener noreferer nofollow"> memeriksa file robots.txt </a> .Di sini kita memanfaatkan fungsi <tt> robots_allowed </tt> dari artikel yang terhubung di atas untuk menentukan apakah kita diizinkan untuk mengakses file: <br />&lt;?PHP // Original PHP code by Chirp Internet: www.chirp.com.au // Please acknowledge use of this code by including this header. ini_set('user_agent', 'NameOfAgent (http://www.example.net)'); $url = "http://www.example.net/somepage.html"; if(robots_allowed($url, "NameOfAgent")) { $input = @file_get_contents($url) or die("Could not access file: $url"); $regexp = "<tt>&lt;a\s[^&gt;]*href=(\"??)([^\" &gt;]*?)\\1[^&gt;]*&gt;(.*)&lt;\/a&gt;</tt>"; if(preg_match_all("/$regexp/siU", $input, $matches, PREG_SET_ORDER)) { foreach($matches as $match) { // $match[2] = link address // $match[3] = link text } } } else { die('Access denied by robots.txt'); }?&gt;<br />Sekarang Anda sedang dalam perjalanan untuk membangun laba-laba web profesional. Jika Anda akan menggunakan ini dalam praktik yang mungkin ingin Anda lihat: caching file robots.txt sehingga tidak didownload setiap saat (a la Slurp);Memeriksa header <a href="https://translate.googleusercontent.com/translate_c?depth=1&amp;nv=1&amp;rurl=translate.google.com&amp;sl=auto&amp;sp=nmt4&amp;tl=id&amp;u=http://www.the-art-of-web.com/system/logstatus/&amp;usg=ALkJrhjXtYwSrVKUjsDcXXySWoDRD1nqUA" rel="noopener noreferer nofollow"> server </a> dan <a href="https://translate.googleusercontent.com/translate_c?depth=1&amp;nv=1&amp;rurl=translate.google.com&amp;sl=auto&amp;sp=nmt4&amp;tl=id&amp;u=http://www.the-art-of-web.com/system/logstatus/&amp;usg=ALkJrhjXtYwSrVKUjsDcXXySWoDRD1nqUA" rel="noopener noreferer nofollow"> kode respon server </a> ; Dan menambahkan jeda di antara beberapa permintaan - untuk pemula.</p>
<h2>7. Terjemahan</h2>
<ul>
<li><a href="https://translate.googleusercontent.com/translate_c?depth=1&amp;nv=1&amp;rurl=translate.google.com&amp;sl=auto&amp;sp=nmt4&amp;tl=id&amp;u=http://www.siteduzero.com/forum-83-517857-p1-extraire-les-liens-d-une-page-html.html&amp;usg=ALkJrhhRE0DWMFhq0r6rX9DEt0WytBkKzQ#r4977381" target="_blank" rel="noopener noreferer nofollow"> Perancis </a></li>
</ul>
<h2>8. Referensi</h2>
<ul>
<li><a href="https://translate.googleusercontent.com/translate_c?depth=1&amp;nv=1&amp;rurl=translate.google.com&amp;sl=auto&amp;sp=nmt4&amp;tl=id&amp;u=http://www.php.net/reference.pcre.pattern.modifiers&amp;usg=ALkJrhh-HkZqqyhLYKS_s7GOkpg_ctB9Zw" target="_blank" rel="noopener noreferer nofollow"> PCRE: Pattern Modifiers </a></li>
</ul>
