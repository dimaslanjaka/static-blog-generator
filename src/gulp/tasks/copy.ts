import { existsSync } from 'fs';
import gulp from 'gulp';
import through2 from 'through2';
import { TaskCallback } from 'undertaker';
import color from '../../node/color';
import { readdirSync } from '../../node/filemanager';
import scheduler from '../../node/scheduler';
import { replaceArr } from '../../node/string-utils';
import { buildPost, parsePost } from '../../parser/post/parsePost';
import config, {
  cwd,
  post_public_dir,
  post_source_dir,
  verbose
} from '../../types/_config';
import { determineDirname } from '../utils';
import './copy/assets';

const logname = color.cyan('[copy][post]');

/**
 * copy posts from `src-posts` to config.source_dir {@link config.source_dir}
 * @description copy, parsing shortcodes, render html body, etc from src-posts to source_dir
 * @summary copy from src-posts to source/_posts
 * @param cpath custom copy, only copy post with this key
 * @returns
 */
export const copyPosts = (_done: TaskCallback = null, cpath?: string) => {
  const exclude = config.exclude.map(
    (ePattern) => '!' + ePattern.replace(/^!+/, '')
  );
  console.log(
    `${logname} cwd=${color.Mahogany(post_source_dir)} dest=${color[
      'Granny Smith Apple'
    ](post_public_dir)}`
  );
  const run = gulp
    .src(['**/*.md', '!**/.git*', ...exclude], { cwd: post_source_dir })
    .pipe(
      through2.obj(async function (file, _encoding, next) {
        const path = file.path;
        if (typeof cpath == 'string' && cpath.length > 2) {
          // copy specific post path, otherwise drop this item
          if (!path.includes(cpath)) return next();
        }
        const log = [logname, String(path)];
        const parse = await parsePost(String(path), String(file.contents));
        if (!parse) {
          console.log(`cannot parse ${String(path)}`, parse);
          // drop this item
          return next();
        }

        //write(tmp(parse.metadata.uuid, 'article.html'), bodyHtml);
        const build = buildPost(<any>parse);
        if (typeof build == 'string') {
          //write(tmp(parse.metadata.uuid, 'article.md'), build);
          log.push(color.green('success'));
          file.contents = Buffer.from(build);
          //if (this) this.push(file);
          return next(null, file);
        } else {
          console.log(logname, color.Red('build not string'));
        }
        return next();
      })
    );
  return determineDirname(run).pipe(gulp.dest(post_public_dir));
};
/**
 * @see {@link copyPosts}
 */
export const copy_posts = copyPosts;

scheduler.add('indexing-posts', () => {
  const logname = color.Fuchsia('[indexing]');
  if (!existsSync(post_public_dir)) return;
  if (config.verbose) console.log(logname, 'indexing folder', post_public_dir);
  for (const filePath of readdirSync(post_public_dir)) {
    if (!filePath.endsWith('.md')) continue;
    if (verbose) {
      console.log(logname, 'parsing', replaceArr(filePath, [cwd(), /^\//], ''));
    }
    parsePost(filePath);
  }
});
