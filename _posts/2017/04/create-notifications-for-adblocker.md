---
author:
  nick: Unknown
  link: ""
  email: noreply@blogger.com
category:
  - Programming
comments: true
cover: https://1.bp.blogspot.com/-jpczn1kqplU/V4l0xj58D6I/AAAAAAAAnRU/GK2SYUZJ-4ERJuePuYYJlu4Ka-2PBLoYgCLcB/w1100/notifikasi-adblocker.jpg
date: 2017-04-13T07:22:00+07:00
lang: en
tags:
  - Adsense
  - CSS
  - Blogger
  - HTML
  - Blogging
title: Create Notifications For Adblocker Adsense Users
type: post
uuid: aee210d8-b0e7-4888-891a-0ae9ca18716d
webtitle: WMI Gitlab
updated: 2022-04-15T12:19:00+07:00
description: Create Notifications For Adblocker Adsense Users
thumbnail: https://1.bp.blogspot.com/-jpczn1kqplU/V4l0xj58D6I/AAAAAAAAnRU/GK2SYUZJ-4ERJuePuYYJlu4Ka-2PBLoYgCLcB/w1100/notifikasi-adblocker.jpg
photos:
  - https://1.bp.blogspot.com/-jpczn1kqplU/V4l0xj58D6I/AAAAAAAAnRU/GK2SYUZJ-4ERJuePuYYJlu4Ka-2PBLoYgCLcB/w1100/notifikasi-adblocker.jpg
wordcount: 585
subtitle: Create Notifications For Adblocker Adsense Users
excerpt: Create Notifications For Adblocker Adsense Users
---

