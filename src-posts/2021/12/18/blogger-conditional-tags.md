---
title: Blogger Conditional Tags
date: 2021-12-08T19:48:00
tags:
  - Blogger
  - XML
toc: true
lang: en
---

# Basic
Basic blogger conditional tags

## Homepage
Blogger Conditional Tag for determine current page is homepage
```xml
<b:if cond='data:blog.url == data:blog.homepageUrl'></b:if>
```
or
```xml
<b:if cond='data:view.isHomepage'></b:if>
```

## Post
Blogger Conditional Tag for determine current page is post ex: http://web-manajemen.blogspot.com/p/privacy.html (**Is Post**)
```xml
<b:if cond='data:blog.pageType == &quot;item&quot;'></b:if>
```
or
```xml
<b:if cond='data:view.isPost'></b:if>
```

## Page
Blogger Conditional Tag for determine current page is page or static page (**Is Page Or Static Page**)
```xml
<b:if cond='data:blog.pageType == &quot;static_page&quot;'></b:if>
```
or
```xml
<b:if cond='data:view.isPage'></b:if>
```

## Custom Post Page
`data:blog.url` is the code to display the original opened url. In the latest version can use `data:view.url`. When the url is the same as the filled url, then the result will be true so that . If you move to a custom domain, the Page Url from blogspot must also be replaced with a custom domain.
```xml
<b:if cond='data:blog.url == &quot;Url Post Or Page&quot;'></b:if>
```
Example: Determine current page is https://web-manajemen.blogspot.com/2017/04/instal-php-cli-pada-android-instalasi.html
```xml
<b:if cond='data:blog.url == &quot;https://web-manajemen.blogspot.com/2017/04/instal-php-cli-pada-android-instalasi.html&quot;'></b:if>
```

## Index
Blogger Conditional Tag for pages that have features to find articles, such as homepage, search, label and archive pages. (**Is Index Blogger Conditional Tag**)
```xml
<b:if cond='data:blog.pageType == &quot;index&quot;'></b:if>
```
or
```xml
<b:if cond='data:view.isMultipleItems'></b:if>
```

## Label
Blogger Conditional Tag to display element while on label page (current page is label) ex: http://web-manajemen.blogspot.com/search/label/Blogger (**Is label (Tags/Categories)**)
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

## Search Page
Blogger conditional tag to display an element when it is on a search page or query data in a blog. ex: https://web-manajemen.blogspot.com/search?q=Install+php+cli
```xml
<b:if cond='data:blog.searchQuery'></b:if>
```
or
```xml
<b:if cond='data:view.search.query'></b:if>
```

## Custom Search Page
Blogger conditional tag to display an element when it is on a search page or query data with custom keywords in a blog.
```xml
<b:if cond='data:blog.searchQuery == &quot;Keywords&quot;'></b:if>
```
or
```xml
<b:if cond='data:view.search.query == &quot;Keywords&quot;'></b:if>
```

## Archives
Blogger conditional tag to determine current page is Archive Blog. ex: http://web-manajemen.blogspot.com/2017/05/
```xml
<b:if cond='data:blog.pageType == &quot;archive&quot;'></b:if>
```
or
```xml
<b:if cond='data:view.isArchive'></b:if>
```

## Error Page (404)
This blogger conditional tag is used to display a warning that the page you are looking for does not exist or is the result of a url error or 404 not found.
``xml
<b:if cond='data:blog.pageType == &quot;error_page&quot;'></b:if>
```
or
```xml
<b:if cond='data:view.isError'></b:if>
```

## Layout Preview Page
This blogger conditional tag can be used to not display adsense js on page layout (layout) and preview (preview). The goal is of course so that the ad does not appear when the article is opened in preview.
```xml
<b:if cond='data:view.isLayoutMode and data:view.isPreview'></b:if>
```

## Mobile Requests
This blogger conditional tag code will only read for HTML code that is displayed specifically on mobile devices aka HandPhones and Tablets. ex: https://web-manajemen.blogspot.com/2017/04/instal-php-cli-pada-android-instalasi.html?m=1
```xml
<b:if cond='data:blog.isMobileRequest'></b:if>
```

# NOT, AND, OR Declaration Function in Blogger Conditional Tags

[Conditional Tags For Desktop](/2017/05/conditional-tags-blogger-for-desktop.md)
[Add Featured Post Image Slider](/2017/05/how-to-add-featured-post-image-slider.md)
[Conditional Tags For Targeting](/2017/05/conditional-tags-for-targeting-on.md)
[Menyembunyikan Javascript Di Blogger AMP](/2017/04/cara-menyembunyikan-javascript-di.md)

