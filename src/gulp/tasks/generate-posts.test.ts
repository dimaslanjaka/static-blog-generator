import { existsSync } from 'fs';
import { cwd } from 'process';
import { join } from 'upath';
import { write } from '../../node/filemanager';
import parsePost from '../../parser/post/parsePost';
import { EJSRenderer } from '../../renderer/ejs/EJSRenderer';
import config from '../../types/_config';

(async function () {
  const file = join(cwd(), config.source_dir, '_posts/Tests/shortcodes.md');
  if (existsSync(file)) {
    const parse = await parsePost(file);
    const render = await EJSRenderer(parse);
    write(join(__dirname, 'tmp/generate-posts/shortcodes.html'), render);
  }
})();
