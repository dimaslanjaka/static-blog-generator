import { postMap } from '../../../parser/post/parsePost';
/**
 * Thumbnail Helper
 * @description Get the thumbnail url from a post
 * @param {object} post
 * @example
 *     <%- thumbnail(post) %>
 */
export declare function thumbnail(post: postMap['metadata']): string;
