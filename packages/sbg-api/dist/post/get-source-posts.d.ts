import * as hexoPostParser from 'hexo-post-parser';
export interface ResultSourcePosts extends hexoPostParser.postMap {
    full_source: string;
}
/**
 * get all source markdown posts (_configyml.post_dir)
 * @returns
 */
export declare function getSourcePosts(config?: {
    cwd: string;
    post_dir: string;
    cacheDirectory?: string;
    cache?: boolean;
}): Promise<ResultSourcePosts[]>;
export default getSourcePosts;
