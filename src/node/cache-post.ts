import modifyPost from '../parser/post/modifyPost';
import { postMap } from '../parser/post/parsePost';
import { mergedPostMap } from '../parser/post/postMapper';
import config from '../types/_config';
import { removeEmpties } from './array-utils';
import { defaultResovableValue, pcache } from './cache';
import { md5 } from './md5-file';
import memoizer from './memoize-fs';
import { isMatch } from './string-utils';

export type postResult = Partial<mergedPostMap>;

export class CachePost {
  constructor() {}
  set(key: string, value: any) {
    pcache('post').putSync(md5(key), value);
    return this;
  }

  get<T>(key: string) {
    return pcache('post').getSync(md5(key)) as T;
  }

  getKeys() {
    return pcache('post').keysSync();
  }

  getAll() {
    const keys: string[] = pcache('post').keysSync();
    return keys
      .map((key) => {
        const get = pcache('post').getSync<postMap>(key);
        //console.log('get', typeof get);
        return get;
      })
      .filter(
        (post) => typeof post == 'object' && post !== null && post !== undefined
      );
  }

  /**
   * get total posts
   * @returns
   */
  getTotal() {
    return pcache('post').keysSync().length;
  }
}

/**
 * fix post
 * @param post
 * @returns
 */
function fixPost(post: Partial<postMap>) {
  if (
    typeof post.metadata == 'object' &&
    typeof post.metadata.url == 'string'
  ) {
    const url = new URL(post.metadata.url);
    if (isMatch(url.pathname, /.md$/)) {
      url.pathname = url.pathname.replace(/.md$/, '.html');
    }
    post.metadata.url = String(url);
  }
  return post;
}

/**
 * order array
 * @param array
 * @param by
 * @returns
 */
function order_by<T extends Partial<postMap>>(
  array: T[],
  by: 'updated' | 'date' | '-updated' | '-date' | string
) {
  if (Array.isArray(array)) {
    return array
      .filter((post) => post && typeof post.metadata == 'object')
      .sort((a, b) => {
        const modby = by.replace('-', '');
        /*try {

      } catch (error) {
        if (error instanceof Error) console.log('cache-post.ts#order_by', error.message);
      }*/
        const c = new Date(a.metadata[modby]);
        const d = new Date(b.metadata[modby]);
        if (by.startsWith('-')) {
          // descending
          if (c < d) return 1;
          if (c > d) return -1;
        } else {
          if (c > d) return 1;
          if (c < d) return -1;
        }
        return 0;
      });
  }
  return array;
}

/**
 * get latest posts
 * @param by order descending by `date` or default (`index_generator.order_by` in `_config.yml`)
 * @param max max result
 * @returns array of {@link postResult}
 */
export function getLatestPosts(
  by: 'date' | 'updated' | '-date' | '-updated' = '-updated',
  max = 5
): postResult[] {
  const posts: Partial<postMap>[] = getAllPosts();
  const reorderPosts = order_by(posts, by); //removeEmpties(order_by(posts, by));
  //console.log('getLatestPosts', reorderPosts.length);

  return (
    reorderPosts
      // dont index redirected post
      .filter((post) => !post.metadata.redirect)
      .splice(0, max)
      .map((post) => fixPost(post))
      .map((post) => {
        return Object.assign(post, post.metadata);
      })
  );
}

/**
 * get all posts
 * @returns array of posts {@link CacheFile.getValues}
 */
export function getAllPosts() {
  const postCache = new CachePost();
  if (postCache.getTotal() < 1) return [];
  return order_by(postCache.getAll(), config.index_generator.order_by)
    .filter((post: Partial<postMap>) => post && post.metadata.type == 'post')
    .map((post) => modifyPost(post))
    .map((post) => fixPost(post))
    .map((post: string | Partial<postMap>) => {
      if (typeof post == 'string') return JSON.parse(post);
      return post;
    });
}

/**
 * get total posts (no page)
 * @returns
 */
export function getTotalPosts() {
  return getAllPosts().length;
}

const randoms: { [key: string]: postResult[] } = {};

/**
 * get random posts
 * @param max max results
 * @param identifier cached result
 * @returns
 */
export function getRandomPosts(max = 5, identifier = 'default') {
  const result = randoms[identifier];
  if (Array.isArray(result) && result.length > 0) return result;

  defaultResovableValue.randomize = true;
  defaultResovableValue.max = max;
  const get: () => postResult[] = (() => {
    const fetchAll = () => {
      return removeEmpties(getAllPosts())
        .splice(0, max)
        .map((post) => fixPost(post))
        .map((post) => {
          return Object.assign(post, post.metadata);
        });
    };
    if (config.generator.cache) {
      return new memoizer().fn(() => {
        return fetchAll();
      });
    } else {
      return fetchAll;
    }
  })();
  randoms[identifier] = get();
  return randoms[identifier];
}

export const Post = CachePost;
