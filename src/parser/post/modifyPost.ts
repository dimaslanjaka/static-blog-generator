import { parse as parseHTML } from 'node-html-parser';
import { isValidHttpUrl } from '../../gulp/utils';
import { array_move } from '../../node/array-utils';
import { pcache } from '../../node/cache';
import { json_encode } from '../../node/JSON';
import { md5 } from '../../node/md5-file';
import { countWords } from '../../node/string-utils';
import { modMoment } from '../../renderer/helpers/date';
import config from '../../types/_config';
import { renderBodyMarkdown } from '../toHtml';
import { postMap } from './parsePost';
import { archiveMap, DeepPartial } from './postMapper';

const modCache = pcache('modify');

/*interface GroupLabel {
  [key: string]: ReturnType<typeof parsePost>[];
}
const postCats: GroupLabel = {};
const postTags: GroupLabel = {};
const cacheTags = new CacheFile('postTags');
const cacheCats = new CacheFile('postCats');*/
const _g = (typeof window != 'undefined' ? window : global) /* node */ as any;

export type mergedTypes = Partial<postMap> &
  Partial<archiveMap> &
  Record<string, unknown>;

export interface modifyPostType extends mergedTypes {
  [key: string]: any;
}

interface modifyPostOptions {
  /**
   * merge metadata to post properties?
   */
  merge?: boolean;
  /**
   * use cache? default using config.generator.cache or arguments CLI
   */
  cache?: boolean;
}

/**
 * Modify Post With Defined Conditions
 * @param data result of {@link parsePost}
 * @returns
 */
