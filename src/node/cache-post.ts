import { mergedPostMap } from '../markdown/transformPosts/postMapper';
import CacheFile from './cache';

export type postResult = mergedPostMap;

export default class CachePost extends CacheFile {
  constructor() {
    super('posts');
  }
}

export const Post = CachePost;
