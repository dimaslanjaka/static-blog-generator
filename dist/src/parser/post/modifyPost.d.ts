import { postMap } from './parsePost';
import { archiveMap, DeepPartial } from './postMapper';
export declare type mergedTypes = Partial<postMap> & Partial<archiveMap> & Record<string, unknown>;
export interface modifyPostType extends mergedTypes {
    [key: string]: any;
}
/**
 * Modify Post With Defined Conditions
 * @param data result of {@link parsePost}
 * @returns
 */
export declare function modifyPost<T = any>(data: T, merge: boolean): T;
export declare function modifyPost<T extends DeepPartial<modifyPostType>>(data: T, merge: true): T['metadata'] & T;
export declare function modifyPost<T extends DeepPartial<modifyPostType>>(data: T): T;
export default modifyPost;
