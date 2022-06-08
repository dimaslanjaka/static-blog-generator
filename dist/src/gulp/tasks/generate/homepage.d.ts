import { post_chunks } from '../../../parser/post/postMapper';
import { getChunkOf } from './getChunkOf';
/**
 * generate index
 * * customized generation by param {@link labelNameOrObj}
 * ```properties
 * "type number"  = generate specific archive page
 * "all"          = generate all homepage and archives
 * "homepage"     = generate only first index/homepage
 * "null"         = all
 * "default"      = all
 * ```
 * @param labelNameOrObj
 * @example
 * generateIndex('homepage'); // only generate homepage
 * generateIndex(4); // only generate page 4
 */
export declare function generateIndex(labelNameOrObj?: 'homepage' | number | string | any): any[];
export declare function generateSingleIndex(postsChunks: ReturnType<typeof getChunkOf> | ReturnType<typeof post_chunks>, labelNameOrObj?: string | number, meta?: Record<string, any>): Promise<string>;
