import { join } from 'upath';
import { inspect } from 'util';
import { write } from '../../node/filemanager';
import parsePost from '../../parser/post/parsePost';
import { fnWrap } from '../../parser/utility';
import { post_source_dir } from '../../types/_config';
import { EJSRenderer } from './EJSRenderer';

fnWrap(_renderSrc);

async function _renderSrc() {
  {
    const sourcePath = join(post_source_dir, 'with-ejs-function-in-body.md');
    const parsed = await parsePost(sourcePath, null, { cache: false });
    await write(join(__dirname, 'tmp', 'body-test.md'), parsed.body);
    const data = Object.assign(
      {},
      { page: Object.assign({}, parsed, parsed.metadata) }
    );
    await write(join(__dirname, 'tmp', 'data-test.log'), inspect(data));
    const rendered = await EJSRenderer(parsed, data);
    const savedTo = await write(
      join(__dirname, 'tmp', 'rest-result.html'),
      rendered
    );
    console.log({ sourcePath, savedTo });
  }
}