export function modifyPost<T = any>(data: T, options?: modifyPostOptions): T;
export function modifyPost<T extends DeepPartial<modifyPostType>>(
  data: T,
  options: {
    merge: true;
  }
): T['metadata'] & T;
export function modifyPost<T extends DeepPartial<modifyPostType>>(data: T): T;
export function modifyPost<T extends DeepPartial<modifyPostType>>(
  data: T,
  options: modifyPostOptions = {
    merge: false,
    cache: config.generator.cache
  }
) {
  if (data === null || typeof data === 'undefined' || typeof data !== 'object')
    return null;
  if (Array.isArray(data)) throw new Error('Cannot use array on modifyPost');

  let title: string, date: string, updated: string, type: string;
  [data.metadata, data].forEach((meta) => {
    if (typeof meta === 'undefined' || meta === null) return;
    if ('type' in meta) type = meta.type;
    if ('title' in meta) title = meta.title;
    if ('date' in meta) date = String(meta.date);
    if ('updated' in meta) updated = String(meta.updated);
  });

  const useCache = options.cache;
  const cacheKey = md5(title + date + updated + type);

  if (useCache) {
    const get = modCache.getSync<typeof data>(cacheKey);
    if (typeof get == 'string') return JSON.parse(get);
    if (get) return get;
  }

  if ('metadata' in data) {
    // @declare merge metadata with default object
    data.metadata = Object.assign(
      {
        tags: [],
        category: [],
        title: '',
        description: '',
        date: modMoment(),
        updated: modMoment()
      },
      data.metadata
    );

    // @todo redirect -> redirect_to for jekyll plugin
    // https://github.com/jekyll/jekyll-redirect-from
    if ('redirect' in data.metadata) {
      const redirect = data.metadata.redirect;
      data.metadata.redirect_to = redirect;
    }

    // @todo setup empty categories when not set
    if ('category' in data.metadata) {
      if (!Array.isArray(data.metadata.category)) {
        data.metadata.category = [config.default_category].filter((s) => s);
      }
    }

    // @todo setup empty tags when not set
    if ('tags' in data.metadata) {
      if (!Array.isArray(data.metadata.tags)) {
        data.metadata.tags = [config.default_tag].filter((s) => s);
      }
    }

    // @declare tag mapper
    const postLowerTags = data.metadata.tags.map(
      (tag) => tag && tag.toLowerCase()
    );
    // @todo process config.tag_map (rename tag)
    if (typeof config.tag_map === 'object') {
      for (const key in config.tag_map) {
        if (Object.prototype.hasOwnProperty.call(config.tag_map, key)) {
          const renameTagTo = config.tag_map[key];
          const lowerkey = key.toLowerCase();
          const hasTag = postLowerTags.includes(lowerkey);
          if (hasTag) {
            const indexTag = postLowerTags.indexOf(lowerkey);
            //console.log('original tag', parse.metadata.tags[indexTag]);
            data.metadata.tags[indexTag] = renameTagTo;
            //console.log('renamed tag', renameTagTo);
          }
        }
      }
    }

    // @todo grouping tag to category (config.tag_group)
    if (typeof config.tag_group === 'object') {
      for (const key in config.tag_group) {
        if (Object.prototype.hasOwnProperty.call(config.tag_group, key)) {
          const group = config.tag_group[key];
          const lowerkey = key.toLowerCase();
          const hasTag = postLowerTags.includes(lowerkey);
          if (hasTag) {
            //const indexTag = postLowerTags.indexOf(lowerkey);
            //console.log('original tag', parse.metadata.tags[indexTag]);
            //console.log('grouped to', group);
            data.metadata.category.push(group);
          }
        }
      }
    }

    // @todo add tags from title
    if (config.title_map) {
      const titleLowercase = data.metadata.title.toLowerCase();
      for (const key in config.title_map) {
        if (Object.prototype.hasOwnProperty.call(config.title_map, key)) {
          const tag = config.title_map[key];
          const regexBoundary = new RegExp(`\\b${key}\\b`, 'gmi');

          if (titleLowercase.match(regexBoundary)) {
            //console.log('found', regexBoundary, tag);
            data.metadata.tags.push(tag);
          }
        }
      }
    }

    // @todo remove default tag when tags have more than 1 item
    if (
      config.default_tag &&
      data.metadata.tags.length > 1 &&
      data.metadata.tags.includes(config.default_tag)
    ) {
      data.metadata.tags = data.metadata.tags.filter(
        (tag) => tag !== config.default_tag
      );
    }

    // @todo remove default category when categories have more than 1 item
    if (
      config.default_category &&
      data.metadata.category.length > 1 &&
      data.metadata.category.includes(config.default_category)
    ) {
      data.metadata.category = data.metadata.category.filter(
        (category) => category !== config.default_category
      );
    }

    // @todo remove duplicate categories
    data.metadata.category = [...new Set(data.metadata.category)];
    // @todo remove duplicate tags
    data.metadata.tags = [...new Set(data.metadata.tags)];

    // @todo set type post when not set
    if (!data.metadata.type) data.metadata.type = 'post';
  }

  // move 'programming' to first index
  if (data.metadata.category.includes('Programming')) {
    data.metadata.category.forEach((str, i) => {
      if (str.toLowerCase().trim() === 'programming') {
        data.metadata.category = array_move(data.metadata.category, i, 0);
      }
    });
  }

  if ('body' in data || 'content' in data) {
    // render post for some properties
    let html: ReturnType<typeof parseHTML>;
    try {
      const renderbody = renderBodyMarkdown(<any>data);
      html = parseHTML(renderbody);
    } catch (error) {
      console.log('[fail]', 'renderBodyMarkdown', error);
      //console.log(...log);
      //console.log(typeof parse.body);
      return null;
    }

    // +article wordcount
    const words = html
      .querySelectorAll('*:not(script,style,meta,link)')
      .map((e) => e.text)
      .join('\n');
    data.metadata.wordcount = countWords(words);
    if (data.metadata.canonical) {
      const canonical: string = data.metadata.canonical;
      if (!isValidHttpUrl(canonical))
        data.metadata.canonical = config.url + data.metadata.canonical;
    }
  }

  modCache.putSync(cacheKey, json_encode(data));

  if (data.metadata && options.merge) return Object.assign(data, data.metadata);
  return data;
}

export default modifyPost;
_g.modifyPost = modifyPost;
