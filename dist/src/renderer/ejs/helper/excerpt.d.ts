import { postMap } from '../../../parser/post/parsePost';
import { ProjectConfig } from '../../../types/_config';
/**
 * get excerpt of page
 * @param page page metadata object
 * @param length length of excerpt, default 200
 * @returns excerpt string
 * @example
 * // unescaped html
 * <%- excerpt(page) %>
 * // escaped html
 * <%= excerpt(page) %>
 */
export declare function excerpt(page: postMap['metadata'] | ProjectConfig, length?: number): string;
/**
 * nullable excerpt
 * @param page
 * @returns
 */
export declare function nExcerpt(page: postMap['metadata'] | ProjectConfig): string;
