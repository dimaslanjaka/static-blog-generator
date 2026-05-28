---
title: Post with long categories and tags
tags:
  - this is a very long tag name
  - another extremely descriptive tag
  - technical concept with a long title
  - yet another tag for sorting purposes
category:
  - Category With a Long Name
  - Subcategory That Is Also Long
date: 2023-10-27T10:00:00Z
---

# Post with long categories and tags

This is the body of the post. It follows the frontmatter section, which is closed by the triple dashes (`---`) above.

## Why use long tags?

Using descriptive, long tags helps with specificity when you have a large archive of content. Instead of just using "javascript," you might use "javascript async await patterns" to be more precise.

### Benefits

*   **Improved Search:** Users can find exactly what they are looking for.
*   **Better Grouping:** Content is segmented into more precise niches.
*   **SEO:** Long-tail keywords can help with search engine ranking.

## Example Code Block

Here is how you might implement a loop to display these long tags in your template:

```html
<ul>
  {% for tag in post.tags %}
    <li>{{ tag }}</li>
  {% endfor %}
</ul>
```

Thank you for reading!