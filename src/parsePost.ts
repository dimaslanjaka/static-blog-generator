import { deepmerge } from 'deepmerge-ts';
import {
  existsSync,
  mkdirpSync,
  readFileSync,
  statSync,
  writeFileSync
} from 'fs-extra';
import { JSDOM } from 'jsdom';
import cache from 'persistent-cache';
import { basename, dirname, join, toUnix } from 'upath';
import yaml from 'yaml';
import { dateMapper, moment } from './dateMapper';
import { generatePostId } from './generatePostId';
import { isValidHttpUrl } from './gulp/utils';
import { renderMarkdownIt } from './markdown/toHtml';
import uniqueArray, { uniqueStringArray } from './node/array-unique';
import color from './node/color';
import { normalize } from './node/filemanager';
import { md5, md5FileSync } from './node/md5-file';
import sanitizeFilename from './node/sanitize-filename';
import { cleanString, cleanWhiteSpace, replaceArr } from './node/utils';
import { parsePermalink } from './parsePermalink';
import { shortcodeCodeblock } from './shortcodes/codeblock';
import { shortcodeCss } from './shortcodes/css';
import { extractText } from './shortcodes/extractText';
import { replaceMD2HTML } from './shortcodes/hyperlinks-md2html';
import { parseShortCodeInclude } from './shortcodes/include';
import { shortcodeScript } from './shortcodes/script';
import { shortcodeNow } from './shortcodes/time';
import { shortcodeYoutube } from './shortcodes/youtube';
import { postMap } from './types/postMap';
import config, { post_generated_dir, ProjectConfig } from './types/_config';
import { countWords, removeDoubleSlashes } from './utils/string';

const _cache = cache({
  base: join(process.cwd(), 'tmp'), //join(process.cwd(), 'node_modules/.cache/persistent'),
  name: 'parsePost',
  duration: 1000 * 3600 * 24 // 24 hours
});

/**
 * Post author object type
 */
export interface postAuthor extends Object {
  [key: string]: any;
  /**
   * Author name
   */
  name?: string;
  /**
   * Author email
   */
  email?: string;
  /**
   * Author website url
   */
  link?: string;
}

export interface ParseOptions {
  shortcodes?: {
    /**
     * Transform shortcode `<!-- css path/to/file.css -->`
     */
    css: boolean;
    /**
     * Transform shortcode `<!-- script path/to/file.js -->`
     */
    script: boolean;
    /**
     * Transform shortcode `<!-- include path/to/file -->`
     */
    include: boolean;
    /**
     * Transform shortcode `{% youtube id 'type' %}` tag
     */
    youtube: boolean;
    /**
     * Transform hyperlinks ends with `path/to/file.md` with `path/to/file.html`
     */
    link: boolean;
    /**
     * Transform shortcode `<!-- extract-text path/to/file -->`
     * @see {@link extractText}
     */
    text: boolean;
    /**
     * Transform shortcode `<!-- now() -->`
     * @see {@link shortcodeNow}
     */
    now: boolean;
    codeblock: boolean;
  };
  cache?: boolean;
  /**
   * Source File, keep empty when first parameter (text) is file
   */
  sourceFile?: null | string;
  /**
   * Format dates?
   */
  formatDate?:
    | boolean
    | {
        pattern: string;
      };
  /**
   * Site Config
   */
  config?: ProjectConfig;
  /**
   * run auto fixer such as thumbnail, excerpt, etc
   */
  fix?: boolean;
}

const default_options: ParseOptions = {
  shortcodes: {
    css: false,
    script: false,
    include: false,
    youtube: false,
    link: false,
    text: false,
    now: false,
    codeblock: false
  },
  sourceFile: null,
  formatDate: false,
  config,
  cache: false,
  fix: false
};

/**
 * Parse Hexo markdown post (structured with yaml and universal markdown blocks)
 * * return {@link postMap} metadata {string & object} and body
 * * return {@link null} == failed
 * @param target file path or string markdown contents (used for cache key)
 * @param options options parser
 * * {@link ParseOptions.sourceFile} used for cache key when `target` is file contents
 */
