import { join } from 'upath';
import { parsePost } from './parsePost';

const parse = parsePost(join(__dirname, '../src-posts/post/hello-world.md'));
console.log(parse);
