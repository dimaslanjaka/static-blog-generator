---
title: Blogger Conditional Tags
date: 2021-12-08T19:48:00
tags:
  - Blogger
  - XML
toc: true
lang: en
---

## Homepage
Blogger Conditional Tag for determine current page is homepage
```xml
<b:if cond='data:blog.url == data:blog.homepageUrl'></b:if>
```
or
```xml
<b:if cond='data:view.isHomepage'></b:if>
```

## Is Post
Blogger Conditional Tag for determine current page is post ex: http://web-manajemen.blogspot.com/p/privacy.html
```xml
<b:if cond='data:blog.pageType == &quot;item&quot;'></b:if>
```
or
```xml
<b:if cond='data:view.isPost'></b:if>
```

## Is Page Or Static Page
Blogger Conditional Tag for determine current page is page or static page
```xml
<b:if cond='data:blog.pageType == &quot;static_page&quot;'></b:if>
```
or
```xml
<b:if cond='data:view.isPage'></b:if>
```

## Is Index
Blogger Conditional Tag for pages that have features to find articles, such as homepage, search, label and archive pages.
```xml
<b:if cond='data:blog.pageType == &quot;index&quot;'></b:if>
```
or
```xml
<b:if cond='data:view.isMultipleItems'></b:if>
```

## Is label (Tags/Categories)
Blogger Conditional Tag to display element while on label page (current page is label) ex: http://web-manajemen.blogspot.com/search/label/Blogger
```xml
<b:if cond='data:blog.searchLabel'></b:if>
```
or
```xml
<b:if cond='data:view.isLabelSearch'></b:if>
```

## Custom Label
Blogger Conditional tag to display on the page a predefined label
```xml
<b:if cond='data:blog.searchLabel == &quot;Label Name&quot;'></b:if>
```
or
```xml
<b:if cond='data:view.search.label == &quot;Label Name&quot;'></b:if>
```


[Conditional Tags For Desktop](/2017/05/conditional-tags-blogger-for-desktop.md)
[Add Featured Post Image Slider](/2017/05/how-to-add-featured-post-image-slider.md)
[Conditional Tags For Targeting](/2017/05/conditional-tags-for-targeting-on.md)
[Menyembunyikan Javascript Di Blogger AMP](/2017/04/cara-menyembunyikan-javascript-di.md)

