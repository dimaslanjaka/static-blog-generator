import { existsSync, readFileSync, statSync } from 'fs';
import moment from 'moment';
import { toUnix } from 'upath';
import yaml from 'yaml';
import { dateMapper } from './dateMapper';
import { replaceArr } from './node/utils';
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

const homepage = new URL(config.url);

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
export type postMap = DynamicObject & {
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
};

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
  config?: DeepPartial<typeof config>;
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
  config
};

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

/**
 * Parse Hexo markdown post (structured with yaml and universal markdown blocks)
 * * return {@link postMap} metadata {string & object} and body
 * * return {@link null} == failed
 * * no cacheable
 * @param text file path or string markdown contents
 */
export function parsePost(text: string, options: DeepPartial<ParseOptions> = {}): postMap | null {
  options = Object.assign(default_options, options);
  const config = options.config;
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

    // @todo set default category and tags
    if ((!meta.category || !meta.category.length) && config.default_category) meta.category = [config.default_category];
    if ((!meta.tags || !meta.tags.length) && config.default_tag) meta.tags = [config.default_tag];

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

    // @todo set default enable comments
    if (typeof meta.comments == 'undefined' || meta.comments == null) meta.comments = true;
    // @todo set default wordcount to 0
    if (!meta.wordcount) meta.wordcount = 0;

    // @todo set default excerpt/description
    if (meta.subtitle) {
      meta.excerpt = meta.subtitle;
      meta.description = meta.subtitle;
    }
    if (meta.description && !meta.excerpt) {
      meta.subtitle = meta.description;
      meta.excerpt = meta.description;
    }
    if (meta.excerpt && !meta.description) {
      meta.description = meta.excerpt;
      meta.subtitle = meta.excerpt;
    }

    if (isFile) {
      // setup permalink
      /*
      meta.permalink = homepage.pathname;
      homepage.pathname = meta.permalink;
      meta.url = homepage.toString();*/

      if (!meta.url) {
        homepage.pathname = replaceArr(
          toUnix(originalArg),
          [toUnix(process.cwd()), 'source/_posts/', 'src-posts/', '_posts/'],
          '/'
        )
          .replace(/\/+/, '/')
          .replace(/.md$/, '.html');
        meta.url = homepage.pathname;
      }

      // determine post type
      //meta.type = toUnix(originalArg).isMatch(/(_posts|src-posts)\//) ? 'post' : 'page';
      if (!meta.type) {
        if (toUnix(originalArg).match(/(_posts|src-posts)\//)) {
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
          if (!options.sourceFile) throw new Error('Shortcodes cannot process if options.sourceFile does not exist');
          sourceFile = options.sourceFile;
        } else {
          sourceFile = toUnix(originalArg);
        }

        if (body && sourceFile) {
          if (shortcodes.include) body = parseShortCodeInclude(sourceFile, body);
          if (shortcodes.now) body = shortcodeNow(sourceFile, body);
          if (shortcodes.script) body = shortcodeScript(sourceFile, body);
          if (shortcodes.link) body = replaceMD2HTML(body);
          if (shortcodes.css) body = shortcodeCss(sourceFile, body);
          if (shortcodes.text) body = extractText(sourceFile, body);
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
        source: replaceArr(toUnix(originalArg), ['source/_posts/', '_posts/'], 'src-posts/'),
        public: toUnix(originalArg).replace('/src-posts/', '/source/_posts/')
      };
    }
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
