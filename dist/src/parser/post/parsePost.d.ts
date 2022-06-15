import { ParseOptions, postMap } from 'hexo-post-parser';
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
declare const parsePost: (path: string, content?: string | null | undefined, options?: SBGParsePostOptions) => Promise<postMap>;
export { buildPost, DeepPartial, ParseOptions, postMap, postMeta } from 'hexo-post-parser';
export { parsePost };
export default parsePost;
