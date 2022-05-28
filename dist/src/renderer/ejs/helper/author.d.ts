import { postMap } from '../../../parser/post/parsePost';
import config from '../../../types/_config';
/**
 * get author name
 * @param page
 * @returns
 */
export declare function author_name(page: postMap['metadata'] | typeof config): any;
/**
 * get author email
 * @param page post metadata or config from _config.yml
 * @returns
 */
export declare function author_email(page: postMap['metadata'] | typeof config): any;
/**
 * transform author object
 * @param page
 * @returns
 */
export declare function author_object(page: postMap['metadata'] | typeof config): {
    name: string;
    email: string;
    link: string;
};
/**
 * get author link
 * @param page
 * @returns
 */
export declare function author_link(page: postMap['metadata'] | typeof config): any;
