import { writeFileSync } from 'fs';
import { join } from 'upath';
import { parsePost } from '.';

const path = join(__dirname, '../src-posts/2017/05/activate-https-on-blogger-third-party.md');
const parse = parsePost(path);
writeFileSync(join(__dirname, '../tmp', 'test.json'), JSON.stringify(parse, null, 2));
