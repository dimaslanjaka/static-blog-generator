---
title: Update code Simple SafeLink v3
webtitle: WMI Gitlab
subtitle: '<blockquote>First post : <a
  href="http://web-manajemen.blogspot.com/2017/09/cara-simple-membuat-blogger-safelink.html"
  title="Cara Simple'
lang: en
date: 2018-08-05T07:56:00.001+07:00
type: post
tags: []
author:
  nick: Dimas Lanjaka 2
  link: https://www.blogger.com/profile/08197822797622284515
  email: noreply@blogger.com
modified: 2019-07-22T03:23:17.934+07:00
category:
  - JS
  - Blogger
  - Blogging
  - Tips & Tricks
comments: true
cover: https://cdn1.imggmi.com/uploads/2018/8/5/4f4281f038eb505c8f145d2c7f0b4f04-full.png
location: ""

---

<blockquote>First post : <a href="http://web-manajemen.blogspot.com/2017/09/cara-simple-membuat-blogger-safelink.html" title="Cara Simple Membuat Blogger Safelink Converter 2017 100% Work" alt="Cara Simple Membuat Blogger Safelink Converter 2017 100% Work">Cara Simple Membuat Blogger Safelink Converter 2017 100% Work</a></blockquote><img src="https://cdn1.imggmi.com/uploads/2018/8/5/4f4281f038eb505c8f145d2c7f0b4f04-full.png" title="Cara Simple Membuat Blogger Safelink Converter 2017 100% Work" alt="Cara Simple Membuat Blogger Safelink Converter 2017 100% Work"><pre><br><br>function safelink(){<br>var safelinkpage = ['https://web-manajemen.blogspot.com/p/redirect.html?u=','https://web-manajemen.blogspot.com/p/a.html?u='];<br>var safelink = safelinkpage[Math.floor(Math.random() * safelinkpage.length)] + encodeURIComponent( 'http://linkshrink.net/zslz=' );<br>var protectedLinks = '/(web-manajemen.blogspot.com|facebook.com|fb.me|bing.com|www.google.com|plus.google.com)/';<br>var anchors = document.getElementsByTagName("a");<br>for (var i = 0; i &lt; anchors.length; i++) {<br>  var intl = anchors[i];<br> if ( !intl.href.match( protectedLinks ) ) {<br>    intl.href = safelink + encodeURIComponent( intl.href );<br>   if (intl.hasAttribute("target")){<br>    intl.removeAttribute("target");<br>    }<br>   intl.setAttribute("target", "_blank");<br> }<br>}<br>  }<br>document.onreadystatechange = () =&gt; {<br>  if (document.readyState === 'interactive') {<br>  safelink(); <br>    }<br>  };<br><br></pre><!-- https://codepen.io/dimaslanjaka/pen/OvvzVR.js -->