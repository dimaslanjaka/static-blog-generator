---
title: Post with nunjucks shortcode in body
date: 2022-06-14
updated: 2022-06-14 20:00:00
---

| name | value |
| --- | --- |
| Date Published | {{ page.date|date_format("LLL") }} |
| Date Modified | {{ page.updated|date_format("LLL") }} |

{% set message = "Foo Messages" %}

{# Show the first 5 characters #}
A message for you: {{ message|shorten }}

{# Show the first 20 characters #}
A message for you: {{ message|shorten(6) }}

{% if errors|is_undefined %}
  errors is undefined
{% endif %}