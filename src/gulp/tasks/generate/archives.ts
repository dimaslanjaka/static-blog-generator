import gulp from 'gulp';
import { join } from 'upath';
import { inspect } from 'util';
import { array_wrap } from '../../../node/array-wrapper';
import color from '../../../node/color';
import { write } from '../../../node/filemanager';
import modifyPost from '../../../parser/post/modifyPost';
import { archiveMap, post_chunks } from '../../../parser/post/postMapper';
import { EJSRenderer } from '../../../renderer/ejs/EJSRenderer';
import { getLatestDateArray } from '../../../renderer/ejs/helper/date';
import { excerpt } from '../../../renderer/ejs/helper/excerpt';
import config, { cwd } from '../../../types/_config';
import './generate-categories';
import './generate-tags';

/**
 * generate index
 * * customized generation by param {@link labelname}
 * ```properties
 * "type number"  = generate specific archive page
 * "all"          = generate all homepage and archives
 * "homepage"     = generate only first index/homepage
 * "null"         = all
 * "default"      = all
 * ```
 * @param labelname
 * @example
 * generateIndex('homepage'); // only generate homepage
 * generateIndex(4); // only generate page 4
 */
export async function generateIndex(labelname?: 'homepage' | number) {
  const postsChunks = post_chunks();
  const chunks = postsChunks.chunk;
  let logname = color['Desert Sand']('[generate][index]');
  if (!chunks.length) {
    console.log(logname, 'post empty');
    return null;
  }
  // setup variable for infinite scroll
  const sitedata = postsChunks.sitedata;
  const isSpecific = typeof labelname == 'number';
  for (let current_page = 0; current_page < chunks.length; current_page++) {
    const isHome = current_page === 0;
    if (isSpecific && current_page != labelname) continue;
    // break only process homepage
    if (labelname == 'homepage' && !isHome) break;
    logname = color['Desert Sand']('[generate][index]');
    let saveTo = join(cwd(), config.public_dir, 'index.html');
    if (!isHome) {
      saveTo = join(
        cwd(),
        config.public_dir,
        config.archive_dir,
        'page/' + current_page,
        'index.html'
      );
      logname = logname + color.lightpink('[archive]');
    } else {
      logname = logname + color['Granny Smith Apple']('[homepage]');
    }

    // @fixme page.post.each
    const mapped = array_wrap(chunks[current_page]);
    const latestUpdated = getLatestDateArray(
      mapped.map((post) =>
        typeof post.updated == 'string' ? post.updated : post.updated.toString()
      )
    );
    const opt = {
      metadata: {
        title: isHome ? 'Homepage' : 'Page ' + current_page,
        subtitle: excerpt(config),
        date: latestUpdated,
        updated: latestUpdated,
        category: [],
        tags: [],
        type: 'archive',
        url: config.url
      },
      /** setup sitedata array as json */
      sitedata: JSON.stringify(sitedata),
      body: '',
      content: '',
      fileTree: {
        source: saveTo,
        public: join(cwd(), 'tmp', 'index.html')
      },
      posts: mapped, // mapped.map((chunks) => modifyPost(chunks)),
      total: chunks.length,
      page_now: current_page,
      page_prev: (() => {
        const prev = current_page - 1;
        // returns null if the previous array is not an array type
        if (Array.isArray(chunks[prev])) return prev;
      })(),
      page_prev_url: (() => {
        const prev =
          '/' + join(config.archive_dir, 'page', (current_page - 1).toString());
        if (current_page - 1 === 0) return '/';
        return prev;
      })(),
      page_current_url: (() => {
        const current =
          '/' + join(config.archive_dir, 'page', current_page.toString());
        if (current_page - 1 === 0) return '/';
        return current;
      })(),
      page_next_url:
        '/' + join(config.archive_dir, 'page', (current_page + 1).toString()),
      page_next: (() => {
        const next = current_page + 1;
        // returns null if the next array is not an array type
        if (Array.isArray(chunks[next])) return next;
      })()
    };

    const mod = modifyPost(opt as archiveMap);
    // @todo wrap posts array to used in template
    mod.posts = array_wrap(mod.posts);
    if (config.verbose) {
      const f = await write(
        join(__dirname, 'tmp/generate-archives/rendered.log'),
        inspect(opt.posts)
      );
      console.log('dump to', f);
    }
    const rendered = await EJSRenderer(<any>mod);
    await write(saveTo, rendered);
    console.log(logname, saveTo);
    // immediately returns
    if (isHome && labelname == 'homepage') return rendered;
    if (isSpecific && labelname === current_page) return rendered;
    /*

    // dump
    if (config.verbose) {
      const f = await write(
        tmp('generateindex', `page-${current_page}.json`),
        mapped.map((post) => {
          delete post.config;
          delete post.body;
          delete post.content;
          post.next = null;
          post.prev = null;
          post.metadata = null;
          return post;
        })
      );
      console.log(logname, 'dump', f);
    }*/
  }
}

gulp.task('generate:index', () => generateIndex());
gulp.task(
  'generate:label',
  gulp.series('generate:tags', 'generate:categories')
);
gulp.task('generate:labels', gulp.series('generate:label'));
gulp.task('generate:archive', gulp.series('generate:index', 'generate:label'));
