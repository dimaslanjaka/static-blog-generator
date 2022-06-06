---
date: 2022-05-16T17:00:00+00:00
noindex: true
title: Parse Shortcodes
updated: 2022-05-16T17:00:00+00:00
uuid: 19cd8465-198b-4888-87fd-81972ebaceb1
lang: en
category:
  - uncategorized
tags: []
author: Hexo
comments: true
wordcount: 113
description: Parse Shortcodes - Hexo
subtitle: Parse Shortcodes - Hexo
excerpt: Parse Shortcodes - Hexo
url: https://hexo.io/Tests/shortcodes.html
permalink: /Tests/shortcodes.html
type: post
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
6/4/2022, 3:30:04 PM
```

