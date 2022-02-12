---
author:
  nick: Kuswati
  link: https://www.blogger.com/profile/09256263851708439294
  email: noreply@blogger.com
category: []
comments: true
cover: https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2048px-No_image_available.svg.png
date: 2020-09-22T10:36:00.001+07:00
lang: en
location: ""
modified: 2020-09-22T10:36:39.906+07:00
subtitle: pre><br />ArrayList&lt;String&gt; firstArr = new
  ArrayList&lt;&gt;();<br /> firstArr.add(&quot;1&quot;);<br />
tags: []
title: Remove all objects in an arraylist that exist in another arraylist Java
type: post
uuid: 86dc6b3b-9670-4888-8e6a-bd91726de97c
webtitle: WMI Gitlab
updated: 2020-09-22T10:36:39+07:00
thumbnail: https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2048px-No_image_available.svg.png
photos:
  - https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2048px-No_image_available.svg.png
  - https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2048px-No_image_available.svg.png
description: pre><br />ArrayList&lt;String&gt; firstArr = new
  ArrayList&lt;&gt;();<br /> firstArr.add(&quot;1&quot;);<br />
---

<pre><br>ArrayList&lt;String&gt; firstArr = new ArrayList&lt;&gt;();<br>  firstArr.add("1");<br>  firstArr.add("2");<br>  firstArr.add("3");<br>  <br>  // array/list to be removed from firstArr<br>  ArrayList&lt;String&gt; filterArr = new ArrayList&lt;&gt;();<br>  filterArr.add("1");<br>  filterArr.add("3");<br>  <br>  // filter now<br>  filterArr.removeAll(blockedArr);<br>  <br>  // Dump<br>  System.out.println(filterArr.toString); // output 1 and 3<br>  </pre>