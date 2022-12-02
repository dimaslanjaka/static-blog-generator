---
title: Blacklist Player Chimeraland
description: Blacklist player chimeraland (scammer list including ruby trader,
  map illus 16 party)
date: 2022-11-07T19:54:01+07:00
updated: 2022-12-02T16:31:16+07:00
lang: id
permalink: /chimeraland/blacklist-player.html
tags:
  - Chimeraland
  - Blacklist
  - Player
categories:
  - Games
  - Chimeraland
thumbnail: https://res.cloudinary.com/dimaslanjaka/image/fetch/https://www.palmassgames.ru/wp-content/uploads/2021/07/screenshot_6-1-1024x504.png
author: L3n4r0x
---

<!-- https://codepen.io/dimaslanjaka/pen/rXMVRj -->
<style type="text/css" notranslate>
  #translator-wrapper {
    display: block;
    width: 90%;
    /*max-width: 300px;*/
    border: none;
    background-color: #fff;
    color: #444;
    overflow: hidden;
    position: relative;
    height: 40px;
    line-height: 40px;
    border: 1px solid #e0e0e0;
    margin-left: auto;
    margin-right: auto;
  }

  #translator-wrapper img {
    width: 40px;
    height: 40px;
    display: block;
    border: none;
    appearance: none;
    background: transparent;
    position: absolute;
    left: 0;
  }

  #translator-wrapper select {
    border: none;
    background: transparent;
    font-family: 'Verdana', Arial, Sans-Serif;
    font-size: 12px;
    width: 100%;
    color: #444;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    appearance: none;
    cursor: text;
    padding: 5px 40px;
  }

  #translator-wrapper a,
  #translator-wrapper a:hover {
    display: block;
    background-color: #4791d2;
    border: none;
    color: #fff;
    margin: 0 0;
    text-decoration: none;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    cursor: pointer;
    width: 50px;
    transition: all 0.3s ease;
  }

  #translator-wrapper a:before {
    content: '';
    display: block;
    width: 0;
    height: 0;
    border: 6px solid transparent;
    border-left-color: white;
    position: absolute;
    top: 50%;
    left: 45%;
    margin-top: -5px;
  }

  #translator-wrapper a:hover {
    opacity: 0.9;
  }

  #translator-wrapper a:active {
    opacity: 0.9;
  }

  #translator-wrapper select:focus,
  #translator-wrapper a:focus,
  #translator-wrapper select:active,
  #translator-wrapper a:active {
    border: none;
    outline: none;
    cursor: pointer;
  }

  option {
    background: #444;
    color: #e0e0e0;
  }
</style>
<div id="translator-wrapper" notranslate>
  <img src="https://upload.wikimedia.org/wikipedia/commons/d/db/Google_Translate_Icon.png" alt="Translate" id="t-icon">
  <select id="translate-language">
    <option value="en" selected="selected">English</option>
    <option value="id">Indonesian</option>
    <option value="af">Afrikaans</option>
    <option value="sq">Albanian</option>
    <option value="ar">Arabic</option>
    <option value="hy">Armenian</option>
    <option value="az">Azerbaijani</option>
    <option value="eu">Basque</option>
    <option value="be">Belarusian</option>
    <option value="bn">Bengali</option>
    <option value="bg">Bulgarian</option>
    <option value="ca">Catalan</option>
    <option value="zh-CN">Chinese</option>
    <option value="hr">Croatian</option>
    <option value="cs">Czech</option>
    <option value="da">Danish</option>
    <option value="nl">Dutch</option>
    <option value="en">English</option>
    <option value="eo">Esperanto</option>
    <option value="et">Estonian</option>
    <option value="tl">Filipino</option>
    <option value="fi">Finnish</option>
    <option value="fr">French</option>
    <option value="gl">Galician</option>
    <option value="ka">Georgian</option>
    <option value="de">German</option>
    <option value="el">Greek</option>
    <option value="gu">Gujarati</option>
    <option value="ht">Haitian Creole</option>
    <option value="iw">Hebrew</option>
    <option value="hi">Hindi</option>
    <option value="hu">Hungarian</option>
    <option value="is">Icelandic</option>
    <option value="id">Indonesian</option>
    <option value="ga">Irish</option>
    <option value="it">Italian</option>
    <option value="ja">Japanese</option>
    <option value="kn">Kannada</option>
    <option value="ko">Korean</option>
    <option value="la">Latin</option>
    <option value="lv">Latvian</option>
    <option value="lt">Lithuanian</option>
    <option value="mk">Macedonian</option>
    <option value="ms">Malay</option>
    <option value="mt">Maltese</option>
    <option value="no">Norwegian</option>
    <option value="fa">Persian</option>
    <option value="pl">Polish</option>
    <option value="pt">Portuguese</option>
    <option value="ro">Romanian</option>
    <option value="ru">Russian</option>
    <option value="sr">Serbian</option>
    <option value="sk">Slovak</option>
    <option value="sl">Slovenian</option>
    <option value="es">Spanish</option>
    <option value="sw">Swahili</option>
    <option value="sv">Swedish</option>
    <option value="ta">Tamil</option>
    <option value="te">Telugu</option>
    <option value="th">Thai</option>
    <option value="tr">Turkish</option>
    <option value="uk">Ukrainian</option>
    <option value="ur">Urdu</option>
    <option value="vi">Vietnamese</option>
    <option value="cy">Welsh</option>
    <option value="yi">Yiddish</option>
  </select><a id="translate-me" href="#" title="Translate"></a>
