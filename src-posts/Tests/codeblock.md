---
title: codeblock shortcode
date: 2022-05-27
updated: 2022-05-27
description: codeblock shortcode usage
webtitle: Static Blog Generator
category:
- guide
- sample
---

## first parsing

{% codeblock Array.map %}
function mapX() {
  return array.map(callback[, thisArg])
}
{% endcodeblock %}

{% codeblock %}
function anything() {
  console.log('hello world');
}
{% endcodeblock %}

{% codeblock title lang:language https://hexo.io/docs/tag-plugins.html#Code-Block %}
code snippet
{% endcodeblock %}

{% codeblock lang:objc %}
[rectangle setX: 10 y: 10 width: 20 height: 20];
{% endcodeblock %}

## second parsing

{% codeblock Array.map %}
function mapX() {
  return array.map(callback[, thisArg])
}
{% endcodeblock %}

{% codeblock %}
function anything() {
  console.log('hello world');
}
{% endcodeblock %}

{% codeblock title lang:language https://hexo.io/docs/tag-plugins.html#Code-Block %}
code snippet
{% endcodeblock %}

{% codeblock lang:objc %}
[rectangle setX: 10 y: 10 width: 20 height: 20];
{% endcodeblock %}