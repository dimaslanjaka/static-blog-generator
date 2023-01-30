import * as hexoPostParser from 'hexo-post-parser';
export interface ResultSourcePosts extends hexoPostParser.postMap {
    full_source: string;
}
export declare function getSourcePosts(): any;
export default getSourcePosts;
