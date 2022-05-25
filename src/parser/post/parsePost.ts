import { Nullable } from 'safelinkify';
import { toUnix } from 'upath';
import {
  parsePost as moduleParsePost,
  postMap
} from '../../../packages/hexo-post-parser/src';
import { replacePath } from '../../gulp/utils';
import { pcache } from '../../node/cache';
import CachePost from '../../node/cache-post';
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
  const cacheKey =
    typeof path == 'string' ? toUnix(path).replace(cwd(), '') : null;
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

  if (
    parse.metadata.type === 'post' &&
    path.includes(config.source_dir + '/_posts')
  ) {
    cachePost.set(path, parse);
  }

  parseCache.putSync(cacheKey, parse);

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
