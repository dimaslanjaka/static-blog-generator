import { PathLike, readdirSync, writeFileSync } from 'fs';
import { basename, join } from 'upath';
import { parsePost } from '.';

const files = walkSync(join(__dirname, '../src-posts/Tests')).filter((path) => path.endsWith('.md'));
const tmp = join(__dirname, '../tmp');
for (const filePath of files) {
  const parse = parsePost(filePath, {
    formatDate: true,
    shortcodes: { youtube: true, include: true, css: true, script: true, link: true }
  });
  writeFileSync(join(tmp, basename(filePath, '.md') + '.body.md'), parse.body);

  // remove anoying properties for easy to read
  parse.body = 'body';
  parse.content = 'body';
  parse.config = {};

  writeFileSync(join(tmp, basename(filePath, '.md') + '.json'), JSON.stringify(parse, null, 2));
}

/**
 * Iterate Files Recusively From Directory
 * @see {@link https://stackoverflow.com/a/66083078/6404439}
 * @param dir dir path
 */
function walkSync(dir: PathLike) {
  const files = readdirSync(dir, { withFileTypes: true });
  let results: string[] = [];
  for (const file of files) {
    if (file.isDirectory()) {
      results = results.concat(walkSync(join(dir, file.name)));
    } else {
      results.push(join(dir, file.name));
    }
  }
  return results;
}
