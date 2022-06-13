import { parsePost as moduleParsePost, postMap } from 'hexo-post-parser';
import { DeepPartial } from './postMapper';
/**
 * Parse Markdown Post
 * @see {@link moduleParsePost}
 * @param path file path to read
 * @param content content to parse, skip reading `path` parameter when settled
 * @param options override {@link moduleParsePost} options
 * @returns
 */
declare const parsePost: (path: string, content?: string | null | undefined, options?: DeepPartial<Parameters<typeof moduleParsePost>[1]>) => Promise<postMap>;
export { buildPost, DeepPartial, ParseOptions, postMap, postMeta } from 'hexo-post-parser';
export { parsePost };
export default parsePost;
