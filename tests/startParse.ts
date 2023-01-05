process.cwd = () => __dirname;

import { join } from 'upath';
import { buildPost, parsePost } from '../src';
import { simplifyDump } from '../src/markdown/transformPosts/postMapper';
import color from '../src/node/color';
import { write } from '../src/node/filemanager';
import slugify from '../src/node/slugify';

/**
 * start parse post
 * @param file
 * @param config  overriden config
 * @returns
 */
export async function startParse(file: string, config: Record<string, any>) {
  const parse = await parsePost(file, {
    formatDate: true,
    shortcodes: {
      youtube: true,
      include: true,
      css: true,
      script: true,
      link: true,
      text: true,
      now: true,
      codeblock: true
    },
    cache: false,
    fix: true,
    sourceFile: file,
    config
  });
  if (parse && parse.metadata) {
    const filename = parse.metadata.title;
    const mdFile = await write(
      join(
        __dirname,
        '../tmp/test/parsePost',
        config.root,
        slugify(filename) + '.md'
      ),
      buildPost(parse)
    );

    const jsonFile = await write(
      join(
        __dirname,
        '../tmp/test/parsePost',
        config.root,
        slugify(filename) + '.json'
      ),
      simplifyDump(parse)
    );

    console.log(color.green('success parse'), [jsonFile, mdFile]);
  } else {
    console.log(color.redBright('fail parse'), file);
  }
  return parse;
}
