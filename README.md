# hexo-post-parser
[![Build](https://github.com/dimaslanjaka/hexo-post-parser/actions/workflows/build.yml/badge.svg?branch=main)](https://github.com/dimaslanjaka/hexo-post-parser/actions/workflows/build.yml)

Parse Hexo Posts To Object

- [READ FULL EXAMPLE](https://github.com/dimaslanjaka/hexo-post-parser/tree/master/tests)
- [Typescript Source Code](https://github.com/dimaslanjaka/hexo-post-parser/tree/master/src)
- [AUTO LINTER](https://www.webmanajemen.com/NodeJS/eslint-prettier-typescript-vscode.html)
- [API DOCUMENTATIONS](https://www.webmanajemen.com/docs/hexo-post-parser/modules.html)

## Features
- Parsing HexoJS markdown post
- Parsing Jekyll markdown post
- Post Asset Folder Auto Fix for HexoJS
- Parse shortcodes - ([Show all Shortcodes](#shortcodes))
- Include partials files with html comments
- Get all images from post body and push them to metadata.photos
- Auto find meta description when not set

## Shortcodes

| Shortcode | Description |
| :--- | :--- |
| `<!-- include folder/path.txt -->` | Include partial files |
| `<!-- script folder/script.js -->` | Include JS file as html script `<script>codes</script>` |

## Usage Sample

- [Usages with GULP](https://github.com/dimaslanjaka/static-blog-generator-hexo/blob/master/packages/gulp-sbg/src/gulp.post.ts)

```js
const fs = require('fs');
(async function(){
  const { parsePost, buildPost } = require('hexo-post-parser');
  const parse = await parsePost('path/to/markdown/file.md');
  // dump parsed post to json
  fs.writeFileSync('path/to/file.json', JSON.stringify(parse, null, 2));
  // build parsed post
  fs.writeFileSync('path/to/file.md', buildPost(parse));
})();
```

## Project Sample
[https://github.com/dimaslanjaka/static-blog-generator-hexo](https://github.com/dimaslanjaka/static-blog-generator-hexo)

[https://github.com/dimaslanjaka/chimeraland](https://github.com/dimaslanjaka/chimeraland)

deployed to: [www.webmanajemen.com](https://www.webmanajemen.com)

## Argument Parameters
- `--nocache` : disable cache
- `--verbose` : show all console on verbose

## Reference Repositories
- [Static Blog Generator](https://github.com/dimaslanjaka/static-blog-generator)
