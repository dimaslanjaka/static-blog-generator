import { writeFileSync } from 'fs';
import gulp from 'gulp';
import { join } from 'upath';
import { array_wrap } from '../../../node/array-wrapper';
import { pcache } from '../../../node/cache';
import CachePost from '../../../node/cache-post';
import color from '../../../node/color';
import scheduler from '../../../node/scheduler';
import modifyPost from '../../../parser/post/modifyPost';
import { postMap } from '../../../parser/post/parsePost';
import postChunksIterator from '../../../parser/post/postChunksIterator';
import { post_chunks, simplifyDump } from '../../../parser/post/postMapper';
import { EJSRenderer } from '../../../renderer/ejs/EJSRenderer';
import { excerpt } from '../../../renderer/ejs/helper/excerpt';
import { thumbnail } from '../../../renderer/ejs/helper/thumbnail';
import config, { cwd, tmp } from '../../../types/_config';

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
  for (let indexTag = 0; indexTag < tags.length; indexTag++) {
    const tagName = tags[indexTag];
    const tag_posts = cacheTags.getSync<postMap[]>(tagName);
    const logname =
      color['Desert Sand']('[generate][tag]') +
      color['Wild Blue Yonder'](`[${tagName}]`);

    // specific tag label otherwise skip
    if (
      typeof labelname == 'string' &&
      labelname.trim().length > 0 &&
      tagName.toLowerCase() !== labelname.toLowerCase()
    ) {
      console.log(tagName, '!==', labelname);
      continue;
    }
    // skip non array
    if (!tag_posts[tagName] || !Array.isArray(tag_posts[tagName])) continue;
    console.log(logname, 'start');
    for (
      let indexTagPost = 0;
      indexTagPost < tag_posts.length;
      indexTagPost++
    ) {
      const treeChunks = post_chunks(tag_posts[tagName]);
      const parentChunks = treeChunks.chunk;

      for (
        let current_page = 0;
        current_page < parentChunks.length;
        current_page++
      ) {
        // @todo check specific page number is set, otherwise skip
        if (typeof pagenum == 'number' && current_page !== pagenum) continue;
        const innerChunks = array_wrap(parentChunks[current_page]);
        const data = postChunksIterator(innerChunks, {
          current_page: current_page,
          base: join(config.tag_dir, tagName),
          parentChunks,
          treeChunks
        });
        const saveTo = join(
          cwd(),
          config.public_dir,
          data.perm_current,
          'index.html'
        );
        const pagemeta: postMap = {
          metadata: {
            title: 'Tag: ' + tagName,
            description: excerpt(config),
            date: data.latestUpdated,
            updated: data.latestUpdated,
            cover: thumbnail(data.posts[0]),
            category: [],
            tags: [],
            type: 'archive'
          },
          body: '',
          content: '',
          fileTree: {
            source: null,
            public: null
          }
        };
        if (current_page > 0) {
          pagemeta.metadata.title = 'Tag: ' + tagName + ' Page ' + current_page;
        }
        const merge_data = Object.assign(pagemeta, data);
        const pagedata = modifyPost(<any>merge_data);
        const rendered = await EJSRenderer(<any>pagedata);
        const f = writeFileSync(saveTo, rendered);
        console.log(logname, f);

        if (config.verbose) {
          writeFileSync(
            tmp('generateTags', data.perm_current + '.log'),
            simplifyDump(<any>pagedata)
          );
        }
        if (labelname) return rendered;
      }
    }
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
        if (postTags[tagName].length > 0)
          cacheTags.putSync(tagName, postTags[tagName]);
      }
    }
    //if (indexPost == allPosts.length - 1)
  }
});

gulp.task('generate:tags', () => generateTags());
