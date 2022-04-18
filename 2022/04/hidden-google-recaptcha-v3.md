---
title: Recaptcha V3 Complete Code
subtitle: Google recaptcha V3 support reload token without Reload Pages
date: 2022-04-18T17:12:30+0000
updated: 2022-04-18T17:12:30+0000
cover: https://miro.medium.com/max/309/1*5kaPMxO2svjJ5k34zOwmrg.png
category:
  - Programming
tags:
  - JS
  - Recaptcha
---

## How to refresh token google recaptcha v3 (hidden recaptcha supported)
simple solution for refreshing hidden google recaptcha v3, using below codes:
```js
const g_site_key = "YOUR GOOGLE RECAPTCHA V3 SITE KEY";
grecaptcha.execute(g_site_key, { action: "homepage" }).then(function (token) {
  if (location.host == "cdpn.io") {
    var pr = $("pre#token");
    if (pr.length) {
      pr.text(token);
    }
  }
  
  console.log('the new token is', token);
});
```

FULL DEMO:
<p class="codepen" data-height="300" data-theme-id="dark" data-default-tab="result" data-slug-hash="qzgYmp" data-preview="true" data-editable="true" data-user="dimaslanjaka" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/dimaslanjaka/pen/qzgYmp">
  Complete Google recaptcha v3</a> by dimas lanjaka (<a href="https://codepen.io/dimaslanjaka">@dimaslanjaka</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

