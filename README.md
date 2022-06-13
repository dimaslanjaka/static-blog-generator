# hexo-post-parser
[![Build](https://github.com/dimaslanjaka/hexo-post-parser/actions/workflows/build.yml/badge.svg?branch=main)](https://github.com/dimaslanjaka/hexo-post-parser/actions/workflows/build.yml)

Parse Hexo Posts To Object [READ FULL EXAMPLE](https://github.com/dimaslanjaka/hexo-post-parser/blob/main/src/index.test.ts)

## Features
- Parsing HexoJS markdown post
- Parsing Jekyll markdown post

## Usage Sample

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

## Argument Parameters
- `--nocache` : disable cache
- `--verbose` : show all console on verbose

## Reference Repositories
- [Static Blog Generator](https://github.com/dimaslanjaka/static-blog-generator)
