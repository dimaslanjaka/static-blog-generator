# static-blog-generator API

Core api to bootstrap HexoJS workspace. [See test for usages](https://github.com/dimaslanjaka/static-blog-generator/tree/sbg-api/packages/sbg-api/test)

## Verbose

To enable verbose logging

<details>
  <summary>Click me</summary>

  NodeJS

  ```js
  process.env.DEBUG = 'sbg-*,post:*,post,clean,clean:*';
  ```

  Windows CMD

  ```batch
  set DEBUG=sbg-*,post:*,post,clean,clean:*
  ```

  Windows Powershell

  ```powershell
  $env:DEBUG='sbg-*,post:*,post,clean,clean:*'
  ```

  POSIX

  ```bash
  export DEBUG='sbg-*,post:*,post,clean,clean:*'
  ```

  NodeJS `cross-env`

  ```bash
  cross-env DEBUG='sbg-*,post:*,post,clean,clean:*'
  ```
</details>

## Changelog

**2.0.0**
- Migrate to ESM with shim for CJS
- Update dependencies

**1.1.1** - 19/01/2024
- skip scheduled posts
> post with creation date (`date` property frontmatter) greater than `Date.now()` will be skipped