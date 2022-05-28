/* eslint-disable @typescript-eslint/no-unused-vars */
import moment from 'moment';
import { array_split_chunks } from '../../node/array-utils';
import { XArray } from '../../node/array-wrapper';
import { getAllPosts } from '../../node/cache-post';
import { excerpt } from '../../renderer/ejs/helper/excerpt';
import { thumbnail } from '../../renderer/ejs/helper/thumbnail';
import config from '../../types/_config';
import { postMap } from './parsePost';
import postChunksIterator from './postChunksIterator';

/**
 * Partializing properties
 * @see {@link https://stackoverflow.com/a/40076355/6404439}
 */
export type Partial<T> = {
  [P in keyof T]?: T[P];
};
/**
 * Partializing properties deeper
 * @see {@link https://stackoverflow.com/a/40076355/6404439}
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Record<string, unknown>
    ? DeepPartial<T[P]>
    : T[P];
};

/**
 * mapped type
 */
export type mergedPostMap = Partial<postMap> &
  DeepPartial<postMap['metadata']> &
  Record<string, unknown>;

export interface archiveMap extends mergedPostMap {
  [key: string]: any;
  /**
   * previous page items
   */
  prev?: mergedPostMap[] | null;
  /**
   * next page items
   */
  next?: mergedPostMap[] | null;
  /**
   * current page number
   */
  page_now?: number;
  /**
   * next page number
   */
  page_next?: number;
  /**
   * next page url (only visible on archive generator)
   */
  page_next_url?: string;
  /**
   * previous page url (only visible on archive generator)
   */
  page_prev_url?: string;
  /**
   * previous page number
   */
  page_prev?: number;
  /**
   * page total
   */
  total?: number;
  /**
   * all posts in this chunks
   */
  posts?: XArray<postMap>;
}

/**
 * Transform post object
 * * merge post metadata property ({@link postMap.metadata}) to root property
 * @returns
 */
export default function postMapper(post: postMap) {
  let assigned: postMap & postMap['metadata'] = post;
  if (typeof post == 'object' && typeof post.metadata == 'object') {
    post.metadata.date =
      typeof post.metadata.date == 'string'
        ? new dateMapper(post.metadata.date)
        : post.metadata.date;
    assigned = Object.assign(post, post.metadata);
  }
  return assigned;
}

/**
 * transform array into an mapped chunks
 * @param chunks
 * @returns
 */
export function postChunksMapper<T extends any[][]>(chunks: T): T {
  const defaultMap: archiveMap = {
    page_next: null,
    page_now: null,
    page_next_url: null,
    page_prev: null,
    page_prev_url: null
  };
  chunks.map((arr_chunk, i) => {
    if (Array.isArray(arr_chunk)) {
      const ret = arr_chunk.map((post: archiveMap) => {
        post.page_now = i;
        post.page_next = i + 1;
        post.page_prev = i - 1;
        if (post.page_prev === -1) post.page_prev = null;
        post.total = chunks.length;
        if (Array.isArray(chunks[post.page_prev])) {
          post.prev = chunks[post.page_prev];
        }
        if (Array.isArray(chunks[post.page_next])) {
          post.next = chunks[post.page_next];
        }
        return Object.assign(defaultMap, post);
      });
      return ret;
    }
    return arr_chunk;
  });
  return chunks;
}

export type DumperMerged = Partial<ReturnType<typeof postChunksIterator>> &
  Partial<mergedPostMap> &
  Partial<archiveMap> &
  Partial<mergedPostMap> &
  Partial<postMap> &
  Record<string, unknown>;

export interface DumperType extends DumperMerged {
  [key: string]: any;
  next: any;
  prev: any;
  posts: any[];
  content: string;
}

export function simplifyDump<T>(post: T, except?: string[] | string): T;
export function simplifyDump<T extends any[]>(
  post: T,
  except?: string[] | string
): T;
/**
 * simplified dump
 * @param post
 * @returns
 */
export function simplifyDump<T extends DumperType>(
  post: T,
  except: string[] | string = []
) {
  if (Array.isArray(post)) return post.map((o) => simplifyDump(o, except));
  if (typeof post == 'object' && post !== null) {
    if ('posts' in post) {
      const archivePosts = post['posts'] as postMap[];
      if (Array.isArray(archivePosts)) {
        post['posts'] = archivePosts.map((o) => simplifyDump(o, except));
      }
    }

    const keyToRemove = [
      'config',
      'body',
      'prev',
      'next',
      'content',
      'body',
      'sitedata',
      'author'
    ].filter(function (el) {
      if (Array.isArray(except)) {
        return except.indexOf(el) < 0;
      } else {
        return el === except;
      }
    });
    for (const key in post) {
      if (Object.prototype.hasOwnProperty.call(post, key)) {
        if (keyToRemove.includes(key)) {
          if (post[key]) post[key] = <any>`[${typeof post[key]}]`;
        }
      }
    }
    for (const key in post['metadata']) {
      if (Object.prototype.hasOwnProperty.call(post['metadata'], key)) {
        if (keyToRemove.includes(key)) {
          if (post['metadata'][key])
            post['metadata'][key] =
              '[' + <any>typeof post['metadata'][key] + ']';
        }
      }
    }
  }
  return post;
}

/**
 * split posts array to chunks
 * @param arr
 * @returns
 */
export function post_chunks<T extends any[]>(arr?: T) {
  const posts = (Array.isArray(arr) ? arr : getAllPosts())
    .filter((item) => {
      if (!item) return false;
      if (!item.metadata) return false;
      return true;
    })
    .map(postMapper);
  //console.log('post chunk total', posts.length);
  //.map((post) => Object.assign(post, post.metadata));
  /**
   * split posts to chunks divided by {@link config.index_generator.per_page}
   */
  const chunk = postChunksMapper(
    array_split_chunks(posts, config.index_generator.per_page)
  );

  const sitedata = posts.map((post) => {
    const data = {
      title: post.metadata.title,
      thumbnail: thumbnail(post.metadata),
      url: post.metadata.url,
      excerpt: excerpt(post.metadata)
    };
    return data;
  });
  return {
    /** all posts */
    posts,
    /** all posts chunks */
    chunk,
    /** all posts infinite scroll sitedata */
    sitedata
  };
}

/**
 * HexoJS date formatter
 * * Playground Test {@link https://codepen.io/dimaslanjaka/pen/LYegjaV}
 */
export class dateMapper {
  data: moment.Moment;
  constructor(date: moment.MomentInput) {
    if (typeof date == 'string') {
      this.data = moment(date);
    }
  }
  format = (pattern: string) => this.data.format(pattern);
  year = () => this.data.format('YYYY');
  toString = () => this.data.format('YYYY-MM-DDTHH:mm:ssZ');
}
