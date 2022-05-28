import { parse as parseHTML } from 'node-html-parser';
import { isValidHttpUrl } from '../../gulp/utils';
import { array_move } from '../../node/array-utils';
import { pcache } from '../../node/cache';
import { json_encode } from '../../node/JSON';
import { md5 } from '../../node/md5-file';
import { countWords } from '../../node/string-utils';
import config from '../../types/_config';
import { renderBodyMarkdown } from '../toHtml';
import { postMap } from './parsePost';
import { archiveMap, mergedPostMap } from './postMapper';

const useCache = config.generator.cache;
const modCache = pcache('modify');

/*interface GroupLabel {
  [key: string]: ReturnType<typeof parsePost>[];
}
const postCats: GroupLabel = {};
const postTags: GroupLabel = {};
const cacheTags = new CacheFile('postTags');
const cacheCats = new CacheFile('postCats');*/
const _g = (typeof window != 'undefined' ? window : global) /* node */ as any;

// export type modifyPostType = postMap | mergedPostMap | archiveMap;
export type mergedTypes = Partial<postMap> &
  Partial<mergedPostMap> &
  Partial<archiveMap> &
  Record<string, unknown>;

export interface modifyPostType extends mergedTypes {
  [key: string]: any;
}

/**
 * Modify Post With Defined Conditions
 * @param data result of {@link parsePost}
 * @returns
 */
export function modifyPost<T extends Partial<modifyPostType>>(
  data: T,
  merge: boolean
): T['metadata'] & T;
export function modifyPost<T extends Partial<modifyPostType>>(data: T): T;
export function modifyPost<T extends Partial<modifyPostType>>(
  data: T,
  merge = false
) {
  if (!data) return null;
  const cacheKey = md5(
    data.metadata.title +
      data.metadata.date +
      data.metadata.updated +
      data.metadata.type
  );
  /*if (parse.fileTree) {
    if (parse.fileTree.source) {
      cacheKey = md5(parse.fileTree.source);
    }
  }*/
  if (useCache) {
    const get = modCache.getSync<typeof data>(cacheKey);
    if (typeof get == 'string') return JSON.parse(get);
    if (get) return get;
  }
  // @todo setup empty tags and categories when not set
  if (!Array.isArray(data.metadata.category)) {
    data.metadata.category = [config.default_category].filter((s) => s);
  }
  if (!Array.isArray(data.metadata.tags)) {
    data.metadata.tags = [config.default_tag].filter((s) => s);
  }

  // @todo add tags from title
  if (config.title_map && typeof data.metadata.title == 'string') {
    const title = data.metadata.title.toLowerCase();
    for (const key in config.title_map) {
      if (Object.prototype.hasOwnProperty.call(config.title_map, key)) {
        const tag = config.title_map[key];
        const regexBoundary = new RegExp(`\\b${key}\\b`, 'gmi');

        if (title.match(regexBoundary)) {
          //console.log('found', regexBoundary, tag);
          data.metadata.tags.push(tag);
        }
      }
    }
  }

  // tag mapper
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

  // @todo grouping tag to category
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

  /*// @todo prepare to add post category to cache
  parse.metadata.category.forEach((name: string) => {
    if (!name) return;
    // init
    if (!postCats[name]) postCats[name] = [];
    // prevent duplicate push
    if (!postCats[name].find(({ title }) => title === parse.metadata.title))
      postCats[name].push(<any>parse);
  });

  // @todo prepare to add post tag to cache
  parse.metadata.tags.forEach((name: string) => {
    if (!name) return;
    let post = postTags[name];
    // init
    if (!post) post = [];
    // prevent duplicate push
    if (!postTags[name].find(({ title }) => title === parse.metadata.title))
      postTags[name].push(<any>parse);
  });*/

  // @todo set type post when not set
  if (!data.metadata.type) data.metadata.type = 'post';

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

  // move 'programming' to first index
  if (data.metadata.category.includes('Programming')) {
    data.metadata.category.forEach((str, i) => {
      if (str.toLowerCase().trim() === 'programming') {
        data.metadata.category = array_move(data.metadata.category, i, 0);
      }
    });
  }

  /*scheduler.add('add-labels', () => {
    Bluebird.all([postCats, postTags]).each((group, index) => {
      for (const name in group) {
        if (Object.prototype.hasOwnProperty.call(group, name)) {
          const posts = group[name];
          if (index === 1) {
            cacheTags.set(name, posts);
          } else {
            cacheCats.set(name, posts);
          }
        }
      }
    });
  });*/

  modCache.putSync(cacheKey, json_encode(data));

  if (data.metadata && merge) return Object.assign(data, data.metadata);
  return data;
}

export default modifyPost;
_g.modifyPost = modifyPost;
