---
title: Post with nunjucks shortcode in body
date: 2022-06-14
updated: 2022-06-14 20:00:00
---

Wrap `markdown -> endmarkdown` below shortcodes when used in markdown blocks

{% markdown %}
| name | value |
| --- | --- |
| Date Published | {{ page.date|date_format("LLL") }} |
| Date Modified | {{ page.updated|date_format("LLL") }} |
{% endmarkdown %}

Below is non-markdown blocks sample

{% set message = "Foo Messages" %}

{# Show the first 5 characters #}
A message for you: {{ message|shorten }}

{# Show the first 20 characters #}
A message for you: {{ message|shorten(6) }}

{% if errors|is_undefined %}
  errors is undefined
{% endif %}