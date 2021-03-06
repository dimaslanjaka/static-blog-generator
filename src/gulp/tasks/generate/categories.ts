import gulp from 'gulp';
import { array_wrap } from '../../../node/array-wrapper';
import CacheFile from '../../../node/cache';
import color from '../../../node/color';
import { join, write } from '../../../node/filemanager';
import modifyPost from '../../../parser/post/modifyPost';
import { postMap } from '../../../parser/post/parsePost';
import postChunksIterator from '../../../parser/post/postChunksIterator';
import { post_chunks, simplifyDump } from '../../../parser/post/postMapper';
import { EJSRenderer } from '../../../renderer/ejs/EJSRenderer';
import { excerpt } from '../../../renderer/helpers/excerpt';
import { thumbnail } from '../../../renderer/helpers/thumbnail';
import config, { cwd, tmp } from '../../../types/_config';

const cacheCats = new CacheFile('postCats');
export async function generateCategories(labelname?: string, pagenum?: number) {
  const cat_posts: { [key: string]: postMap[] } = cacheCats.getAll();
  for (const catname in cat_posts) {
    if (Object.prototype.hasOwnProperty.call(cat_posts, catname)) {
      // specific tag label otherwise skip
      if (labelname && catname !== labelname) continue;
      // skip non array
      if (!cat_posts[catname] || !Array.isArray(cat_posts[catname])) continue;
      const logname =
        color.Manatee('[generate][tag]') + color.Fuchsia(`[${catname}]`);
      const treeChunks = post_chunks(cat_posts[catname]);
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
          base: join(config.category_dir, catname),
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
            title: 'Category: ' + catname,
            subtitle: excerpt(config),
            description: excerpt(config),
            date: data.latestUpdated,
            updated: data.latestUpdated,
            cover: thumbnail(<any>data.posts[0]),
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
          pagemeta.metadata.title =
            'Category: ' + catname + ' Page ' + current_page;
        }
        const merge_data = Object.assign(pagemeta, data);
        const pagedata = modifyPost(<any>merge_data);
        const rendered = await EJSRenderer(<any>pagedata);
        const f = await write(saveTo, rendered);
        console.log(logname, f);
        if (config.verbose) {
          write(
            tmp('generateCategories', data.perm_current + '.log'),
            simplifyDump(pagedata)
          );
        }
        if (labelname) return rendered;
      }
    }
  }
}
export default generateCategories;

gulp.task('generate:categories', () => generateCategories());
