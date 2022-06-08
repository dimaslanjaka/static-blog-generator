import { existsSync, statSync } from 'fs';
import { join } from 'upath';
import { CachePost } from '../../../node/cache-post';
import color from '../../../node/color';
import { copy, globSrc } from '../../../node/filemanager';
import { replaceArr } from '../../../node/string-utils';
import parsePost from '../../../parser/post/parsePost';
import config, {
  argv,
  cwd,
  post_public_dir,
  post_source_dir
} from '../../../types/_config';

const paths =
  typeof argv['paths'] === 'string' ? argv['paths'].split(',') : null;

/**
 * copy src-post assets to source/_posts
 * @returns
 */
export const copyAssets = (customPaths: string | string[] = paths) => {
  if (!existsSync(post_source_dir)) {
    const msg = post_source_dir + ' not found';
    console.log(msg);
    throw new Error(msg);
  }
  console.log(
    `${color.magentaBright('[copy][assets]')} cwd=${color.Mahogany(
      post_source_dir
    )} dest=${color['Granny Smith Apple'](post_public_dir)}`
  );
  const cachePost = new CachePost();
  const postPaths = cachePost.getAll().map<string>((post) => {
    return replaceArr(
      post.metadata.source,
      [post_source_dir, cwd(), /^\//],
      ''
    );
  });
  //console.log(postPaths);
  //const run = gulp.src(['**/*.*', `!**/*.md`], { cwd: post_source_dir });
  //return determineDirname(run).pipe(gulp.dest(post_public_dir));
  return globSrc('*/**', {
    cwd: post_source_dir,
    ignore: config.exclude
  })
    .map((path) => join(post_source_dir, path))
    .filter(async (item) => {
      let isPathValid =
        // validate item is not post
        !postPaths.some((route) => item.includes(route)) &&
        existsSync(item) &&
        statSync(item).isFile();
      // validate when custom path is set
      if (typeof customPaths === 'string') {
        isPathValid = isPathValid && item.includes(customPaths);
      } else if (Array.isArray(customPaths)) {
        isPathValid =
          isPathValid && customPaths.some((route) => item.includes(route));
      }
      if (isPathValid) {
        // @todo validate is file page
        const parse = await parsePost(item);
        if (!parse) return true;
      }
      return false;
    })
    .map((path) => {
      const src = path;
      const dest = path.replace(post_source_dir, post_public_dir);
      copy(src, dest);
      return { src, dest };
    });
};

/**
 * @see {@link copyAssets}
 */
export const copy_assets = copyAssets;
