import { deepmerge } from 'deepmerge-ts';
import { existsSync, readFileSync, statSync } from 'fs';
import { default as momentInstance } from 'moment-timezone';
import { dirname, join, toUnix } from 'upath';
import yaml from 'yaml';
import cache from '../packages/persistent-cache';
import { dateMapper } from './dateMapper';
import { isValidHttpUrl } from './gulp/utils';
import uniqueArray, { uniqueStringArray } from './node/array-unique';
import { md5FileSync } from './node/md5-file';
import { cleanString, cleanWhiteSpace, replaceArr } from './node/utils';
import uuidv4 from './node/uuid';
import { shortcodeCss } from './shortcodes/css';
import { extractText } from './shortcodes/extractText';
import { replaceMD2HTML } from './shortcodes/hyperlinks-md2html';
import { parseShortCodeInclude } from './shortcodes/include';
import { shortcodeScript } from './shortcodes/script';
import { shortcodeNow } from './shortcodes/time';
import { shortcodeYoutube } from './shortcodes/youtube';
import { DynamicObject } from './types';
import config from './types/_config';

/**
 * Localized Moment
 * @param date
 * @returns
 */
function moment(date: any = new Date()) {
  let parse = momentInstance(date);
  if (config.timezone) {
    parse = parse.tz(config.timezone);
  }
  return parse;
}

const _cache = cache({
  base: join(process.cwd(), 'tmp/persistent-cache'), //join(process.cwd(), 'node_modules/.cache/persistent'),
  name: 'parsePost',
  duration: 1000 * 3600 * 24 // 24 hours
});
const homepage = new URL(config.url);
const cwd = () => toUnix(process.cwd());
/**
 * Hexo Generated Dir
 */
const post_generated_dir = join(cwd(), config.public_dir);

/**
 * post metadata information (title, etc)
 */
export type postMeta = DynamicObject & {
  /**
   * Article language code
   */
  lang?: string;
  /**
   * Article title
   */
  title: string;
  subtitle: string;
  uuid?: string;
  updated?: string | dateMapper;
  author?: string | { [key: string]: any };
  date: string | dateMapper;
  description?: string;
  tags: string[];
  category: string[];
  photos?: string[];
  cover?: string;
  thumbnail?: string;
  /**
   * full url
   */
  url?: string;
  /**
   * just pathname
   */
  permalink?: string;
  /**
   * archive (index, tags, categories)
   */
  type?: 'post' | 'page' | 'archive';
};
export interface postMap extends Object {
  [key: string]: any;
  /**
   * Article metadata
   */
  metadataString?: string;
  fileTree?: {
    /**
     * [post source] post file from `src-posts/`
     */
    source?: string;
    /**
     * [public source] post file from source_dir _config.yml
     */
    public?: string;
  };
  /**
   * _config.yml
   */
  config?: DeepPartial<typeof config> | null;
  /**
   * Article metadata
   */
  metadata?: Partial<postMeta>;
  /**
   * Article body
   */
  body?: string;
}
export interface Config extends DeepPartial<typeof config> {
  [key: string]: any;
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
  config?: Config;
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
    now: false
  },
  sourceFile: null,
  formatDate: false,
  config,
  cache: false,
  fix: false
};

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

/**
 * Parse Hexo markdown post (structured with yaml and universal markdown blocks)
 * * return {@link postMap} metadata {string & object} and body
 * * return {@link null} == failed
 * @param text file path or string markdown contents
 */
