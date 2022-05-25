import { join } from 'upath';
import { parsePost } from './parsePost';

const files = [
  join(__dirname, '../src-posts/01.md'),
  join(__dirname, '../src-posts/post/hello-world.md'),
  join(__dirname, '../src-posts/post/elements.md')
];
const _parse = parsePost(files[2]);
console.log(_parse);
