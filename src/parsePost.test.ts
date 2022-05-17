import { join } from 'upath';
import parsePost from './parsePost';

const path = join(process.cwd(), 'src-posts/2017/05activate-https-on-blogger-third-party.md');
const parse = parsePost(path);
console.log(parse);