export function parsePost(
  text: string,
  options: DeepPartial<ParseOptions> = {}
): Nullable<postMap> {
  options = deepmerge(default_options, options);
  const config = options.config;
  const cacheKey = md5FileSync(text);
  if (options.cache) {
    const getCache = _cache.getSync<postMap>(cacheKey);
    if (getCache) return getCache;
  }
  const regexPost = /^---([\s\S]*?)---[\n\s\S]\n([\n\s\S]*)/gm;
  //const regex = /^---([\s\S]*?)---[\n\s\S]\n/gim;
  //let m: RegExpExecArray | { [Symbol.replace](string: string, replaceValue: string): string }[];
  /**
   * source file if `text` is file
   */
  const originalArg = text;
  const isFile = existsSync(text) && statSync(text).isFile();
  if (isFile) {
    text = String(readFileSync(text, 'utf-8'));
  }

  const mapper = (m: RegExpMatchArray) => {
    let meta: postMap['metadata'] = yaml.parse(m[1]);
    let body = m[2];
    if (!body) body = 'no content ' + (meta.title || '');
    //write(tmp('parsePost', 'original.log'), body).then(console.log);
    if (!meta.uuid) {
      // assign uuid
      let uid = m[0];
      if (meta.title && meta.webtitle) {
        uid = meta.title + meta.webtitle;
      } else if (meta.subtitle) {
        uid = meta.subtitle;
      } else if (meta.excerpt) {
        uid = meta.excerpt;
      } else if (meta.title) {
        uid = meta.title;
      }
      meta.uuid = uuidv4(uid);
      meta = Object.keys(meta)
        .sort()
        .reduce(
          (acc, key) => ({
            ...acc,
            [key]: meta[key]
          }),
          {}
        ) as postMap['metadata'];
    }

    if (options.fix) {
      // @todo fix date
      if (!meta.date) {
        meta.date = moment(new Date()).format('YYYY-MM-DDTHH:mm:ssZ');
      }

      if (meta.modified && !meta.updated) {
        meta.updated = moment(meta.modified).format('YYYY-MM-DDTHH:mm:ssZ');
      }
      if (isFile) {
        const sourceFile = toUnix(originalArg);
        if (existsSync(sourceFile)) {
          const stats = statSync(sourceFile);
          if (!meta.updated) {
            const mtime = stats.mtime;
            meta.updated = moment(mtime).format('YYYY-MM-DDTHH:mm:ssZ');
          }
        }
      }

      // @todo fix lang
      if (!meta.lang) meta.lang = 'en';
    }

    // @todo set default category and tags
    if (!meta.category) meta.category = [];
    if (config.default_category && !meta.category.length)
      meta.category.push(config.default_category);
    if (!meta.tags) meta.tags = [];
    if (config.default_tag && !meta.tags.length)
      meta.tags.push(config.default_tag);

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
      const author = meta.author || config.author;
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
      const newExcerpt = `${meta.title} - ${config.title}`;
      meta.description = newExcerpt;
      meta.subtitle = newExcerpt;
      meta.excerpt = newExcerpt;
    }

    // @todo fix description
    if (options.fix) {
      // fix special char in metadata
      meta.title = cleanString(meta.title);
      meta.subtitle = cleanWhiteSpace(cleanString(meta.subtitle));
      meta.excerpt = cleanWhiteSpace(cleanString(meta.excerpt));
      meta.description = cleanWhiteSpace(cleanString(meta.description));
    }

    // @todo fix default category and tags
    if (options.fix) {
      // remove uncategorized if programming category pushed
      if (config.default_category)
        if (
          meta.category.includes(config.default_category) &&
          meta.category.length > 1
        ) {
          meta.category = meta.category.filter(
            (e) => e !== config.default_category
          );
        }
      // @todo remove untagged if programming category pushed
      if (config.default_tag)
        if (meta.tags.includes(config.default_tag) && meta.tags.length > 1) {
          meta.tags = meta.tags.filter((e) => e !== config.default_tag);
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
        ? toUnix(originalArg)
        : toUnix(options.sourceFile);
      // @todo fix post_asset_folder
      if (options.fix) {
        const post_assets_fixer = (str: string) => {
          if (!publicFile) return str;
          // return base64 image
          if (str.startsWith('data:image')) return str;
          if (str.startsWith('//')) str = 'http:' + str;
          if (str.includes('%20')) str = decodeURIComponent(str);
          if (!isValidHttpUrl(str) && !str.startsWith('/')) {
            let result: string;
            /** search from same directory */
            const f1 = join(dirname(publicFile), str);
            /** search from parent directory */
            const f2 = join(dirname(dirname(publicFile)), str);
            /** search from root directory */
            const f3 = join(cwd(), str);
            const f4 = join(post_generated_dir, str);
            [f1, f2, f3, f4].forEach((src) => {
              if (existsSync(src) && !result) result = src;
            });
            if (!result) {
              console.log('[PAF][fail]', str);
            } else {
              result = replaceArr(
                result,
                [cwd(), 'source/', '_posts'],
                '/'
              ).replace(/\/+/, '/');
              result = encodeURI(result);
              console.log('[PAF][success]', result);
              return result;
            }
          }
          return str;
        };
        if (meta.cover) {
          meta.cover = post_assets_fixer(meta.cover);
        }
        if (meta.thumbnail) {
          meta.thumbnail = post_assets_fixer(meta.thumbnail);
        }
        if (meta.photos) {
          meta.photos = meta.photos.map(post_assets_fixer);
        }
      }

      if (!meta.url) {
        homepage.pathname = replaceArr(
          publicFile,
          [
            toUnix(process.cwd()),
            config.source_dir + '/_posts/',
            'src-posts/',
            '_posts/'
          ],
          '/'
        )
          // @todo remove multiple slashes
          .replace(/\/+/, '/')
          // @todo replace .md to .html
          .replace(/.md$/, '.html');
        // meta url with full url
        meta.url = homepage.toString();
        // meta permalink just pathname
        meta.permalink = homepage.pathname;
      }

      // determine post type
      //meta.type = toUnix(originalArg).isMatch(/(_posts|src-posts)\//) ? 'post' : 'page';
      if (!meta.type) {
        if (publicFile.match(/(_posts|src-posts)\//)) {
          meta.type = 'post';
        } else {
          meta.type = 'page';
        }
      }
    }

    if (typeof options === 'object') {
      // @todo format dates
      if (options.formatDate) {
        const pattern =
          typeof options.formatDate === 'object' && options.formatDate.pattern
            ? options.formatDate.pattern
            : 'YYYY-MM-DDTHH:mm:ssZ';
        meta.date = new dateMapper(String(meta.date)).format(pattern);
        meta.updated = new dateMapper(String(meta.updated)).format(pattern);
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
          sourceFile = toUnix(originalArg);
        }

        if (body) {
          if (sourceFile) {
            if (shortcodes.include)
              body = parseShortCodeInclude(sourceFile, body);
            if (shortcodes.now) body = shortcodeNow(sourceFile, body);
            if (shortcodes.script) body = shortcodeScript(sourceFile, body);
            if (shortcodes.css) body = shortcodeCss(sourceFile, body);
            if (shortcodes.text) body = extractText(sourceFile, body);
          }
          if (shortcodes.link) body = replaceMD2HTML(body);
          if (shortcodes.youtube) body = shortcodeYoutube(body);
        }
      }
    }

    const result: postMap = {
      metadata: meta,
      body: body,
      content: body,
      config: config
    };

    // put fileTree
    if (isFile) {
      result.fileTree = {
        source: replaceArr(
          toUnix(originalArg),
          ['source/_posts/', '_posts/'],
          'src-posts/'
        ),
        public: toUnix(originalArg).replace('/src-posts/', '/source/_posts/')
      };
    }

    if (meta && body) _cache.putSync(cacheKey, result);

    return result;
  };

  // process parsing
  const testPost = Array.from(text.matchAll(regexPost)).map(mapper)[0];
  if (typeof testPost == 'object') return testPost;

  const regexPage = /^---([\s\S]*?)---[\n\s\S]([\n\s\S]*)/gm;
  const testPage = Array.from(text.matchAll(regexPage)).map(mapper)[0];
  return testPage;
}

export default parsePost;
