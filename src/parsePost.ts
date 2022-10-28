import { deepmerge } from 'deepmerge-ts';
import { existsSync, readFileSync, statSync } from 'fs';
import cache from 'persistent-cache';
import { basename, join, toUnix } from 'upath';
import yaml from 'yaml';
import { dateMapper, moment } from './dateMapper';
import { generatePostId } from './generatePostId';
import uniqueArray, { uniqueStringArray } from './node/array-unique';
import { normalize } from './node/filemanager';
import { md5, md5FileSync } from './node/md5-file';
import { cleanString, cleanWhiteSpace, replaceArr } from './node/utils';
import { parsePermalink } from './parsePermalink';
import post_assets_fixer from './post_assets_fixer';
import { shortcodeCodeblock } from './shortcodes/codeblock';
import { shortcodeCss } from './shortcodes/css';
import { extractText } from './shortcodes/extractText';
import { replaceMD2HTML } from './shortcodes/hyperlinks-md2html';
import { parseShortCodeInclude } from './shortcodes/include';
import { shortcodeScript } from './shortcodes/script';
import { shortcodeNow } from './shortcodes/time';
import { shortcodeYoutube } from './shortcodes/youtube';
import { postMap } from './types/postMap';
import config, { ProjectConfig } from './types/_config';

const _cache = cache({
  base: join(process.cwd(), 'tmp/persistent-cache'), //join(process.cwd(), 'node_modules/.cache/persistent'),
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

/**
 * make all properties as optional recursively
 */
export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

/**
 * null | type
 */
export type Nullable<T> = T | null | undefined;

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
export async function parsePost(
  target: string,
  options: DeepPartial<ParseOptions> = {}
) {
  if (!target) return null;
  options = deepmerge(default_options, options);
  // , { sourceFile: target }
  if (!options.sourceFile && existsSync(target)) options.sourceFile = target;
  if (!options.config) options.config = config;
  const HexoConfig = options.config;
  const homepage = HexoConfig.url.endsWith('/')
    ? HexoConfig.url
    : HexoConfig.url + '/';
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
    let meta: postMap['metadata'] = {
      title: '',
      subtitle: '',
      date: '',
      tags: [],
      category: []
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
    //write(tmp('parsePost', 'original.log'), body).then(console.log);
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

      // @todo fix lang
      if (!meta.lang) meta.lang = 'en';
    }

    // @todo set default category and tags
    if (!meta.category) meta.category = [];
    if (options.config.default_category && !meta.category.length)
      meta.category.push(options.config.default_category);
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
      if (thumbnail) {
        if (!meta.thumbnail) meta.thumbnail = thumbnail;
        if (!meta.cover) meta.cover = thumbnail;
        if (!meta.photos) {
          meta.photos = [];
        }
        meta.photos.push(meta.cover);
      }
      if (meta.photos) {
        const photos: string[] = meta.photos;
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
      meta.excerpt = meta.subtitle;
      meta.description = meta.subtitle;
    } else if (meta.description && !meta.excerpt) {
      meta.subtitle = meta.description;
      meta.excerpt = meta.description;
    } else if (meta.excerpt && !meta.description) {
      meta.description = meta.excerpt;
      meta.subtitle = meta.excerpt;
    } else {
      const newExcerpt = `${meta.title} - ${options.config.title}`;
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
          meta.category.includes(options.config.default_category) &&
          meta.category.length > 1
        ) {
          meta.category = meta.category.filter(
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
    if (options.fix && meta.photos && meta.photos.length) {
      meta.photos = uniqueStringArray(meta.photos);
    }

    // @todo delete location
    if (
      Object.prototype.hasOwnProperty.call(meta, 'location') &&
      !meta.location
    ) {
      delete meta.location;
    }

    if (isFile || options.sourceFile) {
      const publicFile = isFile
        ? toUnix(normalize(originalFile))
        : toUnix(normalize(options.sourceFile));
      // @todo fix post_asset_folder
      if (options.fix) {
        if (meta.cover) {
          meta.cover = post_assets_fixer(target, options, meta.cover);
        }
        // fix thumbnail
        if (meta.thumbnail) {
          meta.thumbnail = post_assets_fixer(target, options, meta.thumbnail);
        }

        // add property photos by default
        if (!meta.photos) meta.photos = [];

        if (body && isFile) {
          // get all images from post body
          body = body.replace(/!\[.*\]\((.*)\)/gm, function (whole, m1) {
            const regex = /(?:".*")/;
            let replacementResult: string;
            let img: string;
            if (regex.test(m1)) {
              const repl = m1.replace(regex, '').trim();
              img = post_assets_fixer(target, options, repl);
              replacementResult = whole.replace(repl, img);
            }
            if (!replacementResult) {
              img = post_assets_fixer(target, options, m1);
              replacementResult = whole.replace(m1, img);
            }
            // push image to photos metadata
            meta.photos.push(img);
            return replacementResult;
          });
        }

        // fix photos
        if (meta.photos) {
          meta.photos = meta.photos
            .map((photo) => post_assets_fixer(target, options, photo))
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
          toUnix(normalize(publicFile)),
          [
            toUnix(normalize(process.cwd())),
            options.config.source_dir + '/_posts/',
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

    if ('generator' in options.config) {
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
      config: <any>HexoConfig
    };
    if ('permalink' in result.metadata === false)
      result.metadata.permalink = parsePermalink(result);

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