</div>
<script type="text/javascript" notranslate>
  function translatorWidgetStart() {
    var mylang = 'id', // Your website language
      translateBtn = document.getElementById('translate-me'),
      canonical = document.querySelector('link[rel="canonical"]');
    // get href
    if (canonical) canonical = canonical.getAttribute('href').toString().trim();
    translateBtn.onclick = function () {
      var toLang = document
        .querySelector('select#translate-language')
        .value.trim();
      window
        .open(
          'http://translate.google.com/translate?u=' +
          encodeURIComponent(canonical || location.href) +
          '&sl=' +
          mylang +
          '&hl=' +
          toLang,
          'translate'
        )
        .focus();
      return false;
    };
  }
  document.addEventListener('DOMContentLoaded', translatorWidgetStart);
</script>

<h2 id="daftar-blacklist-player-kategori-scammer-map-illus-16-party" tabindex="-1"><a href="#daftar-blacklist-player-kategori-scammer-map-illus-16-party">Daftar blacklist player kategori SCAMMER MAP ILLUS 16 PARTY</a></h2>
<table style="width:100%;">
<thead>
<tr>
<th style="text-align:left">Nama Player</th>
<th style="text-align:left">Keterangan</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:left" notranslate="">ASTER</td>
<td style="text-align:left">SCAMMER MAP ILLUS 16</td>
</tr>
<tr>
<td style="text-align:left" notranslate="">arkep</td>
<td style="text-align:left">SCAMMER MAP ILLUS 16</td>
</tr>
<tr>
<td style="text-align:left" notranslate="">Shelby</td>
<td style="text-align:left">SCAMMER MAP ILLUS 16</td>
</tr>
<tr>
<td style="text-align:left" notranslate="">Suvi</td>
<td style="text-align:left">SCAMMER MAP ILLUS 16 sebagai LEADER PARTY</td>
</tr>
<tr>
<td style="text-align:left" notranslate="">PrimalHunter</td>
<td style="text-align:left">SCAMMER MAP ILLUS 16</td>
</tr>
</tbody>
</table>
<h2 id="daftar-blacklist-player-kategori-scammer-ruby" tabindex="-1"><a href="#daftar-blacklist-player-kategori-scammer-ruby">Daftar blacklist player kategori SCAMMER RUBY</a></h2>
<table style="width:100%;">
<thead>
<tr>
<th style="text-align:left">Nama Player</th>
<th style="text-align:left">Keterangan</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:left" notranslate="">Shelby</td>
<td style="text-align:left">SCAMMER ruby</td>
</tr>
<tr>
<td style="text-align:left" notranslate="">NesaMiko</td>
<td style="text-align:left">SCAMMER 6000 ruby tukar akun <strong>Mobile Legends</strong></td>
</tr>
<tr>
<td style="text-align:left" notranslate="">Tusboll</td>
<td style="text-align:left">SCAMMER ruby dengan alasan <strong>harga pensi</strong> / rate pensi</td>
</tr>
<tr>
<td style="text-align:left" notranslate="">Ryujin</td>
<td style="text-align:left">SCAMMER ruby dengan alasan <strong>harga pensi</strong> / rate pensi</td>
</tr>
<tr>
<td style="text-align:left" notranslate="">Ryuukendo</td>
<td style="text-align:left">SCAMMER ruby dengan alasan <strong>harga pensi</strong> / rate pensi</td>
</tr>
</tbody>
</table>
<h2 id="daftar-player-kategori-tukang-roll-drop-item" tabindex="-1"><a href="#daftar-player-kategori-tukang-roll-drop-item">Daftar player kategori tukang roll drop item</a></h2>
<table style="width:100%;">
<thead>
<tr>
<th style="text-align:left">Nama Player</th>
<th style="text-align:left">Keterangan</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:left" notranslate="">Corleonx</td>
<td style="text-align:left">Roll drops items</td>
</tr>
<tr>
<td style="text-align:left" notranslate="">Shelby</td>
<td style="text-align:left">Roll drops items</td>
</tr>
<tr>
<td style="text-align:left" notranslate="">PrimalHunter</td>
<td style="text-align:left">Roll drops items</td>
</tr>
</tbody>
</table>
<h2 id="hindari-hal-hal-berikut-agar-tidak-kena-scam" tabindex="-1"><a href="#hindari-hal-hal-berikut-agar-tidak-kena-scam">Hindari Hal-Hal Berikut Agar Tidak Kena Scam</a></h2>
<ul>
<li>Jangan ikut map illus dengan tiket telur grand (kebanyakan orang-orang ini hanya akan mengambil telur grand anda saja lalu menendang anda dari tim).</li>
</ul>
<blockquote>
<p>shortlink halaman ini: <a href="http://bit.ly/chimeraland-blacklist">http://bit.ly/chimeraland-blacklist</a></p>
</blockquote>
