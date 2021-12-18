---
title: HTMLCollection/NodeList in JavaScript/Typescript?
webtitle: NodeJS
subtitle: "How to detect HTMLCollection/NodeList in JavaScript/Typescript?"
lang: en
date: 2021-11-28T07:00:00
type: post
tags:
  - TS
  - JS
keywords:
  - typescript
  - NodeListOf
  - HTMLCollectionOf
author:
  nick: "Dimas Lanjaka"
  link: "https://github.com/dimaslanjaka"
  image: "https://i.pinimg.com/564x/32/bc/65/32bc65e19220728fb290249059a7242a.jpg"

category:
  - Programming

cover: "https://i.ytimg.com/vi/ubNP6fbT2Ac/maxresdefault.jpg"
location: Indonesia
comments: true
---

# How to detect HTMLCollection/NodeList in JavaScript/Typescript?

## HTMLCollection Detect
```javascript
// check if variable is instance of HTMLCollection
HTMLCollection.prototype.isPrototypeOf(variable)
```

## NodeList Detect
```javascript
// check if variable is instance of NodeList
NodeList.prototype.isPrototypeOf(variable)
```

## Typescript Comparator Example

```typescript
let loaders: NodeListOf<Element> | HTMLCollectionOf<Element>;
loaders = document.getElementsByClassName("className"); // will return typeof HTMLCollectionOf<Element>
loaders = document.querySelectorAll("[class*='className']"); // will return typeof NodeListOf<Element>
if (HTMLCollection.prototype.isPrototypeOf(this.loaders)) {
  console.log('loaders is instanceof HTMLCollection');
} else if (NodeList.prototype.isPrototypeOf(this.loaders)) {
  console.log('loaders is instanceof NodeList');
}
```

## Typescript how to iterate Nodelist or HTMLCollection variable type
### Wrong/Bad
```typescript
loaders.forEach((el) => {
  console.log(el);
});
```

> codes above will thrown:
>
> Property 'forEach' does not exist on type `NodeListOf<Element> | HTMLCollectionOf<Element>`.
>
> Property 'forEach' does not exist on type `HTMLCollectionOf<Element>`. ts(2339)

### Good
```typescript
let loaders: NodeListOf<Element> | HTMLCollectionOf<Element>;
loaders = document.getElementsByClassName("className"); // will return typeof HTMLCollectionOf<Element>
loaders = document.querySelectorAll("[class*='className']"); // will return typeof NodeListOf<Element>
for (let index = 0; index < loaders.length; index++) {
  const element: Element = loaders.item(index); // or loaders[index]
  console.log(element);
}
```
