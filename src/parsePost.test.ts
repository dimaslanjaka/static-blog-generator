import { existsSync, rmSync } from 'fs';
import { join } from 'upath';
import buildPost from './buildPost';
import { simplifyDump } from './markdown/transformPosts/postMapper';
import color from './node/color';
import { write } from './node/filemanager';
import { slugify } from './node/sanitize-filename';
import parsePost from './parsePost';

rmSync(join(__dirname, '../tmp'), { recursive: true, force: true });

const files = [
  //join(__dirname, '../src-posts/with-description.md'),
  //join(__dirname, '../src-posts/Tests/codeblock.md'),
  //join(__dirname, '../src-posts/Tests/unit/hello-world.md'),
  //join(__dirname, '../src-posts/Tests/unit/elements.md'),
  //join(__dirname, '../src-posts/Tests/unit/markdown.md'),
  //join(__dirname, '../src-posts/folder with space/file post with space.md'),
  //join(__dirname, '../src-posts/without-updated.md'),
  //join(__dirname, '../src-posts/without-date.md'),
  join(__dirname, '../src-posts/post-assets-folder/asset-folder.md')
  //'D:/Repositories/static-blog-generator/tests/src-posts/Tests/post-assets.md'
];

files.forEach(async (file) => {
  if (existsSync(file)) {
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
      sourceFile: file
    });
    if (parse && parse.metadata) {
      const filename = parse.metadata.title;
      const mdFile = await write(
        join(__dirname, '../tmp/test/parsePost', slugify(filename) + '.md'),
        buildPost(parse)
      );

      const jsonFile = await write(
        join(__dirname, '../tmp/test/parsePost', slugify(filename) + '.json'),
        simplifyDump(parse)
      );

      console.log(color.green('success parse'), [jsonFile, mdFile]);
    } else {
      console.log(color.redBright('fail parse'), file);
    }
  } else {
    console.log(`${file} not found`);
  }
});
