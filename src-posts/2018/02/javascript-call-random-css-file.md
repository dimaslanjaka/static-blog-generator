---
title: JavaScript Call Random CSS file
webtitle: WMI Gitlab
subtitle: I am trying to rotate random CSS sheets via JS  I have the following
  script but when I am using it - it doesnt seem to work ?
lang: en
date: 2018-02-10T06:57:00.000+07:00
type: post
tags:
  - CSS
  - JS
author:
  nick: Dimas Lanjaka Kumala Indra
  link: https://www.blogger.com/profile/17555754514989936273
  email: noreply@blogger.com
modified: 2019-07-22T03:23:18.057+07:00
category: []
comments: true
cover: https://goo.gl/dzGpyo
location: ""

---

Someone talk to stack overflow like this : <div class="w3-border w3-round w3-border-red"><p>    I am trying to rotate random CSS sheets via JS - I have the following     script but when I am using it - it doesnt seem to work ? </p><pre><code>function getRand(){<br>    return Math.round(Math.random()*(css.length-1));<br>}<br>var css = new Array(<br>'&lt;link rel="stylesheet" type="text/css" href="css/1.css"&gt;',<br>'&lt;link rel="stylesheet" type="text/css" href="css/2.css"&gt;',<br>'&lt;link rel="stylesheet" type="text/css" href="css/3.css"&gt;',<br>'&lt;link rel="stylesheet" type="text/css" href="css/4.css"&gt;'<br>);<br>rand = getRand();<br>document.write(css[rand]);</code></pre><p>    Appreciate any help? </p></div><br><img src="https://goo.gl/dzGpyo" title="Ask and Answer" alt="ask and Answer"><br><div class="w3-border w3-round w3-border-green"><blockquote>The best answer is : <b>Try to create the <kbd>link</kbd> element programmatically and appending it to the head</b></blockquote><pre>function applyRandCSS(){<br>  var css = ["css/1.css", "css/2.css", "css/3.css", "css/4.css"];<br>  var randomFile = css[Math.round(Math.random()*(css.length-1))];<br>  var ss = document.createElement("link");<br><br>  ss.type = "text/css";<br>  ss.rel = "stylesheet";<br>  ss.href = randomFile;<br><br>  document.getElementsByTagName("head")[0].appendChild(ss);<br>}</pre></div><br><div class="w3-green w3-panel">Source : <a href="https://stackoverflow.com/questions/1244877/random-css-via-js" title="source" alt="source" rel="noopener noreferer nofollow">https://stackoverflow.com/questions/1244877/random-css-via-js</a></div>