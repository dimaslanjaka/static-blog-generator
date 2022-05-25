import { join } from 'upath';
import parsePost from './parsePost';

const files = [
  join(__dirname, '../src-posts/01.md'),
  join(__dirname, '../src-posts/post/hello-world.md'),
  join(__dirname, '../src-posts/post/elements.md'),
  join(__dirname, '../src-posts/post/markdown.md')
];

const _parse = parsePost(files[3], {
  formatDate: true,
  shortcodes: {
    youtube: true,
    include: true,
    css: true,
    script: true,
    link: true,
    text: true,
    now: true
  },
  cache: false,
  fix: true
  //sourceFile: filePath
});
_parse.body = _parse.content = 'hidden';
_parse.config = {};
console.log(_parse);
