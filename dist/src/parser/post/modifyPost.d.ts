import { postMap } from './parsePost';
import { archiveMap, DeepPartial } from './postMapper';
export declare type mergedTypes = Partial<postMap> & Partial<archiveMap> & Record<string, unknown>;
export interface modifyPostType extends mergedTypes {
    [key: string]: any;
}
interface modifyPostOptions {
    /**
     * merge metadata to post properties?
     */
    merge?: boolean;
    /**
     * use cache? default using config.generator.cache or arguments CLI
     */
    cache?: boolean;
}
/**
 * Modify Post With Defined Conditions
 * @param data result of {@link parsePost}
 * @returns
 */
export declare function modifyPost<T = any>(data: T, options?: modifyPostOptions): T;
export declare function modifyPost<T extends DeepPartial<modifyPostType>>(data: T, options: {
    merge: true;
}): T['metadata'] & T;
export declare function modifyPost<T extends DeepPartial<modifyPostType>>(data: T): T;
export default modifyPost;
