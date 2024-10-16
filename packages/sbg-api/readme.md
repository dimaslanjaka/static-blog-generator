# static-blog-generator API

Core api to bootstrap HexoJS workspace. [See test for usages](https://github.com/dimaslanjaka/static-blog-generator/tree/sbg-api/packages/sbg-api/test)

## Changelog

**1.1.1** - 19/01/2024
- skip scheduled posts
> post with creation date (`date` property frontmatter) greater than `Date.now()` will be skipped