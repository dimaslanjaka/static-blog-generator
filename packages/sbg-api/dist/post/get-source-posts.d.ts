import Bluebird from 'bluebird';
import * as hexoPostParser from 'hexo-post-parser';
import { ProjConf } from 'sbg-utility';
export interface ResultSourcePosts extends hexoPostParser.postMap {
    full_source: string;
}
/**
 * get all source posts
 * @returns
 */
export declare function getSourcePosts(config?: ProjConf): Bluebird<ResultSourcePosts[]>;
export default getSourcePosts;
