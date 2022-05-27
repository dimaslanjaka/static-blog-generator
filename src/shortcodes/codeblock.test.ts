import { cwd } from 'process';
import { join } from 'upath';
import { write } from '../node/filemanager';
import parsePost from '../parsePost';
import { shortcodeCodeblock } from './codeblock';

(async () => {
  const file = join(cwd(), 'src-posts/Tests/codeblock.md');
  const parse = await parsePost(file);
  const extract = await shortcodeCodeblock(parse.body);
  write(join(__dirname, 'tmp/codeblock.html'), extract);
})();
