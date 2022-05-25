import gulp from 'gulp';
import { Nullable } from 'safelinkify/dist/resolveQueryUrl';
import { pcache } from '../../node/cache';
import CachePost from '../../node/cache-post';
import scheduler from '../../node/scheduler';
import { postMap } from '../../parser/post/parsePost';

//const cacheTags = new CacheFile('postTags');
const cacheTags = pcache('tags');
/**
 * generate tags archive
 * @param labelname specific tag name
 * @param pagenum specific page number
 */
export default async function generateTags(
  labelname?: string | null,
  pagenum?: number
): Promise<Nullable<string>> {
  const tags = cacheTags.keysSync();
  for (let indexTag = 0; indexTag < tags.length; indexTag++) {
    const tagName = tags[indexTag];
    const tag_posts = cacheTags.getSync(tagName);
    console.log(tag_posts);
  }
  /*const tag_posts: { [key: string]: postMap[] } = cacheTags.getAll();
  for (const tagname in tag_posts) {
    if (Object.prototype.hasOwnProperty.call(tag_posts, tagname)) {
      // specific tag label otherwise skip
      if (labelname && tagname.toLowerCase() !== labelname.toLowerCase())
        continue;
      // skip non array
      if (!tag_posts[tagname] || !Array.isArray(tag_posts[tagname])) continue;
      const logname =
        color['Desert Sand']('[generate][tag]') +
        color['Wild Blue Yonder'](`[${tagname}]`);
      const treeChunks = post_chunks(tag_posts[tagname]);
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
          base: join(config.tag_dir, tagname),
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
            title: 'Tag: ' + tagname,
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
          pagemeta.metadata.title = 'Tag: ' + tagname + ' Page ' + current_page;
        }
        const merge_data = Object.assign(pagemeta, data);
        const pagedata = modifyPost(merge_data);
        const rendered = await renderer(<any>pagedata);
        const f = await write(saveTo, rendered);
        console.log(logname, f);

        if (config.verbose) {
          write(
            tmp('generateTags', data.perm_current + '.log'),
            simplifyDump(pagedata)
          );
        }
        if (labelname) return rendered;
      }
    }
  }*/
  return null;
}

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
