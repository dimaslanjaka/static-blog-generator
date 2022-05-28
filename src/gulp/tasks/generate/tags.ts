import gulp from 'gulp';
import { join } from 'path';
import { pcache } from '../../../node/cache';
import CachePost from '../../../node/cache-post';
import color from '../../../node/color';
import { write } from '../../../node/filemanager';
import scheduler from '../../../node/scheduler';
import { postMap } from '../../../parser/post/parsePost';
import { simplifyDump } from '../../../parser/post/postMapper';
import { isDev } from '../../../types/_config';
//const cacheTags = new CacheFile('postTags');
const cacheTags = pcache('tags');
/**
 * generate tags archive
 * @param labelname specific tag name
 * @param pagenum specific page number
 */
export async function generateTags(
  labelname?: string | null,
  pagenum?: number
) {
  const tags = cacheTags.keysSync();
  if (!tags.length) {
    console.log('tags empty');
    return;
  }
  for (let indexTag = 0; indexTag < tags.length; indexTag++) {
    const tagname = tags[indexTag];
    const tag_posts = cacheTags.getSync<postMap[]>(tagname);
    if (tag_posts.length === 0) {
      console.log(`tag ${tagname} not have post`);
      continue;
    }
    const logname =
      color['Desert Sand']('[generate][tag]') +
      color['Wild Blue Yonder'](`[${tagname}]`);

    // specific tag label otherwise skip
    if (
      typeof labelname == 'string' &&
      labelname.trim().length > 0 &&
      tagname.toLowerCase() !== labelname.toLowerCase()
    ) {
      // console.log(logname, tagname, '!==', labelname);
      continue;
    }

    if (isDev)
      write(
        join(__dirname, 'tmp/tags', tagname + '.json'),
        tag_posts.map((post) => simplifyDump(post))
      );

    // skip non array
    if (!tag_posts[tagname] || !Array.isArray(tag_posts[tagname])) continue;
    console.log(logname, 'start');
  }
  return null;
}
export default generateTags;

scheduler.add('add-tags', () => {
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
          cacheTags.putSync(tagName, postTags[tagName]);
        }
      }
    }
    //if (indexPost == allPosts.length - 1)
  }
});

gulp.task('generate:tags', async () => {});