export async function parsePost(target: string, options: ParseOptions = {}) {
  if (!target) return null;
  options = deepmerge(default_options, options);
  const siteConfig = config;
  if (!options.sourceFile && existsSync(target)) options.sourceFile = target;
  options.config = Object.assign(config, options.config || {});
  const homepage = siteConfig.url.endsWith('/')
    ? siteConfig.url
    : siteConfig.url + '/';
  console.log([homepage, siteConfig.root]);
  const fileTarget = options.sourceFile || target;
  const cacheKey = existsSync(fileTarget)
    ? md5FileSync(fileTarget)
    : md5(fileTarget);
  if (options.cache) {
    //console.log('use cache');
    const getCache = _cache.getSync<postMap>(cacheKey);
    if (getCache) return getCache;
  } else {
    //console.log('rewrite cache');
  }

  /**
   * source file if variable `text` is file
   */
  let originalFile = target;
  const isFile = existsSync(target) && statSync(target).isFile();
  if (isFile) {
    target = String(readFileSync(target, 'utf-8'));
    if (options.sourceFile) originalFile = options.sourceFile;
  }

  const mapper = async (m: RegExpMatchArray) => {
    if (!m) {
      throw new Error(originalFile + ' cannot be mapped');
    }
    let meta: postMap['metadata'] = {
      title: '',
      subtitle: '',
      date: '',
      tags: [],
      categories: []
    };
    try {
      meta = yaml.parse(m[1]);
    } catch (error) {
      //if (error instanceof Error) console.log(error.message, 'cannot parse metadata');
      return null;
    }
    if (typeof meta !== 'object') {
      //writeFileSync(join(cwd(), 'tmp/dump.json'), JSON.stringify(m, null, 2));
      //console.log('meta required object');
      return null;
    }

    let body = m[2];
    if (!body) body = 'no content ' + (meta.title || '');

    const bodyHtml = renderMarkdownIt(body);
    const dom = new JSDOM(bodyHtml);

    if (!meta.id) {
      // assign post id
      meta.id = generatePostId(meta);
    }

    if (options.fix) {
      // @todo fix date
      if (!meta.date) {
        meta.date = moment(new Date()).format('YYYY-MM-DDTHH:mm:ssZ');
      }

      if (meta.modified && !meta.updated) {
        meta.updated = moment(meta.modified).format('YYYY-MM-DDTHH:mm:ssZ');
      }
      if (!meta.updated) {
        // @todo metadata date modified based on date published
        let date: string | Date = String(meta.date);
        if (/\d{4}-\d-\d{2}/.test(date)) date = new Date(String(meta.date));
        meta.updated = moment(date).format('YYYY-MM-DDTHH:mm:ssZ');
      }

      /*
      // change date modified based on file modified date
      if (isFile) {
        const sourceFile = toUnix(originalArg);
        if (existsSync(sourceFile)) {
          if (!meta.updated) {
            const stats = statSync(sourceFile);
            const mtime = stats.mtime;
            meta.updated = moment(mtime).format('YYYY-MM-DDTHH:mm:ssZ');
          }
        }
      }
      */

      // @todo fix meta language
      const lang = meta.lang || meta.language;
      if (!lang) {
        meta.lang = 'en';
        meta.language = 'en';
      }
    }

    // @todo fix meta.category to meta.categories
    if (meta.category) {
      if (!meta.categories || meta.categories.length === 0) {
        meta.categories = meta.category;
      } else if (Array.isArray(meta.category)) {
        meta.categories = meta.categories.concat(...meta.category);
      }

      // delete meta.category
      delete meta.category;
    }

    // @todo set default category and tags
    if (!meta.categories) meta.categories = [];
    if (options.config.default_category && !meta.categories.length)
      meta.categories.push(options.config.default_category);
    if (!meta.tags) meta.tags = [];
    if (options.config.default_tag && !meta.tags.length)
      meta.tags.push(options.config.default_tag);

    // @todo set default date post
    if (!meta.date) meta.date = moment().format();
    if (!meta.updated) {
      if (meta.modified) {
        // fix for hexo-blogger-xml
        meta.updated = meta.modified;
        delete meta.modified;
      } else {
        meta.updated = meta.date;
      }
    } else {
      if (meta.modified) {
        // fix for hexo-blogger-xml
        delete meta.modified;
      }
    }

    // @todo fix thumbnail
    if (options.fix) {
      const thumbnail = meta.cover || meta.thumbnail;
      if (typeof thumbnail === 'string' && thumbnail.trim().length > 0) {
        if (!meta.thumbnail) meta.thumbnail = thumbnail;
        if (!meta.cover) meta.cover = thumbnail;
        if (!meta.photos) {
          meta.photos = [];
        }
        meta.photos.push(meta.cover);
      }
      if (Array.isArray(meta.photos)) {
        const photos: string[] = meta.photos.filter(
          (str) => typeof str === 'string' && str.trim().length > 0
        );
        meta.photos = uniqueArray(photos);
      }
    }

    // @todo fix post author
    if (options.fix) {
      const author = meta.author || options.config.author;
      if (!meta.author && author) {
        meta.author = author;
      }
    }

    // @todo set default enable comments
    if (typeof meta.comments == 'undefined' || meta.comments == null)
      meta.comments = true;
    // @todo set default wordcount to 0
    if (!meta.wordcount) meta.wordcount = 0;

    // @todo set default excerpt/description
    if (meta.subtitle) {
      // check if meta.subtitle exist
      meta.excerpt = meta.subtitle;
      meta.description = meta.subtitle;
    } else if (meta.description && !meta.excerpt) {
      // check if meta.description exist
      meta.subtitle = meta.description;
      meta.excerpt = meta.description;
    } else if (meta.excerpt && !meta.description) {
      // check if meta.excerpt exist
      meta.description = meta.excerpt;
      meta.subtitle = meta.excerpt;
    } else {
      // @todo fix no meta description
      const tags = Array.from(
        dom.window.document.body.getElementsByTagName('*')
      );
      const newExcerpt = [meta.title]
        .concat(uniqueArray(tags.map((el) => el.textContent?.trim())))
        .flat()
        .join(' ')
        .substring(0, 300);
      meta.description = newExcerpt;
      meta.subtitle = newExcerpt;
      meta.excerpt = newExcerpt;
    }

    // @todo fix description
    if (options.fix) {
      // fix empty title
      if (typeof meta.title !== 'string' || meta.title.trim().length === 0) {
        meta.title = basename(options.sourceFile);
      }
      // fix special char in metadata
      meta.title = cleanString(meta.title);
      meta.subtitle = cleanWhiteSpace(cleanString(meta.subtitle));
      meta.excerpt = cleanWhiteSpace(cleanString(meta.excerpt));
      meta.description = cleanWhiteSpace(cleanString(meta.description));
    }

    // @todo fix default category and tags
    if (options.fix) {
      // remove uncategorized if programming category pushed
      if (options.config.default_category)
        if (
          meta.categories.includes(options.config.default_category) &&
          meta.categories.length > 1
        ) {
          meta.categories = meta.categories.filter(
            (e) => e !== options.config.default_category
          );
        }
      // @todo remove untagged if programming category pushed
      if (options.config.default_tag)
        if (
          meta.tags.includes(options.config.default_tag) &&
          meta.tags.length > 1
        ) {
          meta.tags = meta.tags.filter((e) => e !== options.config.default_tag);
        }
    }

    // @todo remove duplicated metadata photos
    if (
      options.fix &&
      'photos' in meta &&
      Array.isArray(meta.photos) &&
      meta.photos.length > 0
    ) {
      try {
        meta.photos = uniqueStringArray(
          meta.photos.filter((str) => str.trim().length > 0)
        );
      } catch (e) {
        console.error('cannot unique photos', meta.title, e.message);
      }
    }

    // @todo delete location
    if (
      Object.prototype.hasOwnProperty.call(meta, 'location') &&
      !meta.location
    ) {
      delete meta.location;
    }

    if (isFile || options.sourceFile) {
      let publicFile: string;
      if (isFile) {
        publicFile = normalize(originalFile);
      } else if (options.sourceFile) {
        publicFile = normalize(options.sourceFile);
      } else {
        throw new Error('cannot find public file of ' + meta.title);
      }
      /**
       * Post Asset Fixer
       * @param sourcePath
       * @returns
       */
      const post_assets_fixer = (sourcePath: string) => {
        const logname = color.Blue('[PAF]');
        if (!publicFile) return sourcePath;
        // replace extended title from source
        sourcePath = sourcePath.replace(/['"](.*)['"]/gim, '').trim();
        // return base64 image
        if (sourcePath.startsWith('data:image')) return sourcePath;
        if (sourcePath.startsWith('//')) sourcePath = 'http:' + sourcePath;
        if (sourcePath.includes('%20'))
          sourcePath = decodeURIComponent(sourcePath);
        if (!isValidHttpUrl(sourcePath) && !sourcePath.startsWith('/')) {
          let result: string | null = null;
          /** search from same directory */
          const find1st = join(dirname(publicFile), sourcePath);
          /** search from parent directory */
          const find2nd = join(dirname(dirname(publicFile)), sourcePath);
          /** search from root directory */
          const find3rd = join(process.cwd(), sourcePath);
          const find4th = join(post_generated_dir, sourcePath);
          [find1st, find2nd, find3rd, find4th].forEach((src) => {
            if (result !== null) return;
            if (existsSync(src) && !result) result = src;
          });

          if (result === null) {
            const tempFolder = join(process.cwd(), 'tmp');
            const logfile = join(
              tempFolder,
              'hexo-post-parser/errors/post-asset-folder/' +
                sanitizeFilename(basename(sourcePath).trim(), '-') +
                '.log'
            );
            if (!existsSync(dirname(logfile))) {
              mkdirpSync(dirname(logfile));
            }
            writeFileSync(
              logfile,
              JSON.stringify(
                {
                  str: sourcePath,
                  f1: find1st,
                  f2: find2nd,
                  f3: find3rd,
                  f4: find4th
                },
                null,
                2
              )
            );
            console.log(logname, color.redBright('[fail]'), {
              str: sourcePath,
              log: logfile
            });
          } else {
            result = replaceArr(
              result,
              [toUnix(process.cwd()), 'source/', '_posts', 'src-posts'],
              '/'
            );
            result = encodeURI((options.config?.root || '') + result);

            result = removeDoubleSlashes(result);

            if (options.config && options.config['verbose'])
              console.log(logname, '[success]', result);

            return result;
          }
        }
        return sourcePath;
      };

      // @todo fix post_asset_folder
      if (options.fix) {
        if (meta.cover) {
          meta.cover = post_assets_fixer(meta.cover);
        }
        // fix thumbnail
        if (meta.thumbnail) {
          meta.thumbnail = post_assets_fixer(meta.thumbnail);
        }

        // add property photos by default
        if (!meta.photos) meta.photos = [];

        if (body && isFile) {
          // get all images from post body
          const imagefinderreplacement = function (whole: string, m1: string) {
            //console.log('get all images', m1);
            const regex = /(?:".*")/;
            let replacementResult: string;
            let img: string;
            if (regex.test(m1)) {
              const replacement = m1.replace(regex, '').trim();
              img = post_assets_fixer(replacement);
              replacementResult = whole.replace(replacement, img);
            }
            if (!replacementResult) {
              img = post_assets_fixer(m1);
              replacementResult = whole.replace(m1, img);
            }
            // push image to photos metadata
            if (typeof img === 'string') meta.photos.push(img);
            return replacementResult;
          };
          // markdown image
          body = body.replace(/!\[.*\]\((.*)\)/gm, imagefinderreplacement);
          // html image
          try {
            const regex = /<img [^>]*src="[^"]*"[^>]*>/gm;
            if (regex.test(body)) {
              body.match(regex).map((x) => {
                return x.replace(/.*src="([^"]*)".*/, imagefinderreplacement);
              });
            }
          } catch {
            console.log('cannot find image html from', meta.title);
          }
        }

        // fix photos
        if (Array.isArray(meta.photos)) {
          meta.photos = meta.photos
            .filter((str) => typeof str === 'string' && str.trim().length > 0)
            .map((photo) => post_assets_fixer(photo))
            // unique
            .filter(function (x, i, a) {
              return a.indexOf(x) === i;
            });
          // add thumbnail if not exist and photos length > 0
          if (!meta.thumbnail && meta.photos.length > 0) {
            meta.thumbnail = meta.photos[0];
          }
        }
      }

      if (!meta.url) {
        const url = replaceArr(
          normalize(publicFile),
          [
            normalize(process.cwd()),
            options.config?.source_dir + '/_posts/',
            'src-posts/',
            '_posts/'
          ],
          '/'
        )
          // @todo remove multiple slashes
          .replace(/\/+/, '/')
          .replace(/^\/+/, '/')
          // @todo replace .md to .html
          .replace(/.md$/, '.html');
        // meta url with full url and removed multiple forward slashes
        meta.url = new URL(homepage + url)
          .toString()
          .replace(/([^:]\/)\/+/g, '$1');
      }

      // determine post type
      //meta.type = toUnix(originalArg).isMatch(/(_posts|src-posts)\//) ? 'post' : 'page';
      if (!meta.type) {
        if (publicFile.match(/(_posts|_drafts|src-posts)\//)) {
          meta.type = 'post';
        } else {
          meta.type = 'page';
        }
      }
    }

    if (options.config && 'generator' in options.config) {
      if (meta.type && !meta.layout && options.config.generator.type) {
        meta.layout = meta.type;
      }
    }

    if (typeof options === 'object') {
      // @todo format dates
      if (options.formatDate) {
        const pattern =
          typeof options.formatDate === 'object' && options.formatDate.pattern
            ? options.formatDate.pattern
            : 'YYYY-MM-DDTHH:mm:ssZ';

        if (meta.date) {
          meta.date = new dateMapper(String(meta.date)).format(pattern);
        }
        if (meta.updated) {
          meta.updated = new dateMapper(String(meta.updated)).format(pattern);
        }
      }
      // @todo process shortcodes
      if (options.shortcodes) {
        const shortcodes = options.shortcodes;
        let sourceFile: string;
        if (!isFile) {
          if (!options.sourceFile)
            throw new Error(
              'Shortcodes cannot process if options.sourceFile does not exist'
            );
          sourceFile = options.sourceFile;
        } else {
          sourceFile = toUnix(originalFile);
        }

        if (body) {
          if (sourceFile) {
            if (shortcodes.include) {
              // @todo parse shortcode include
              body = parseShortCodeInclude(sourceFile, body);
            }
            if (shortcodes.now) body = shortcodeNow(sourceFile, body);
            if (shortcodes.script) body = shortcodeScript(sourceFile, body);
            if (shortcodes.css) body = shortcodeCss(sourceFile, body);
            if (shortcodes.text) body = extractText(sourceFile, body);
          }
          if (shortcodes.link) body = replaceMD2HTML(body);
          if (shortcodes.youtube) body = shortcodeYoutube(body);
          if (shortcodes.codeblock) body = await shortcodeCodeblock(body);
        }
      }
    }

    // @todo count words when wordcount is 0
    if (
      meta.wordcount === 0 &&
      typeof body === 'string' &&
      body.trim().length > 0
    ) {
      const words = Array.from(
        dom.window.document.querySelectorAll('*:not(script,style,meta,link)')
      )
        .map((e) => e.textContent)
        .join('\n');
      meta.wordcount = countWords(words);
    }

    // sort metadata
    meta = Object.keys(meta)
      .sort()
      .reduce(
        (acc, key) => ({
          ...acc,
          [key]: meta[key]
        }),
        {}
      ) as postMap['metadata'];

    const result: postMap = {
      metadata: meta,
      body: body,
      content: body,
      config: <any>siteConfig
    };

    //console.log('hpp permalink in metadata', 'permalink' in result.metadata);
    if ('permalink' in result.metadata === false) {
      result.metadata.permalink = parsePermalink(result);
    }

    if (config.generator?.type === 'jekyll') {
      result.metadata.slug = result.metadata.permalink;
    }

    // put fileTree
    if (isFile) {
      result.fileTree = {
        source: replaceArr(
          toUnix(originalFile),
          ['source/_posts/', '_posts/'],
          'src-posts/'
        ),
        public: toUnix(originalFile).replace('/src-posts/', '/source/_posts/')
      };
    }

    if (meta && body) _cache.putSync(cacheKey, result);

    return result;
  };

  // test opening metadata tag
  const regexPost = /^---([\s\S]*?)---[\n\s\S]\n([\n\s\S]*)/g;
  const testPost = Array.from(target.matchAll(regexPost)).map(mapper)[0];
  if (typeof testPost === 'object' && testPost !== null) {
    //console.log('test 1 passed');
    return testPost;
  }

  // test non-opening metadata tag
  const regexPostNoOpening = /^([\s\S]*?)---[\n\s\S]\n([\n\s\S]*)/g;
  const testPost2 = Array.from(target.matchAll(regexPostNoOpening)).map(
    mapper
  )[0];
  if (typeof testPost2 === 'object' && testPost2 !== null) {
    //console.log('test 2 passed');
    return testPost2;
  }

  const regexPage = /^---([\s\S]*?)---[\n\s\S]([\n\s\S]*)/gm;
  const testPage = Array.from(target.matchAll(regexPage)).map(mapper)[0];
  if (typeof testPage === 'object' && testPage !== null) return testPage;

  return null;
}

export default parsePost;
