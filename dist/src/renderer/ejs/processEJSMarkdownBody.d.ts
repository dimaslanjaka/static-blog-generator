import { postMap } from '../../parser/post/parsePost';
/**
 * Process EJS shortcode in markdown body
 * @param sourcePost
 * @returns
 */
export declare function processEJSMarkdownBody(sourcePost: string | postMap): Promise<string>;
