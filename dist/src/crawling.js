"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
import { existsSync } from 'fs';
import { join } from 'upath';
import { pcache } from './node/cache';
import { CachePost } from './node/cache-post';
import color from './node/color';
import { readdirSync, write } from './node/filemanager';
import scheduler from './node/scheduler';
import { replaceArr } from './node/string-utils';
import parsePost, { postMap } from './parser/post/parsePost';
import { cwd, post_public_dir, verbose } from './types/_config';

//const hexodb = new HexoDB();

scheduler.add('indexing-categories', () => {
  const cache = pcache('categories');
  indexingOf(cache);
});

scheduler.add('indexing-tags', () => {
  const cache = pcache('tags');
  indexingOf(cache);
});

scheduler.add('indexing-posts', async () => {
  const logname = color.Fuchsia('[indexing]');
  if (!existsSync(post_public_dir)) return;
  if (verbose) console.log(logname, 'indexing folder', post_public_dir);
  for (const filePath of readdirSync(post_public_dir)) {
    if (!filePath.endsWith('.md')) continue;
    if (verbose) {
      console.log(logname, 'parsing', replaceArr(filePath, [cwd(), /^\//], ''));
    }
    const parse = await parsePost(filePath);
    if (parse.metadata.title === '.md' || !parse.metadata.title) {
      return write(
        join(__dirname, 'tmp/indexing/post.log'),
        `${parse.metadata.title} ${filePath}\n`,
        true
      );
    }
    // skip index page
    if (parse.metadata.type === 'page') continue;
    //hexodb.addPost(parse);
  }
  //hexodb.save();
});

function indexingOf(cache: ReturnType<typeof pcache>) {
  // iterate posts to get tags
  const posts = new CachePost();
  const postTags: { [key: string]: postMap[] } = {};
  const allPosts = posts.getAll();
  for (let indexPost = 0; indexPost < allPosts.length; indexPost++) {
    const post = allPosts[indexPost];
    if (post.metadata.tags && !post.metadata.redirect) {
      if (!Array.isArray(post.metadata.tags)) {
        post.metadata.tags = [post.metadata.tags];
      }

      for (let indexTag = 0; indexTag < post.metadata.tags.length; indexTag++) {
        const tagName = post.metadata.tags[indexTag];

        if (!postTags[tagName]) postTags[tagName] = [];
        if (
          !postTags[tagName].find(
            ({ metadata }) => metadata.title === post.metadata.title
          )
        ) {
          postTags[tagName].push(<any>post);
        }
        if (postTags[tagName].length > 0) {
          cache.putSync(tagName, postTags[tagName]);
        }
      }
    }
  }
}
*/
function crawling() {
    return 'indexing should be run before process exited';
}
exports.default = crawling;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3Jhd2xpbmcuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvY3Jhd2xpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBOEVFO0FBQ0YsU0FBd0IsUUFBUTtJQUM5QixPQUFPLDhDQUE4QyxDQUFDO0FBQ3hELENBQUM7QUFGRCwyQkFFQyJ9