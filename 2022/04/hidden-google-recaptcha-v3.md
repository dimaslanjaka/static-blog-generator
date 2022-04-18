---
title: Recaptcha V3 Complete Code
subtitle: Google recaptcha V3 support reload token without Reload Pages
date: 2022-04-18T17:12:30+0000
updated: 2022-04-18T17:12:30+0000
cover: https://miro.medium.com/max/309/1*5kaPMxO2svjJ5k34zOwmrg.png
keywords:
  - reload recaptcha v3
  - reload recaptcha without refresh page
  - hidden recaptcha v3
category:
  - Programming
tags:
  - JS
  - Recaptcha
---

## How to refresh token google recaptcha v3 (hidden recaptcha supported)
_Google recaptcha V3 support reload token without Reload Pages._

reCaptcha V3 in an **invisible captcha**, it _automagically_ detects user behaviors and rate it, **no need to reload or user's direct interaction** with any UI.

> reCAPTCHA v3 returns a score for each request **without user friction**. The score is based on interactions with your site and enables you to take an appropriate action for your site.

## reCAPTCHA v2 reset
```js
    grecaptcha.reset();
    
```

## reCAPTCHA v3 reset

Calling the grecaptch.execute() function that gets rendered on the page , will reset the value by the looks. ([Google Recaptcha V3 - Widget Id when loading captcha through URL](https://stackoverflow.com/questions/53906217/google-recaptcha-v3-widget-id-when-loading-captcha-through-url))
```js
        grecaptcha.execute('[Your recaptcha ID]', {
            action: 'general_form_contact_us'
        }).
        then(function(token) {
            document.querySelector('.g-recaptcha-response-v3-contact_us').value = token;
        });
    
```
**Note** you will need to adjust all your values accordingly.

You can test it by copying this and pasting in the chrome console. After pressing enter it then changes the value of the hidden field.

## Solution
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

