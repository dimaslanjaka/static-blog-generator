import { deepmerge } from 'deepmerge-ts';
import {
  ParseOptions,
  parsePost as moduleParsePost,
  postMap
} from 'hexo-post-parser';
import { basename, toUnix } from 'upath';
import { replacePath } from '../../gulp/utils';
import { CachePost } from '../../node/cache-post';
import { processEJSMarkdownBody } from '../../renderer/ejs/processEJSMarkdownBody';
import config from '../../types/_config';
import modifyPost from './modifyPost';

// file:../../../packages/hexo-post-parser/src

const cachePost = new CachePost();
const __g = (typeof window != 'undefined' ? window : global) /* node */ as any;

export interface SBGParsePostOptions extends ParseOptions {
  [key: string]: any;
}

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
  content: string | null | undefined = undefined,
  options: SBGParsePostOptions = {}
): Promise<postMap> => {
  // apply default options
  const default_options = {
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
    config: config,
    formatDate: true,
    fix: true,
    sourceFile: path
  };
  options = deepmerge(default_options, options||{});
  // cache definer setup
  if (!path && !options.sourceFile)
    throw new Error(
      "parameter 'path' is undefined, parameter 'options.sourceFile' also undefined. Please insert to 'options.sourceFile' when 'path' not defined (used for type validator and cache key)"
    );
  const realPath = path || options.sourceFile;

  /**
   * parsing with `hexo-post-parser`
   */
  let parse = await moduleParsePost(content || path, options);

  if (!parse) {
    throw new Error('cannot parse post ' + realPath);
  }

  if (typeof path === 'string' && path.length > 0) {
    // @todo replace no title post
    if (parse.metadata.title === '.md') {
      parse.metadata.title = basename(path, '.md');
    }
    // @todo add source metadata
    if (path.includes('src-posts')) {
      parse.metadata.source = path;
    }
    // @todo set flag published
    if ('published' in parse.metadata === false) {
      parse.metadata.published = true;
      if (/\/_drafts?\//.test(path)) {
        parse.metadata.published = false;
      }
    }
  }

  if (typeof path !== 'undefined' && path !== null) {
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
  }

  parse = modifyPost(parse);

  if (!parse) {
    throw new Error('cannot modify post ' + parse.metadata.title);
  }

  // parse EJS Shortcode in body
  if (parse.body) {
    parse.body = await processEJSMarkdownBody(Object.assign({}, parse));
    if (parse.content) parse.content = parse.body;
  } else if (parse.content) {
    parse.content = await processEJSMarkdownBody(Object.assign({}, parse));
    if (parse.body) parse.body = parse.content;
  }

  /**
   * validate if post path is post sources from config.source_dir
   */
  const isPathPost = realPath.includes(config.source_dir + '/_posts'); // || path.includes('src-posts/');
  const isTypePost = parse.metadata.type === 'post';
  //const cachedPosts = cachePost.getAll();
  // @todo indexing post
  if (isTypePost && isPathPost) {
    cachePost.set(path, parse);
  }

  return parse;
};

export {
  buildPost,
  DeepPartial,
  ParseOptions,
  postMap,
  postMeta
} from 'hexo-post-parser';
export { parsePost };
export default parsePost;
__g.parsePost = parsePost;
