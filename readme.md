# Static Blog Generator v3
HexoJS GUI and Helpers - Static Blog Generator NodeJS.

Static Blog Generator v3 using HexoJS.

Pre-processing of all source posts/articles before rendering using hexo. Useful for low-end devices to avoid memory heap errors. With this package you can prevent using a large number of hexo plugins, because some functions (runners) are separated by task, so they are memory friendly.

<!-- were curently refactoring project using monorepo. Latest working build at https://github.com/dimaslanjaka/static-blog-generator/tree/ee53887be6cbce00dcc49e25a94fdc65c770300c -->

Features:
- Automatic SEO
- Finding broken images
- Finding broken links
- External link anonymizer using [safelinkify](https://www.npmjs.com/package/safelinkify)
- YoastSEO Sitemap
- Export/Import Blogger and Worpdress
- More improvisation on future

## Example - Using automatic deployment with github workflow (CI)
- [www.webmanajemen.com site generator](https://github.com/dimaslanjaka/static-blog-generator-hexo/blob/a110d0ba7752b6ec9295c353ac6f1aafd22270b8/.github/workflows/build-site.yml)
- [reusable workflow](https://github.com/dimaslanjaka/source-posts/blob/fb396eaba81bbdced9302f3e43d01b5166f0dff5/.github/workflows/build-site.yml)

# CLI
## standalone runner
run all files (_*.standalone.js) inside `config.post_dir`

![image](https://user-images.githubusercontent.com/12471057/214767877-79641e0d-dcf6-480a-aee3-689fd584d5e8.png)

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
npx sbg post copy
```

## Anonymize External Links
Cloaking all external links to outbound page redirector, useful for SEO.

| Source | Destination |
| :--- | :--- |
| ./.deploy_git | ./.deploy_git |

```bash
npx sbg deploy safelink
```

## Automatic SEO
- adds an alt tag to an image element when none exists
- adds an title tag to an iframe element when none exists

| Source | Destination |
| :--- | :--- |
| ./.deploy_git | ./.deploy_git |

```bash
npx sbg deploy seo
```

## Generate YoastSEO Sitemap
| Source | Destination | Additional |
| :--- | :--- | :--- |
| ./public | ./public | you can change public folder by set `public_dir` at `_config.yml` |

```bash
npx sbg generate sitemap
```

## Generate RSS ATOM Feeds
| Source | Destination | Additional |
| :--- | :--- | :--- |
| ./public | ./public | you can change public folder by set `public_dir` at `_config.yml` |

```bash
npx sbg generate feed
```

## Roadmap
- [x] Separate with monorepo
- [x] Test each module
- [x] Create single bundle tarball
- [x] Create CI
- [ ] Create Dashboard
- [ ] Integrate Dashboard with google webmaster
- [ ] Fix import/export blogger and wordpress

## Note
Previous stable development [513d687b4d26bbf4ea735313cb79cbcf8d04b36d](https://github.com/dimaslanjaka/static-blog-generator/commit/513d687b4d26bbf4ea735313cb79cbcf8d04b36d)

## Troubleshooting

### miss-configured or missing dependencies or API usages
add below resolutions modules to `package.json`
```json
{
  "resolutions": {
    "cross-spawn": "https://github.com/dimaslanjaka/node-cross-spawn/raw/private/release/cross-spawn.tgz",
    "safelinkify": "https://github.com/dimaslanjaka/safelink/raw/monorepo/release/safelinkify.tgz",
    "sbg-api": "https://github.com/dimaslanjaka/static-blog-generator/raw/beta/packages/sbg-api/release/sbg-api.tgz",
    "sbg-cli": "https://github.com/dimaslanjaka/static-blog-generator/raw/beta/packages/sbg-cli/release/sbg-cli.tgz",
    "sbg-server": "https://github.com/dimaslanjaka/static-blog-generator/raw/beta/packages/sbg-server/release/sbg-server.tgz",
    "sbg-utility": "https://github.com/dimaslanjaka/static-blog-generator/raw/beta/packages/sbg-utility/release/sbg-utility.tgz",
    "sitemap-crawler": "https://github.com/dimaslanjaka/static-blog-generator/raw/beta/packages/sitemap-crawler/release/sitemap-crawler.tgz",
    "static-blog-generator": "https://github.com/dimaslanjaka/static-blog-generator/raw/beta/packages/static-blog-generator/release/static-blog-generator.tgz",
    "hexo-blogger-xml": "https://github.com/dimaslanjaka/hexo-blogger-xml/raw/monorepo/release/hexo-blogger-xml.tgz",
    "hexo-post-parser": "https://github.com/dimaslanjaka/hexo-post-parser/raw/monorepo/release/hexo-post-parser.tgz",
    "hexo-asset-link": "https://github.com/dimaslanjaka/hexo/raw/monorepo-v7/releases/hexo-asset-link.tgz",
    "hexo-front-matter": "https://github.com/dimaslanjaka/hexo/raw/monorepo-v7/releases/hexo-front-matter.tgz",
    "hexo": "https://github.com/dimaslanjaka/hexo/raw/monorepo-v7/releases/hexo.tgz",
    "warehouse": "https://github.com/dimaslanjaka/hexo/raw/monorepo-v7/releases/warehouse.tgz",
    "hexo-theme-landscape": "https://github.com/dimaslanjaka/hexo/raw/monorepo-v7/releases/hexo-theme-landscape.tgz",
    "git-command-helper": "https://github.com/dimaslanjaka/git-command-helper/raw/monorepo/release/git-command-helper.tgz",
    "instant-indexing": "https://github.com/dimaslanjaka/static-blog-generator/raw/beta/packages/instant-indexing/release/instant-indexing.tgz"
  }
}
```
