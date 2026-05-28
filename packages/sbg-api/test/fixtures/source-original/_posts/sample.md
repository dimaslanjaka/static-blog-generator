---
title: nunjucks in markdown
date: 2023-10-04T09:26:26+07:00
tags: [post]
---

## pretext

inline codeblock `build-${{ hashFiles('package-lock.json') }}`

```js
const varx = `build-${{ hashFiles('package-lock.json') }}`
```

```ts
const xvar = `build-${{ hashFiles('package-lock.json') }}`
```

```
const var = `build-${{ hashFiles('package-lock.json') }}`
```

## meta info

- published: {{ page.date | default("No date provided") }}
- modified: {{ page.updated | default("No modification date") }}

## Curly bracket inside hyperlink

- [This should escaped <x> <y>](https://stackoverflow.com/questions/43900035/ts4023-exported-variable-x-has-or-is-using-name-y-from-external-module-but)

- [This should <b>valid</b>](https://stackoverflow.com/questions/43900035/ts4023-exported-variable-x-has-or-is-using-name-y-from-external-module-but)

- [This should **valid**](https://stackoverflow.com/questions/43900035/ts4023-exported-variable-x-has-or-is-using-name-y-from-external-module-but)

## Assets

![logo](/logo.png)

<video width="320" height="240" controls>
  <source src="/videos/eula party.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

![wallpaper](/images/wallpaper-878514.jpg)