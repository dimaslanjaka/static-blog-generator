import { deepmerge } from 'deepmerge-ts';
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
import { DeepPartial } from './postMapper';

const parseCache = pcache('parsePost');
const cachePost = new CachePost();
const __g = (typeof window != 'undefined' ? window : global) /* node */ as any;

/**
 * Parse Markdown Post
 * @see {@link moduleParsePost}
 * @param path file path to read
 * @param content content to parse, skip reading `path` parameter when settled
 * @param options override {@link moduleParsePost} options
 * @returns
 */
const parsePost = async (
  path: string,
  content?: string,
  options: DeepPartial<Parameters<typeof moduleParsePost>[1]> = {}
): Promise<postMap> => {
  let cacheKey = md5(path);
  if (typeof path == 'string' && !/\n/.test(path)) {
    cacheKey = toUnix(path).replace(cwd(), '');
    if (cacheKey.endsWith('/')) cacheKey += 'index';
  }
  let useCache = config.generator.cache;
  if ('cache' in options) {
    // overriden cache when `cache` exist in options
    useCache = options.cache;
  }
  // @todo return from cache
  if (useCache && typeof cacheKey == 'string' && cacheKey.length > 0) {
    const get =
      parseCache.getSync<ReturnType<typeof moduleParsePost>>(cacheKey);
    if (get) return get;
  }
  let parse = await moduleParsePost(
    content || path,
    deepmerge(
      <Parameters<typeof moduleParsePost>[1]>{
        shortcodes: {
          youtube: true,
          css: true,
          include: true,
          link: true,
          now: true,
          script: true,
          text: true,
          codeblock: true
        },
        cache: config.generator.cache,
        config: <any>config,
        formatDate: true,
        fix: true,
        sourceFile: path
      },
      options
    )
  );

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
  const isPathPost = path.includes(config.source_dir + '/_posts'); // || path.includes('src-posts/');
  const isTypePost = parse.metadata.type === 'post';
  const cachedPosts = cachePost.getAll();
  // @todo indexing post
  if (isTypePost && isPathPost) {
    cachePost.set(path, parse);
  }

  // @todo caching this parsePost
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
