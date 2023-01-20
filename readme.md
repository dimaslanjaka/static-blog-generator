# Static Blog Generator v3

Static Blog Generator v3 using Gulp System. (under development)

Pre-processing all source posts before rendering from hexo. Useful for low-end devices to avoid memory heap errors. With this package you can prevent using large number of hexo plugins, because some function (runner) separated by task, so memory friendly.

## API documentation
- [index](https://www.webmanajemen.com/docs/static-blog-generator/)
- [modules](https://www.webmanajemen.com/docs/static-blog-generator/modules/)

## Usages
- copy source posts (`gulp post:copy`)
- generate site (`hexo generate`)
- anonymize link (`gulp safelink`) optional
- fix seo (`gulp seo`) optional

### References
- [https://github.com/dimaslanjaka/static-blog-generator-hexo/blob/master/gulpfile.js](https://github.com/dimaslanjaka/static-blog-generator-hexo/blob/master/gulpfile.js)

## Configuration
Configuration setup for `_config.yml` that required for this package (you can change the values)
```yaml
public_dir: "public"
source_dir: "source"
post_dir: "src-posts"
generator:
  # enable global cache
  cache: true
  # transform shortcodes result to amp html
  amp: false
```

## Copy source posts to hexo source dir
Compiling and Copying all source posts including shortcodes etc to hexo source post directory

| Source | Destination |
| :--- | :--- |
| ./src-posts | ./source/_posts |

```bash
gulp post:copy
```

## Anonymize External Links
Cloaking all external links to outbound page redirector, useful for SEO.

| Source | Destination |
| :--- | :--- |
| ./.deploy_git | ./.deploy_git |

```bash
gulp safelink
```

## Automatic SEO
- adds an alt tag to an image element when none exists
- adds an title tag to an iframe element when none exists

| Source | Destination |
| :--- | :--- |
| ./.deploy_git | ./.deploy_git |

```bash
gulp seo
```

## todo

- CLI

| &#9745; | command | Description |
| :--- | :--- | :--- |
| &#9744; | sbg copy post | process and copy post from `src-posts` to `source/_posts` |
| &#9745; | gulp --tasks | list all tasks |

<!--
Checkboxed inside markdown table
| Unchecked | Checked |
| --------- | ------- |
| &#9744;   | &#9745; |
-->
