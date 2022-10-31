import { existsSync, rmSync } from 'fs';
import { join } from 'upath';
import buildPost from './buildPost';
import { simplifyDump } from './markdown/transformPosts/postMapper';
import color from './node/color';
import { write } from './node/filemanager';
import { slugifySanitizeFilename } from './node/sanitize-filename';
import parsePost from './parsePost';
import config from './types/_config';

const tmpDir = join(__dirname, '../tmp');
if (existsSync(tmpDir)) rmSync(tmpDir, { recursive: true, force: true });

const files = [
  //join(__dirname, '../src-posts/with-description.md'),
  //join(__dirname, '../src-posts/Tests/codeblock.md'),
  //join(__dirname, '../src-posts/Tests/unit/hello-world.md'),
  //join(__dirname, '../src-posts/Tests/unit/elements.md'),
  //join(__dirname, '../src-posts/Tests/unit/markdown.md'),
  //join(__dirname, '../src-posts/folder with space/file post with space.md'),
  //join(__dirname, '../src-posts/without-updated.md'),
  //join(__dirname, '../src-posts/without-date.md'),
  join(__dirname, '../src-posts/post-assets-folder/asset-folder.md'),
  join(__dirname, '../src-posts/with-custom-permalink.md')
  //'D:/Repositories/static-blog-generator/tests/src-posts/Tests/post-assets.md'
];

files.forEach(async (file) => {
  if (existsSync(file)) {
    await startParse(file, config);
    // test within subfolder
    await startParse(
      file,
      Object.assign({}, config, {
        url: 'https://www.webmanajemen.com/chimeraland',
        root: '/chimeraland/'
      })
    );
  } else {
    console.log(`${file} not found`);
  }
});

async function startParse(file: string, config: Record<string, any>) {
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
        slugifySanitizeFilename(filename) + '.md'
      ),
      buildPost(parse)
    );

    const jsonFile = await write(
      join(
        __dirname,
        '../tmp/test/parsePost',
        config.root,
        slugifySanitizeFilename(filename) + '.json'
      ),
      simplifyDump(parse)
    );

    console.log(color.green('success parse'), [jsonFile, mdFile]);
  } else {
    console.log(color.redBright('fail parse'), file);
  }
}
