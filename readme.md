# Static Blog Generator Gulp

Static Blog Generator using Gulp System.

Pre-processing all source posts before rendering from hexo. Useful for low-end devices to prevent using large number of hexo plugins.

API documentation: [https://www.webmanajemen.com/docs/static-blog-generator/modules/](https://www.webmanajemen.com/docs/static-blog-generator/modules/)

Usages:
  - [https://github.com/dimaslanjaka/static-blog-generator-hexo/blob/master/gulpfile.js](https://github.com/dimaslanjaka/static-blog-generator-hexo/blob/master/gulpfile.js)

## Copy source posts to hexo source dir
Compiling and Copying all source posts including shortcodes etc to hexo source post directory

| Source | Destination |
| :--- | :--- |
| ./src-posts | ./source/_posts |

```bash
gulp copy-all-posts
```

## Anonymize External Links
Cloaking all external links to outbound page redirector, useful for SEO.

| Source | Destination |
| :--- | :--- |
| ./.deploy_git | ./.deploy_git |

```bash
gulp safelink
```
