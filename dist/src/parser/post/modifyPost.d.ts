import { postMap } from './parsePost';
import { archiveMap, mergedPostMap } from './postMapper';
export declare type mergedTypes = Partial<postMap> & Partial<mergedPostMap> & Partial<archiveMap> & Record<string, unknown>;
export interface modifyPostType extends mergedTypes {
    [key: string]: any;
}
/**
 * Modify Post With Defined Conditions
 * @param data result of {@link parsePost}
 * @returns
 */
export declare function modifyPost<T extends Partial<modifyPostType>>(data: T, merge: boolean): T['metadata'] & T;
export declare function modifyPost<T extends Partial<modifyPostType>>(data: T): T;
export default modifyPost;
