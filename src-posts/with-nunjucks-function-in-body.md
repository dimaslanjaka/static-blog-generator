---
title: Post with nunjucks shortcode in body
date: 2022-06-14
updated: 2022-06-14 20:00:00
---

| name | value |
| --- | --- |
| Date Published | {{ date_format(page.date, "LLL") }} |
| Date Modified | {{ date_format(page.updated, "LLL") }} |