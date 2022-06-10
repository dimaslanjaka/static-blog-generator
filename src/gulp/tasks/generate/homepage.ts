import gulp from 'gulp';
import { join } from 'upath';
import util, { inspect } from 'util';
import { array_wrap } from '../../../node/array-wrapper';
import color from '../../../node/color';
import { write } from '../../../node/filemanager';
import modifyPost from '../../../parser/post/modifyPost';
import { post_chunks } from '../../../parser/post/postMapper';
import { EJSRenderer } from '../../../renderer/ejs/EJSRenderer';
import { getLatestDateArray } from '../../../renderer/ejs/helper/date';
import { excerpt } from '../../../renderer/ejs/helper/excerpt';
import config, { cwd, post_generated_dir } from '../../../types/_config';
import { getChunkOf } from './getChunkOf';
import homepageTest from './homepage.test';

let logname = color['Desert Sand']('[generate][index]');

/**
 * generate index
 * * customized generation by param {@link labelNameOrObj}
 * ```properties
 * "type number"  = generate specific archive page
 * "all"          = generate all homepage and archives
 * "homepage"     = generate only first index/homepage
 * "null"         = all
 * "default"      = all
 * ```
 * @param labelNameOrObj
 * @example
 * generateIndex('homepage'); // only generate homepage
 * generateIndex(4); // only generate page 4
 */
export function generateIndex(
  labelNameOrObj?: 'homepage' | number | string | any
) {
  type type_getChunkOf = ReturnType<typeof getChunkOf>;
  type type_post_chunks = ReturnType<typeof post_chunks>;
  const postsChunks: type_post_chunks | type_getChunkOf =
    typeof labelNameOrObj == 'object'
      ? labelNameOrObj
      : typeof labelNameOrObj == 'function'
      ? labelNameOrObj()
      : null;

  if (typeof postsChunks == 'object') {
    if ('chunk' in postsChunks === false) {
      return Object.keys(postsChunks)
        .map((labelKey) => {
          const opt = generateSingleIndex(
            postsChunks[labelKey],
            labelNameOrObj
          );

          write(join(__dirname, 'tmp/archive', labelKey + '.json'), opt);

          return null;
        })
        .filter((gen) => typeof gen === 'string');
    } else {
      const opt = generateSingleIndex(postsChunks, labelNameOrObj, {
        title: {
          index: 'Homepage',
          pagination: 'Archive Page %d'
        },
        description: excerpt(config),
        base: post_generated_dir,
        url: config.url
      });

      write(join(__dirname, 'tmp/archive', `home.json`), opt);
      return null;
    }
  }
}

export async function generateSingleIndex(
  postsChunks: ReturnType<typeof getChunkOf> | ReturnType<typeof post_chunks>,
  labelNameOrObj?: string | number,
  meta?: Record<string, any>
) {
  if ('chunk' in postsChunks) {
    const chunks = postsChunks['chunk'];
    if (Array.isArray(chunks)) {
      if (!chunks.length) {
        console.log(logname, 'post empty');
        return null;
      }
      // setup variable for infinite scroll
      const sitedata = postsChunks.sitedata;
      const isSpecific = typeof labelNameOrObj == 'number';
      for (let current_page = 0; current_page < chunks.length; current_page++) {
        const isFirstIndex = current_page === 0;
        if (isSpecific && current_page != labelNameOrObj) continue;
        // break only process homepage
        if (labelNameOrObj == 'homepage' && !isFirstIndex) break;
        logname = color['Desert Sand']('[generate][index]');
        let saveTo = join(cwd(), config.public_dir, 'index.html');
        if (!isFirstIndex) {
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
            typeof post.updated == 'string'
              ? post.updated
              : post.updated.toString()
          )
        );
        const opt = {
          metadata: {
            title: isFirstIndex
              ? meta.title.index
              : util.format(meta.title.pagination, current_page),
            description: meta.description,
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
            public: join(saveTo, 'tmp/index.html')
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
              '/' +
              join(config.archive_dir, 'page', (current_page - 1).toString());
            if (current_page - 1 <= 0) return '/';
            return prev;
          })(),
          page_current_url: (() => {
            const current =
              '/' + join(config.archive_dir, 'page', current_page.toString());
            if (current_page - 1 === 0) return '/';
            return current;
          })(),
          page_next_url:
            '/' +
            join(config.archive_dir, 'page', (current_page + 1).toString()),
          page_next: (() => {
            const next = current_page + 1;
            // returns null if the next array is not an array type
            if (Array.isArray(chunks[next])) return next;
          })()
        };

        // debug
        opt.sitedata = '';
        opt.posts = [];
        write(join(__dirname, 'tmp/archive', current_page + '.json'), opt);
        continue;

        const mod = modifyPost(<any>opt) as typeof opt;
        // @todo wrap posts array to used in template
        mod.posts = array_wrap(mod.posts);
        if (config.verbose) {
          const f = await write(
            join(__dirname, 'tmp/archives/rendered.log'),
            inspect(opt.posts)
          );
          console.log('dump to', f);
        }
        const rendered = await EJSRenderer(<any>mod);
        await write(saveTo, rendered);
        console.log(logname, saveTo);
        // immediately returns
        if (isFirstIndex && labelNameOrObj == 'homepage') return rendered;
        if (isSpecific && labelNameOrObj === current_page) return rendered;
      }
    }
  }
}

gulp.task('test:generate:index', homepageTest);
gulp.task('test', gulp.series('test:generate:index'));

gulp.task('generate:categories', async () => {});
gulp.task('generate:tags', async () => {});
gulp.task('generate:index', async () => generateIndex());
gulp.task(
  'generate:label',
  gulp.series('generate:tags', 'generate:categories')
);
gulp.task('generate:labels', gulp.series('generate:label'));
gulp.task('generate:archive', gulp.series('generate:index', 'generate:label'));
