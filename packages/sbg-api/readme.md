# static-blog-generator API

Core api to bootstrap HexoJS workspace

## TSConfig

- `tsconfig.base.json` base configuration
- `tsconfig.json` only for VSCode
- `tsconfig.build.json` for build dist
- `tsconfig.jest.json` for jest

## Changelog

**1.1.1** - 19/01/2024
- skip scheduled posts
> post with creation date (`date` property frontmatter) greater than `Date.now()` will be skipped