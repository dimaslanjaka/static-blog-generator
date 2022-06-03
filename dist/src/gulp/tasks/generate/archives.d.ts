import { post_chunks } from '../../../parser/post/postMapper';
import { FunctionType } from '../../../parser/utility';
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
export declare function generateIndex(labelNameOrObj?: 'homepage' | number | ReturnType<typeof post_chunks> | FunctionType<ReturnType<typeof post_chunks>>): Promise<string>;
