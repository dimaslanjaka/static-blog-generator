# hexo-post-parser
[![Build](https://github.com/dimaslanjaka/hexo-post-parser/actions/workflows/build.yml/badge.svg?branch=main)](https://github.com/dimaslanjaka/hexo-post-parser/actions/workflows/build.yml)

Parse Hexo Posts To Object [READ FULL EXAMPLE](https://github.com/dimaslanjaka/hexo-post-parser/blob/main/src/index.test.ts)

```js
(async function(){
  const {parsePost} = require('hexo-post-parser');
  const parse = await parsePost('path/to/markdown/file.md');
  console.log(parse);
})();
```

## Reference Repositories
- [Static Blog Generator](https://github.com/dimaslanjaka/dimaslanjaka.github.io)
