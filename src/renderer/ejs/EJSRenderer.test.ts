import { join } from 'upath';
import { inspect } from 'util';
import { write } from '../../node/filemanager';
import parsePost from '../../parser/post/parsePost';
import { post_source_dir } from '../../types/_config';
import { EJSRenderer } from './EJSRenderer';

(async () => {
  const path = join(post_source_dir, 'with-ejs-function-in-body.md');
  const parse = await parsePost(path, null, { cache: false });
  const data = Object.assign(
    {},
    { page: Object.assign({}, parse, parse.metadata) }
  );
  await write(join(__dirname, 'tmp', 'data-test.log'), inspect(data));
  const rendered = await EJSRenderer(parse, data);
  const s = await write(join(__dirname, 'tmp', 'result-test.html'), rendered);
  console.log(s);
})();
