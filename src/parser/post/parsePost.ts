import { Nullable } from 'safelinkify';
import { toUnix } from 'upath';
import {
  parsePost as moduleParsePost,
  postMap
} from '../../../packages/hexo-post-parser/src';
import { replacePath } from '../../gulp/utils';
import { pcache } from '../../node/cache';
import CachePost from '../../node/cache-post';
import { md5 } from '../../node/md5-file';
import config, { cwd } from '../../types/_config';
import modifyPost from './modifyPost';

const parseCache = pcache('parsePost');
const useCache = config.generator.cache;
const cachePost = new CachePost();
const __g = (typeof window != 'undefined' ? window : global) /* node */ as any;

/**
 * Parse Markdown Post
 * @see {@link moduleParsePost}
 * @param path
 * @returns
 */
const parsePost = (path: string, content?: string): Nullable<postMap> => {
  let cacheKey = md5(path);
  if (typeof path == 'string' && !/\n/.test(path)) {
    cacheKey = toUnix(path).replace(cwd(), '');
    if (cacheKey.endsWith('/')) cacheKey += 'index';
  }
  // @todo return from cache
  if (useCache && cacheKey) {
    const get =
      parseCache.getSync<ReturnType<typeof moduleParsePost>>(cacheKey);
    if (get) return get;
  }
  let parse = moduleParsePost(content || path, {
    shortcodes: {
      youtube: true,
      css: true,
      include: true,
      link: true,
      now: true,
      script: true,
      text: true
    },
    cache: config.generator.cache,
    config: <any>config,
    formatDate: true,
    fix: true,
    sourceFile: path
  });

  if (!parse) return null;

  /*if (!validateParsed(parse)) {
    console.log(color.redBright('[fail]'), 'at 1st parse');
    return null;
  }*/

  parse.fileTree = {
    source: replacePath(
      toUnix(path.toString()),
      '/source/_posts/',
      '/src-posts/'
    ),
    public: replacePath(
      toUnix(path.toString()),
      '/src-posts/',
      '/source/_posts/'
    )
  };

  parse = modifyPost(<any>parse);

  /**
   * validate if post path is post sources
   */
  const isPathPost =
    path.includes(config.source_dir + '/_posts') || path.includes('src-posts/');
  if (parse.metadata.type === 'post' && isPathPost) {
    cachePost.set(path, parse);
  }

  try {
    parseCache.putSync(cacheKey, parse);
  } catch (error) {
    if (error instanceof Error) {
      //console.log(error.message);
      console.log('cannot add cache key', cacheKey);
    }
  }

  return parse;
};

export {
  buildPost,
  DeepPartial,
  ParseOptions,
  postMap,
  postMeta
} from '../../../packages/hexo-post-parser/src';
export { parsePost };
export default parsePost;
__g.parsePost = parsePost;
