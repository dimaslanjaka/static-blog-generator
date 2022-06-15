import { join } from 'upath';
import { inspect } from 'util';
import nunjucksRenderer from '.';
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
  const rendered = await nunjucksRenderer(
    `
    {# Show the first 5 characters #}
    A message for you: {{ message|shorten }}

    {# Show the first 20 characters #}
    A message for you: {{ message|shorten(20) }}
  `,
    data
  );
  console.log(rendered);
})();
