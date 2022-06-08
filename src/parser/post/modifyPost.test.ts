import { cwd } from 'process';
import { join } from 'upath';
import { write } from '../../node/filemanager';
import modifyPost from './modifyPost';
import parsePost from './parsePost';

(async () => {
  const parse = await parsePost(
    join(cwd(), 'src-posts', 'The Legend Of Neverland/Quiz.md')
  );
  const modify = modifyPost(parse);
  write(join(__dirname, 'tmp/modifyPost/test.json'), modify);
})();
