---
category:
  - Games
  - Chimeraland
comments: true
cover: /Chimeraland/Pets/cover.jpg
date: 2022-02-18T10:37:00+07:00
updated: 2022-02-18T14:55:00+07:00
keywords:
  - pets informations
  - chimeraland
lang: id
subtitle: Pets Informations Chimeraland
tags:
  - Chimeraland
title: Pets
toc: true
uuid: f400312e-d747-4888-862b-da6772a34afa
webtitle: Chimeraland
thumbnail: /Chimeraland/Pets/cover.jpg
photos:
  - /Chimeraland/Pets/cover.jpg
description: Pets Informations Chimeraland
---


## Pet Attributes Information

<blockquote>
  <ul>
    <li>
      <u><b>Attributes Conversion Rate</b></u> untuk menentukan persentase <u><b>Bloodline</b></u> hewan peliharaan yang
      diubah
      menjadi atribut pemilik. Contoh <b><u>Attributes Conversion Rate 4.0%</u></b>: apabila pet memiliki attack 100
      maka
      karakter anda mendapatkan 4 attack (tergantung kelipatan <b><u>base status</u></b>).
    </li>
  </ul>
</blockquote>

<table id="pet-tree" notranslate class="notranslate">
  <thead>
    <tr>
      <th>Name</th>
      <th>Default Quality (ATK HP DEF)</th>
      <th>Skill Attributes</th>
    </tr>
  </thead>
  <tbody>
    <!-- extract-text Pets/table.html -->
  </tbody>
</table>


<h5>Add New Pet Information</h5>
<iframe src="https://backend.webmanajemen.com/chimeraland/pets.php" frameborder="0" width="100%"
  height="550px"></iframe>

<link rel="stylesheet" href="https://cdn.datatables.net/1.11.4/css/jquery.dataTables.min.css" />
<script src="https://code.jquery.com/jquery-3.5.1.js"></script>
<script src="https://cdn.datatables.net/1.11.4/js/jquery.dataTables.min.js"></script>
<script src='Pets/script.js'></script>
<link rel="stylesheet" href="Pets/style.css" />

> ## See Also
> - [Chimeraland Cooking Recipes](/Chimeraland/Recipes.html)

<!-- translator -->
<style>
  .translated-ltr {
    margin-top: -40px;
  }

  .translated-ltr {
    margin-top: -40px;
  }

  .goog-te-banner-frame {
    display: none;
    margin-top: -20px;
  }

  .goog-logo-link {
    display: none !important;
  }

  .goog-te-gadget {
    color: transparent !important;
  }

  .goog-widget-wrapper {
    border: solid black 1px;
    padding: 2px;
    border-radius: 5px;
    width: fit-content;
  }

  #resetLang {
    width: 100%;
  }
</style>

<div class="goog-widget-wrapper">
  <div id="google_translate_element"></div> <button onclick="restoreLang()" class="notranslate" id="resetLang">Show
    Original Language</button>
</div>

<script type="text/javascript">
  function googleTranslateElementInit() {
    new google.translate.TranslateElement({ pageLanguage: 'auto' }, 'google_translate_element');
  }
  function restoreLang() {
    var iframe = document.getElementsByClassName('goog-te-banner-frame')[0];
    if (!iframe) return;

    var innerDoc = iframe.contentDocument || iframe.contentWindow.document;
    var restore_el = innerDoc.getElementsByTagName("button");

    for (var i = 0; i < restore_el.length; i++) {
      if (restore_el[i].id.indexOf("restore") >= 0) {
        restore_el[i].click();
        var close_el = innerDoc.getElementsByClassName("goog-close-link");
        close_el[0].click();
        return;
      }
    }
  }
</script>
<script type="text/javascript"
  src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>