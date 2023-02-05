import Bluebird from 'bluebird';
import * as hexoPostParser from 'hexo-post-parser';
export interface ResultSourcePosts extends hexoPostParser.postMap {
    full_source: string;
}
export declare function getSourcePosts(): Bluebird<ResultSourcePosts[]>;
export default getSourcePosts;
