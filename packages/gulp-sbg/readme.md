# Static Blog Generator Gulp

Static Blog Generator using Gulp System

## Copy source posts to hexo source dir
Compiling and Copying all source posts including shortcodes etc to hexo source post directory

| Source | Destination |
| :--- | :--- |
| ./src-posts | ./source/_posts |

```bash
gulp copy-all-posts
```

API documentation: [https://www.webmanajemen.com/docs/gulp-sbg/functions/gulp_post.copyAllPosts.html](https://www.webmanajemen.com/docs/gulp-sbg/functions/gulp_post.copyAllPosts.html)

## Anonymize External Links
Cloaking all external links to outbound page redirector, useful for SEO.

| Source | Destination |
| :--- | :--- |
| ./.deploy_git | ./.deploy_git |

```bash
gulp safelink
```
