import { existsSync } from 'fs';
import { join } from 'upath';
import buildPost from './buildPost';
import { simplifyDump } from './markdown/transformPosts/postMapper';
import color from './node/color';
import { write } from './node/filemanager';
import parsePost from './parsePost';

const files = [
  //join(__dirname, '../src-posts/with-description.md'),
  //join(__dirname, '../src-posts/Tests/unit/hello-world.md'),
  join(__dirname, '../src-posts/Tests/unit/elements.md'),
  join(__dirname, '../src-posts/Tests/unit/markdown.md')
  //join(__dirname, '../src-posts/Tests/codeblock.md')
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
      fix: true
      //sourceFile: filePath
    });
    if (parse && parse.metadata) {
      const filename = parse.metadata.title;
      const mdFile = await write(
        join(__dirname, '../tmp/test/parsePost', filename + '.md'),
        buildPost(parse)
      );

      const jsonFile = await write(
        join(__dirname, '../tmp/test/parsePost', filename + '.json'),
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
