import { join } from 'upath';
import { inspect } from 'util';
import nunjucksRenderer, { nunjucksEnv } from '.';
import { write } from '../../node/filemanager';
import parsePost from '../../parser/post/parsePost';
import { post_source_dir } from '../../types/_config';

(async () => {
  const path = join(post_source_dir, 'with-nunjucks-function-in-body.md');
  const parse = await parsePost(path, null, { cache: false });
  const data = Object.assign(
    {},
    { page: Object.assign({}, parse, parse.metadata) }
  );
  write(join(__dirname, 'tmp', 'data-test.log'), inspect(data));
  write(join(__dirname, 'tmp', 'data-test-body.md'), parse.body);
  console.log('shorten', nunjucksEnv.getFilter('shorten'));
  console.log('date_format', nunjucksEnv.getFilter('date_format'));
  const rendered = await nunjucksRenderer(parse.body, data);
  console.log(rendered);
  console.log('source', path);
})();
