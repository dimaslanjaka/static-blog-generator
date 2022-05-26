import Bluebird from 'bluebird';
import chalk from 'chalk';
import gulp from 'gulp';
import { toUnix } from 'upath';
import { renderer } from '../../ejs/renderer';
import CacheFile from '../../node/cache';
import Sitemap from '../../node/cache-sitemap';
import color from '../../node/color';
import {
  cwd,
  existsSync,
  globSrc,
  join,
  mkdirSync,
  removeMultiSlashes,
  resolve,
  write
} from '../../node/filemanager';
import { replaceArr } from '../../node/string-utils';
import { modifyPost } from '../../parser/post/modifyPost';
import parsePost, { buildPost } from '../../parser/post/parsePost';
import { validateParsed } from '../../parser/transformPosts';
import config, { root, tmp } from '../../types/_config';

/**
 * @see {@link config.source_dir}
 */
const source_dir = toUnix(resolve(join(root, config.source_dir)));
/**
 * @see {@link config.public_dir}
 */
const generated_dir = toUnix(resolve(join(root, config.public_dir)));
if (!existsSync(generated_dir)) mkdirSync(generated_dir);
const logname = chalk.hex('#fcba03')('[render]');

const renderCache = new CacheFile('renderArticle');
const sitemap = new Sitemap();

export const renderPost = function () {
  const log = logname + chalk.blue('[posts]');
  return new Bluebird((resolve) => {
    console.log(log, 'generating to', generated_dir);
    const exclude = config.exclude.map((ePattern) =>
      ePattern.replace(/^!+/, '')
    );
    const ignore = ['_drafts/', '_data/', ...exclude];
    globSrc('**/*.md', { ignore: ignore, cwd: source_dir })
      // validate excluded
      .filter((file) => {
        if (file.match(/_(drafts|data)\//)) return false;
        return true;
      })
      // transform path and others
      .map((file) => {
        const result = {
          /**
           * post type
           */
          type: file.includes('_posts/') ? 'post' : 'page',
          /** Full path (also cache key) */
          path: join(source_dir, file),
          /** Permalink path */
          permalink: removeMultiSlashes(
            replaceArr(
              file,
              [cwd(), 'source/_posts/', 'src-posts/', '_posts/'],
              '/'
            )
          ).replace(/.md$/, '.html'),
          /** Is Cached */
          cached: false
        };
        // set cache indicator, if cache not exist and argument nocache not set
        result.cached = renderCache.has(result.path) && config.generator.cache;
        let parsed = parsePost(result.path);
        // try non-cache method
        if (!validateParsed(<any>parsed)) parsed = parsePost(result.path);
        if (!validateParsed(<any>parsed)) {
          console.log(
            log,
            color.redBright('[fail]'),
            'cannot parse',
            result.path
          );
          return;
        }
        const modify = modifyPost(<any>parsed);
        if (result.path.includes('Grid'))
          write(tmp('modify.md'), buildPost(modify)).then(console.log);
        const merge = Object.assign(result, modify, result.path);
        if (
          typeof merge.metadata == 'object' &&
          typeof merge.metadata.url == 'string'
        ) {
          const url = new URL(merge.metadata.url);
          url.pathname = url.pathname.replace(/\/+/, '/');
          merge.metadata.url = url.toString();
        }
        return merge;
      })
      // filter only non-empty object
      .filter((parsed) => typeof parsed == 'object')
      .then(function (result) {
        console.log(log, 'markdown sources total', result.length);
        let counter = 0;
        /**
         * Queue for process first item
         * @returns
         */
        const runner = () => {
          counter++;
          if (!result.length) return resolve(result.length);
          // get first item
          const parsed = result[0];
          console.log(`${counter} generate post ${parsed.metadata.title}`);

          /**
           * remove first item, skip
           * @returns
           */
          const skip = () => {
            result.shift();
            if (!result.length) return resolve();
            return runner();
          };

          /**
           * Save rendered ejs to `config.public_dir`
           * @param rendered
           * @returns
           */
          const save = (rendered: string) => {
            const saveto = join(generated_dir, parsed.permalink);
            //console.log(logname, chalk.greenBright('generated'), saveto);
            write(saveto, rendered);
            parsed.generated = rendered;
            parsed.generated_path = saveto;
            renderCache.set(parsed.path, rendered);
            //write(tmp(parsed.permalink.replace(/.html$/, '.md')), JSON.stringify(parsed));
            //console.log(logname + chalk.cyanBright('[remaining]', result.length));
            sitemap.add(parsed.metadata);
            return parsed;
          };

          if (parsed.cached) {
            if (renderCache.isFileChanged(parsed.path)) {
              console.log(
                log + chalk.blueBright('[cache]'),
                parsed.path,
                chalk.redBright('changed')
              );
            } else {
              // if cache hit, skip process
              return skip();
            }
          }

          renderer(parsed)
            .then(save)
            .then(skip)
            .catch((e) => {
              console.log(logname, chalk.red('[error]'), parsed.path);
              console.error(e);
            });
        };
        return runner();
      });
  });
};

gulp.task('generate:posts', renderPost);
