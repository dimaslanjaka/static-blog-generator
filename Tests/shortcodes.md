---
title: Parse Shortcodes
index: false
noindex: true
date: 2022-05-17
updated: 2022-05-17
type: page
---

## Shortcode CSS
From Local Directory

```html
<!-- css shortcodes/include.css -->
```

From Root/cwd Directory

```html
<!-- css /src-posts/Tests/shortcodes/include.css -->
```

## Shortcode JS
From Local Directory

```html
<!-- script shortcodes/include.js -->
```

From Root/cwd Directory

```html
<!-- script /src-posts/Tests/shortcodes/include.js -->
```

## Shortcode Include

From Local Directory

```html
<!-- include shortcodes/include.html -->
```

From Root/cwd Directory

```html
<!-- include /src-posts/Tests/shortcodes/include.html -->
```

## Shortcode Youtube
By default youtube tag will output video
```html
{% youtube 4_oXjfgQ2G4 %}
```
Manually set type `video`
```html
{% youtube 4_oXjfgQ2G4 'video' %}
```
Manually set type `playlist`
```html
{% youtube RDGMEMQ1dJ7wXfLlqCjwV0xfSNbA 'playlist' %}
```

## Shortcode extract-text
```html
<!-- extract-text shortcodes/include.txt -->
```

## Shortcode now()
```html
<!-- now() -->
```

