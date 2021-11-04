---
title: Fix Uncaught Error Call to undefined function str_starts_with()
webtitle: WMI Gitlab
subtitle: "h5>Uncaught Error: Call to undefined function str_starts_with() Fix
  Solutions</h5><img"
lang: en
date: 2021-04-27T19:26:00.002+07:00
type: post
tags:
  - Script
  - PHP
author:
  nick: Dimas Lanjaka
  link: https://www.blogger.com/profile/07981649157148639830
  email: noreply@blogger.com
modified: 2021-05-14T04:26:37.028+07:00
category: []
comments: true
cover: https://res.cloudinary.com/dimaslanjaka/image/fetch/https://kuliahitblog.files.wordpress.com/2019/08/1dbdb-fatal2berror2buncaught2berror2bcall2bto2bundefined2bfunction2bmysql_connect25282529.png
location: ""

---

<h5>Uncaught Error: Call to undefined function str_starts_with() Fix Solutions</h5><img src="https://res.cloudinary.com/dimaslanjaka/image/fetch/https://kuliahitblog.files.wordpress.com/2019/08/1dbdb-fatal2berror2buncaught2berror2bcall2bto2bundefined2bfunction2bmysql_connect25282529.png" alt="PHP Thumbnail"><pre><br>if (!function_exists('str_starts_with')) {<br>  function str_starts_with($haystack, $needle, $case = true)<br>  {<br>    if ($case) {<br>      return strpos($haystack, $needle, 0) === 0;<br>    }<br>    return stripos($haystack, $needle, 0) === 0;<br>  }<br>}<br><br>if (!function_exists('str_ends_with')) {<br>  function str_ends_with($haystack, $needle, $case = true)<br>  {<br>    $expectedPosition = strlen($haystack) - strlen($needle);<br>    if ($case) {<br>      return strrpos($haystack, $needle, 0) === $expectedPosition;<br>    }<br>    return strripos($haystack, $needle, 0) === $expectedPosition;<br>  }<br>}<br></pre>