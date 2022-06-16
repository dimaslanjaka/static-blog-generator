import { existsSync } from 'fs';
import { cwd } from 'process';
import { basename, join } from 'upath';
import MeasureTime from '../../node/benchmark/measure-timing';
import { write } from '../../node/filemanager';
import { cleanWhiteSpace } from '../../node/string-utils';
import parsePost, { buildPost } from './parsePost';
import { simplifyDump } from './postMapper';

function run() {
  [
    'src-posts/Tests/unit/elements.md',
    'src-posts/Tests/shortcodes.md',
    'src-posts/Tests/codeblock.md',
    'src-posts/with-nunjucks-function-in-body.md',
    'src-posts/with-ejs-function-in-body.md'
  ]
    .map((path) => join(cwd(), path))
    .filter(existsSync)
    .forEach(async (path) => {
      const filename = basename(cleanWhiteSpace(path, '-'), '.md');
      const parse = await parsePost(path, null, { cache: false });
      if (!parse) {
        console.log(`cannot parse ${path}`);
        return;
      }

      write(
        join(__dirname, 'tmp/parsePost', filename + '.md'),
        buildPost(parse)
      ).then(console.log);

      await write(
        join(__dirname, 'tmp/parsePost', filename + '.json'),
        simplifyDump(parse, 'body')
      ).then(console.log);
    });
}

new MeasureTime().measure(run);
