---
title: Images responsive test
date: 2013-12-26 22:46:49
categories: []
tags:
    - assets
updated: 2024-10-12T10:26:16+07:00
---

This is a image test post.

## Internal images

![](/assets/wallpaper-2572384.jpg)

![Caption](/assets/wallpaper-2311325.jpg)

![](/assets/wallpaper-878514.jpg)

![](/images/river.png)
![](/images/landscape-1.jpg)
![](/images/landscape-2.jpg)
![Caption](/images/leaf.jpg)

## External images

Small picture should be centered

![Small Picture](https://via.placeholder.com/350x150.jpg)

## Images without markdown (HTML only)

> these images only working on **[hexo-theme-flowbite](/hexo-themes/hexo-theme-flowbite/images.html)**

```html
<div class="not-format">
    <h4 class="font-bold mb-2">Image Display: Inline</h4>
    <img src="https://via.placeholder.com/150" alt="Inline Image" class="inline">
    <img src="https://via.placeholder.com/150" alt="Inline Image" class="inline">
    <img src="https://via.placeholder.com/150" alt="Inline Image" class="inline">
</div>

<div class="not-format">
    <h4 class="font-bold mb-2">Image Display: Inline-Block</h4>
    <img src="https://via.placeholder.com/150" alt="Inline-Block Image" class="inline-block mr-2">
    <img src="https://via.placeholder.com/150" alt="Inline-Block Image" class="inline-block mr-2">
    <img src="https://via.placeholder.com/150" alt="Inline-Block Image" class="inline-block">
</div>

<div class="not-format">
    <h4 class="font-bold mb-2">Image Display: Flex</h4>
    <div class="flex">
        <img src="https://via.placeholder.com/150" alt="Flex Image" class="mr-2">
        <img src="https://via.placeholder.com/150" alt="Flex Image" class="mr-2">
        <img src="https://via.placeholder.com/150" alt="Flex Image">
    </div>
</div>
```

<div class="not-format">
    <h4 class="font-bold mb-2">Image Display: Inline</h4>
    <img src="https://via.placeholder.com/150" alt="Inline Image" class="inline">
    <img src="https://via.placeholder.com/150" alt="Inline Image" class="inline">
    <img src="https://via.placeholder.com/150" alt="Inline Image" class="inline">
</div>

<div class="not-format">
    <h4 class="font-bold mb-2">Image Display: Inline-Block</h4>
    <img src="https://via.placeholder.com/150" alt="Inline-Block Image" class="inline-block mr-2">
    <img src="https://via.placeholder.com/150" alt="Inline-Block Image" class="inline-block mr-2">
    <img src="https://via.placeholder.com/150" alt="Inline-Block Image" class="inline-block">
</div>

<div class="not-format">
    <h4 class="font-bold mb-2">Image Display: Flex</h4>
    <div class="flex">
        <img src="https://via.placeholder.com/150" alt="Flex Image" class="mr-2">
        <img src="https://via.placeholder.com/150" alt="Flex Image" class="mr-2">
        <img src="https://via.placeholder.com/150" alt="Flex Image">
    </div>
</div>

## Gallery

```nunjucks
{% gallery %}
![Beautiful landscape](https://i.loli.net/2019/12/25/Fze9jchtnyJXMHN.jpg)
![Sunset view](https://i.loli.net/2019/12/25/ryLVePaqkYm4TEK.jpg)
![](https://i.loli.net/2019/12/25/gEy5Zc1Ai6VuO4N.jpg)
![](https://i.loli.net/2019/12/25/d6QHbytlSYO4FBG.jpg)
![](https://i.loli.net/2019/12/25/6nepIJ1xTgufatZ.jpg)
![](https://i.loli.net/2019/12/25/E7Jvr4eIPwUNmzq.jpg)
![](https://i.loli.net/2019/12/25/mh19anwBSWIkGlH.jpg)
![](https://i.loli.net/2019/12/25/2tu9JC8ewpBFagv.jpg)
{% endgallery %}
```

{% gallery %}
![Beautiful landscape](https://i.loli.net/2019/12/25/Fze9jchtnyJXMHN.jpg)
![Sunset view](https://i.loli.net/2019/12/25/ryLVePaqkYm4TEK.jpg)
![](https://i.loli.net/2019/12/25/gEy5Zc1Ai6VuO4N.jpg)
![](https://i.loli.net/2019/12/25/d6QHbytlSYO4FBG.jpg)
![](https://i.loli.net/2019/12/25/6nepIJ1xTgufatZ.jpg)
![](https://i.loli.net/2019/12/25/E7Jvr4eIPwUNmzq.jpg)
![](https://i.loli.net/2019/12/25/mh19anwBSWIkGlH.jpg)
![](https://i.loli.net/2019/12/25/2tu9JC8ewpBFagv.jpg)
{% endgallery %}

```nunjucks
<div class="gallery-group-main">
{% galleryGroup 'Wallpapers' 'Collection of some wallpapers' '/Gallery/wallpaper' https://i.loli.net/2019/11/10/T7Mu8Aod3egmC4Q.png %}
{% galleryGroup 'Marvel' 'Pictures related to Marvel' '/Gallery/marvel' https://i.loli.net/2019/12/25/8t97aVlp4hgyBGu.jpg %}
{% galleryGroup 'OH MY GIRL' 'Pictures related to OH MY GIRL' '/Gallery/ohmygirl' https://i.loli.net/2019/12/25/hOqbQ3BIwa6KWpo.jpg %}
</div>
```

<div class="gallery-group-main">
{% galleryGroup 'Wallpapers' 'Collection of some wallpapers' '/Gallery/wallpaper' https://i.loli.net/2019/11/10/T7Mu8Aod3egmC4Q.png %}
{% galleryGroup 'Marvel' 'Pictures related to Marvel' '/Gallery/marvel' https://i.loli.net/2019/12/25/8t97aVlp4hgyBGu.jpg %}
{% galleryGroup 'OH MY GIRL' 'Pictures related to OH MY GIRL' '/Gallery/ohmygirl' https://i.loli.net/2019/12/25/hOqbQ3BIwa6KWpo.jpg %}
</div>

