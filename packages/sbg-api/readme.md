# static-blog-generator API

Core api to bootstrap HexoJS workspace

## Changelog

**1.1.1** - 19/01/2024
- skip scheduled posts
> post with creation date (`date` property frontmatter) greater than `Date.now()` will be skipped