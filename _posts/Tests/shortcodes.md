---
date: 2022-05-17T00:00:00+07:00
index: false
noindex: true
title: Parse Shortcodes
type: page
updated: 2022-05-17T00:00:00+07:00
uuid: 19cd8465-198b-4888-87fd-81972ebaceb1
category:
  - Uncategorized
tags: []
author:
  name: Dimas Lanjaka
  link: https://www.webmanajemen.com/
  email: dimaslanjaka@gmail.com
  image:
    url: https://res.cloudinary.com/dimaslanjaka/image/fetch/https://imgdb.net/images/3600.jpg
    width: 1944
    height: 2592
  social_links:
    github: https://github.com/dimaslanjaka
    youtube: https://youtube.com/p/L3n4r0x
comments: true
wordcount: 110
description: Parse Shortcodes - Website Manajemen Indonesia
subtitle: Parse Shortcodes - Website Manajemen Indonesia
excerpt: Parse Shortcodes - Website Manajemen Indonesia
url: https://www.webmanajemen.com/Tests/shortcodes.html
permalink: /Tests/shortcodes.html
---

## Shortcode CSS
From Local Directory

```html
<style>/*STYLE CSS SHORTCODES*/
.just-test {
  display: block;
}</style>
```

From Root/cwd Directory

```html
<style>/*STYLE CSS SHORTCODES*/
.just-test {
  display: block;
}</style>
```

## Shortcode JS
From Local Directory

```html
<script>/* script js shortcode */
console.log('hello world');
</script>
```

From Root/cwd Directory

```html
<script>/* script js shortcode */
console.log('hello world');
</script>
```

## Shortcode Include

From Local Directory

```html
<p>included html</p>
```

From Root/cwd Directory

```html
<p>included html</p>
```

## Shortcode extract-text
From Local Directory

```html
include extract text
```

From Root/cwd Directory

```html
include extract text
```

## Shortcode Youtube
By default youtube tag will output video
```html
<div class="video-container">
<iframe src="https://www.youtube.com/embed/4_oXjfgQ2G4" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" loading="lazy" allowfullscreen="true"></iframe>
</div>
```
Manually set type `video`
```html
<div class="video-container">
<iframe src="https://www.youtube.com/embed/4_oXjfgQ2G4" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" loading="lazy" allowfullscreen="true"></iframe>
</div>
```
Manually set type `playlist`
```html
<div class="video-container">
<iframe src="https://www.youtube.com/embed/videoseries?list=RDGMEMQ1dJ7wXfLlqCjwV0xfSNbA" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" loading="lazy" allowfullscreen="true"></iframe>
</div>
```

## Shortcode now()
```html
5/19/2022, 6:31:18 PM
```