<div>
<h3>Create Notifications For Adblocker Adsense Users</h3>
<img src="https://1.bp.blogspot.com/-jpczn1kqplU/V4l0xj58D6I/AAAAAAAAnRU/GK2SYUZJ-4ERJuePuYYJlu4Ka-2PBLoYgCLcB/w1100/notifikasi-adblocker.jpg" alt="" /></div>
<p>For the blog manager, advertising is one source that can provide encouragement to continue writing content that is useful to the reader, and others for the purpose of hosting payments (if using hosting) or to rent the domain.&nbsp;<br /><br />But we can not deny, many managers of the blog too excessive in advertisements with the intent to earn more income.&nbsp;Of course this can interfere with the convenience of visitors to the blog.&nbsp;<br /><br />So we can not blame the internet users use AdBlocker to comfort them in the surf in cyberspace.&nbsp;Adblocker can turn off ads on the blog so ads are not appearing and not disturb visitors to the blog.&nbsp;<br /><br />But if we as managers of the blog does not advertise excessively so do not bother the visitors in reading the content, of course with their AdBlocker will hamper pengasilan of ads posted on the blog.&nbsp;<br /><br />For that, we need to make a notification to the user to turn off AdBlocker AdBlocker on our blog, who knows the ads that appear indeed visitors are looking for content.&nbsp;We need to explain that we do not advertise excessively or trap the visitor to click on an ad, for that we asked him to turn off AdBlocker visitor to our blog for advertising on our blogs do not disturb them.&nbsp;<br /><br />Well this time we will put up a notification to the user AdBlocker for Adsense ads to enter our blog into their Adblock whitelist.&nbsp;<br /><br />When a visitor uses AdBlocker, then the Adsense ads do not appear automatically.If Adsense ads do not appear then AdBlocker notification will appear at the bottom of the blog as in the image below.&nbsp;<br /><br /><img title="Notifications To Users AdBlocker Adsense" src="https://4.bp.blogspot.com/-tc5Jt86PMDI/V4l-hRBLfYI/AAAAAAAAnRk/UoQnmGaa9sY9VKbqeWFPcaQ3U6F-gAH2wCLcB/s1600/adblocker-menyala.jpg" alt="Notifikasi Untuk Pengguna Adblocker Adsense" width="750" height="448" /><img title="Notifications To Users AdBlocker Adsense" src="https://4.bp.blogspot.com/-tc5Jt86PMDI/V4l-hRBLfYI/AAAAAAAAnRk/UoQnmGaa9sY9VKbqeWFPcaQ3U6F-gAH2wCLcB/s1600/adblocker-menyala.jpg" alt="Notifikasi Untuk Pengguna Adblocker Adsense" /><br /><img title="adblocker Adsense" src="https://1.bp.blogspot.com/-IpdfY96jiWI/V4l-nFz6EXI/AAAAAAAAnRo/AOPYS2rthe0Sv1CDOhHWhgB3gdjXu3buwCLcB/s1600/adblocker-off.jpg" alt="Adblocker Adsense" width="750" height="448" /><img title="adblocker Adsense" src="https://1.bp.blogspot.com/-IpdfY96jiWI/V4l-nFz6EXI/AAAAAAAAnRo/AOPYS2rthe0Sv1CDOhHWhgB3gdjXu3buwCLcB/s1600/adblocker-off.jpg" alt="Adblocker Adsense" /><br />To access the demo please try this Magic Company blog by using AdBlocker.&nbsp;<br /><br />If you want to try to use the notification AdBlocker for Adsense ads, please follow the steps below.&nbsp;<br /><br />Please save the CSS code below the above code&nbsp;<code>&lt;/head&gt;</code>&nbsp;<br /><br /></p>
<pre><code>&lt;style&gt;<br />#keep-ads {<br /> background: #1C90F3;<br /> color: #fff;<br /> padding: 10px 20px;<br /> position: fixed;<br /> bottom: -150px;<br /> left: 0;<br /> opacity: 0;<br /> font-size: 100%;<br /> line-height: 1.5em;<br /> transition: all .3s;<br /> width: 100%;<br /> height: auto;<br /> -moz-box-sizing: border-box;<br /> -webkit-box-sizing: border-box;<br /> box-sizing: border-box;<br /> z-index: 100000<br />}<br /><br />#keep-ads p {<br /> margin: 0!important<br />}<br /><br />#keep-ads a {<br /> color:#fff;<br /> text-decoration:underline;<br />}<br /><br />#keep-ads.show {<br /> pointer-events: auto;<br /> opacity: 1;<br /> bottom: 0<br />}<br /><br />.close-keep-ads {<br /> position: absolute;<br /> top: 0;<br /> right: 0;<br /> font-size: 24px;<br /> font-weight: 700;<br /> cursor:pointer;<br /> width:24px;<br /> height:24px;<br /> line-height:24px;<br /> text-align:center;<br />}<br />&lt;/style&gt;</code></pre>
<p><br />Then please save the code below the above code&nbsp;<code>&lt;/body&gt;</code>&nbsp;<br /><br /></p>
<pre><code>&lt;div id='keep-ads'&gt;<br /> &lt;p&gt;Like this blog? Keep us running by whitelisting this blog in your ad blocker.&lt;/p&gt;<br /> &lt;p&gt;This is &lt;a href='URL PAGE HOW TO WHITELIST' target='_blank' title='how to whitelisting'&gt;how to whitelisting&lt;/a&gt; this blog in your ad blocker.&lt;/p&gt;<br /> &lt;p&gt;Thank you!&lt;/p&gt;<br /> &lt;div class='close-keep-ads' onclick='hidekeep()'&gt;&amp;#215;&lt;/div&gt;<br />&lt;/div&gt;<br />&lt;script&gt;<br />//&lt;![CDATA[<br />setTimeout(function() {<br /> var info = document.getElementById("keep-ads");<br /> var ads = document.querySelectorAll("ins.adsbygoogle");<br /> if ($(ads).height() === 0 ) {<br /> info.className = "show";<br /> }<br />}, 2000)<br />function hidekeep() {<br /> var e = document.getElementById("keep-ads").style.display = "none";<br />};<br />//]]&gt;<br />&lt;/script&gt;</code></pre>
<p><br />Please adjust the sentence with your language, then please create PAGE for&nbsp;how to whitelist&nbsp;<a title="like this" href="http://www.kompiajaib.com/p/whitelisting-kompi-ajaib-in-your-ad.html&amp;usg=ALkJrhiZK1q3pqOLP7G2mmns_jcG81lSPw" target="_blank" rel="noopener noreferer nofollow">like this</a>&nbsp;and then change the&nbsp;<code>URL PAGE HOW TO WHITELIST</code>&nbsp;URL Page how to whitelist you.&nbsp;<br /><br />And make sure your blog is already using any Jquery Library version.&nbsp;<br /><br /></p>
<h3>UPDATED!</h3>
<p>Please refer to&nbsp;<a title="Update" href="http://www.webmanajemen.com/p/search.html?q=update%20notification%20adblock%20adsense" target="_blank" rel="noopener noreferer nofollow">this post</a>&nbsp;for updates.&nbsp;</p>
<div><noscript><img src="https://scontent.fsub2-1.fna.fbcdn.net/v/t1.0-9/fr/cp0/e15/q65/17796846_1773189839677671_6977008867135609966_n.png.jpg?efg=eyJpIjoidCJ9&amp;oh=292c21d1c58e8e185a8d6c63dec60c5a&amp;oe=5957C4B8" width="650" height="350" alt="NoScript Default Fallback" title="default fallback"></noscript></div>
