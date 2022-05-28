import './categories';
import './tags';
/**
 * generate index
 * * customized generation by param {@link labelname}
 * ```properties
 * "type number"  = generate specific archive page
 * "all"          = generate all homepage and archives
 * "homepage"     = generate only first index/homepage
 * "null"         = all
 * "default"      = all
 * ```
 * @param labelname
 * @example
 * generateIndex('homepage'); // only generate homepage
 * generateIndex(4); // only generate page 4
 */
export declare function generateIndex(labelname?: 'homepage' | number): Promise<string>;
