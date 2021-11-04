---
title: Android Studio Set Weight Layout Programatically
webtitle: WMI Gitlab
subtitle: pre><br />LinearLayout.LayoutParams param = new
  LinearLayout.LayoutParams(<br /> LayoutParams.MATCH_PARENT, //OR WRAP_CONTENT
  ->
lang: en
date: 2020-03-08T16:44:00.001+07:00
type: post
tags:
  - Android
author:
  nick: Kuswati
  link: https://www.blogger.com/profile/09256263851708439294
  email: noreply@blogger.com
modified: 2020-03-29T20:45:55.271+07:00
category: []
comments: true
cover: https://res.cloudinary.com/dimaslanjaka/image/fetch/https://techcrunch.com/wp-content/uploads/2017/02/android-studio-logo.png?w=730&crop=1
location: ""

---

<pre><br>LinearLayout.LayoutParams param = new LinearLayout.LayoutParams(<br>    LayoutParams.MATCH_PARENT, //OR WRAP_CONTENT -&gt; layout_width<br>    LayoutParams.MATCH_PARENT, //OR WRAP_CONTENT -&gt; layout_height<br>    1.0f // layout_weight 1<br>);<br>YOUR_VIEW.setLayoutParams(param);<br></pre> <img src="https://res.cloudinary.com/dimaslanjaka/image/fetch/https://techcrunch.com/wp-content/uploads/2017/02/android-studio-logo.png?w=730&amp;crop=1" width="100%">