import { existsSync } from 'fs';
import { join } from 'upath';
import color from './node/color';
import { write } from './node/filemanager';
import parsePost from './parsePost';

const files = [
  join(__dirname, '../src-posts/with-description.md'),
  join(__dirname, '../src-posts/Tests/unit/hello-world.md'),
  join(__dirname, '../src-posts/Tests/unit/elements.md'),
  join(__dirname, '../src-posts/Tests/unit/markdown.md'),
  join(__dirname, '../src-posts/Tests/codeblock.md')
];

files.forEach(async (file) => {
  if (existsSync(file)) {
    const parse = parsePost(file, {
      formatDate: true,
      shortcodes: {
        youtube: true,
        include: true,
        css: true,
        script: true,
        link: true,
        text: true,
        now: true
      },
      cache: false,
      fix: true
      //sourceFile: filePath
    });
    if (parse) {
      parse.body = parse.content = 'hidden';
      parse.config = {};
      const filename = parse.metadata.title;

      const savedTo = await write(
        join(__dirname, '../tmp/test/parsePost', filename + '.json'),
        parse
      );
      console.log(color.green('success parse'), savedTo);
    } else {
      console.log(color.redBright('fail parse'), file);
    }
  } else {
    console.log(`${file} not found`);
  }
});
