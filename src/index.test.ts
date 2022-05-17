import { PathLike, readdirSync, writeFileSync } from 'fs';
import { basename, join } from 'upath';
import { parsePost } from '.';

const files = walkSync(join(__dirname, '../src-posts/Tests')).filter((path) => path.endsWith('.md'));

for (const filePath of files) {
  const parse = parsePost(filePath, { shortcodes: true });

  // remove body to easy read
  parse.body = 'body';
  parse.content = 'body';

  writeFileSync(join(__dirname, '../tmp', basename(filePath, '.md') + '.json'), JSON.stringify(parse, null, 2));
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
