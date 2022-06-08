import { existsSync } from 'fs';
import { cwd } from 'process';
import { basename, join } from 'upath';
import MeasureTime from '../../node/benchmark/measure-timing';
import { write } from '../../node/filemanager';
import config from '../../types/_config';
import parsePost, { buildPost } from './parsePost';
import { simplifyDump } from './postMapper';

function run() {
  [
    'src-posts/Tests/unit/elements.md',
    'src-posts/Tests/shortcodes.md',
    'src-posts/Tests/codeblock.md'
  ]
    .map((path) => join(cwd(), path))
    .filter(existsSync)
    .forEach(async (path) => {
      const filename = basename(path, '.md');
      const parse = await parsePost(path, null, { cache: false });
      if (!parse) {
        console.log(`cannot parse ${path}`);
        return;
      }

      const md = await write(
        join(__dirname, 'tmp/parsePost', filename + '.md'),
        buildPost(parse)
      );

      const json = await write(
        join(__dirname, 'tmp/parsePost', filename + '.json'),
        simplifyDump(parse, 'body')
      );

      if (config.verbose) console.log('saved dump', [json, md]);
    });
}

new MeasureTime().measure(run);
