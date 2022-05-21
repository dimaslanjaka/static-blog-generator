---
category:
  - Programming
  - Adsense
  - JS
cover: https://1.bp.blogspot.com/-JB0hsyji7wo/XR0Sq_evvpI/AAAAAAAATlo/afDSTs1Y-HcrcDANMV9fGrGwZUU37o31wCLcBGAs/w600/Cara-Memasang-Lazy-Load-Iklan-Adsense.png
date: 2022-05-10T23:20:16+0000
description: Snippet lazy load adsense full support for blogger, wordpress, etc
tags:
  - JS
  - HTML
  - Blogger
  - Wordpress
title: Lazy Load Adsense Full Support 2022 Adsense API
updated: 2022-05-11T08:52:06+0000
uuid: 7a161b74-ae97-4888-88a4-055f71f691ee
comments: true
wordcount: 158
subtitle: Snippet lazy load adsense full support for blogger, wordpress, etc
excerpt: Snippet lazy load adsense full support for blogger, wordpress, etc
url: https://www.webmanajemen.com/2022/05/fully-lazy-loaded-adsense.html
permalink: /2022/05/fully-lazy-loaded-adsense.html
lang: en
thumbnail: https://1.bp.blogspot.com/-JB0hsyji7wo/XR0Sq_evvpI/AAAAAAAATlo/afDSTs1Y-HcrcDANMV9fGrGwZUU37o31wCLcBGAs/w600/Cara-Memasang-Lazy-Load-Iklan-Adsense.png
photos:
  - https://1.bp.blogspot.com/-JB0hsyji7wo/XR0Sq_evvpI/AAAAAAAATlo/afDSTs1Y-HcrcDANMV9fGrGwZUU37o31wCLcBGAs/w600/Cara-Memasang-Lazy-Load-Iklan-Adsense.png
type: post
---

change `ca-pub-1165447249910969` with your own adsense pub
```html
<script type="text/javascript">//<![CDATA[
  var lazyloadads = false;
  window.addEventListener(
    'scroll',
    function () {
      var notop = 0 != document.documentElement.scrollTop;
      var notopbody = 0 != document.body.scrollTop;
      var noload = false === lazyloadads;
      if (noload && (notop || notopbody)) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.src =
          'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1165447249910969';
        script.setAttribute('crossorigin', 'anonymous');
        script.onload = function () {
          var adsbygoogle = window.adsbygoogle || [];
          // customizing your personalized ads here, read more: https://support.google.com/adsense/answer/9042142?hl=en
          Array.from(document.querySelectorAll('ins.adsbygoogle')).forEach(
            (ins) => {
              var adsid = ins.getAttribute('data-ad-slot'); //nullable
              if (adsid) {
                adsbygoogle.push({ google_ad_client: "ca-pub-1165447249910969" });
                console.log('[adsense][ins]', adsid);
              }
            }
          );
        };
        var target = document.getElementsByTagName('script')[0];
        target.parentNode.insertBefore(script, target);
        lazyloadads = true;
      }
    },
    true
  );
//]]></script>
```

## Minified Version
```js
var lazyloadads=!1;window.addEventListener("scroll",function(){var o=0!=document.documentElement.scrollTop,e=0!=document.body.scrollTop;!1===lazyloadads&&(o||e)&&((o=document.createElement("script")).type="text/javascript",o.async=!0,o.src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1165447249910969",o.setAttribute("crossorigin","anonymous"),o.onload=function(){var e=window.adsbygoogle||[];Array.from(document.querySelectorAll("ins.adsbygoogle")).forEach(o=>{o=o.getAttribute("data-ad-slot");o&&(e.push({google_ad_client:"ca-pub-1165447249910969"}),console.log("[adsense][ins]",o))})},(e=document.getElementsByTagName("script")[0]).parentNode.insertBefore(o,e),lazyloadads=!0)},!0);
```

## Usages
just put `<ins/>` tag adsense
```html
<ins class="adsbygoogle" style="display:block" data-ad-format="autorelaxed" data-ad-client="ca-pub-1165447249910969" data-ad-slot="8307991972"></ins>
```
full example
```html
<section class="mb-5">
  <div class="card bg-light">
    <ins
      class="adsbygoogle"
      style="display: block"
      data-ad-format="autorelaxed"
      data-ad-client="ca-pub-1165447249910969"
      data-ad-slot="8307991972"
    ></ins>
  </div>
</section>
```

this is a article of Snippet Lazy Load Adsense Full Support for new adsense API 2022
