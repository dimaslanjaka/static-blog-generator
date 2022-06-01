import { parsePost as moduleParsePost, postMap } from '../../../packages/hexo-post-parser/src';
import { DeepPartial } from './postMapper';
/**
 * Parse Markdown Post
 * @see {@link moduleParsePost}
 * @param path file path to read
 * @param content content to parse, skip reading `path` parameter when settled
 * @param options override {@link moduleParsePost} options
 * @returns
 */
declare const parsePost: (path: string, content?: string, options?: DeepPartial<Parameters<typeof moduleParsePost>[1]>) => Promise<postMap>;
export { buildPost, DeepPartial, ParseOptions, postMap, postMeta } from '../../../packages/hexo-post-parser/src';
export { parsePost };
export default parsePost;
