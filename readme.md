# Static Blog Generator v3

Static Blog Generator v3 using Gulp System.

Pre-processing all source posts before rendering from hexo. Useful for low-end devices to avoid memory heap errors. With this package you can prevent using large number of hexo plugins, because some function (runner) separated by task, so memory friendly.

API documentation: [https://www.webmanajemen.com/docs/static-blog-generator/modules/](https://www.webmanajemen.com/docs/static-blog-generator/modules/)

Usages:
  - [https://github.com/dimaslanjaka/static-blog-generator-hexo/blob/master/gulpfile.js](https://github.com/dimaslanjaka/static-blog-generator-hexo/blob/master/gulpfile.js)

## Configuration
Configuration setup for `_config.yml` that required for this package (you can change the values)
```yaml
public_dir: "public"
source_dir: "source"
post_dir: "src-posts"
```

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

## todo

- CLI

| :heavy_check_mark: | command | Description |
| :--- | :--- | :--- |
| &#9744; | sbg copy post | process and copy post from `src-posts` to `source/_posts` |

<!--
Checkboxed inside markdown table
| Unchecked | Checked |
| --------- | ------- |
| &#9744;   | &#9745; |
-->
