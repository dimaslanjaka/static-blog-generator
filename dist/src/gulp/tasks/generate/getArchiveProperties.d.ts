import { archiveMap, post_chunks } from '../../../parser/post/postMapper';
/**
 * get homepage archive properties
 * @returns
 */
export declare function getArchiveProperties(allPostChunks: ReturnType<typeof post_chunks>): archiveMap[];
export declare function getCategoryProperties(): {
    [key: string]: {
        posts: any[];
        chunk: any[][];
        sitedata: {
            title: any;
            thumbnail: string;
            url: any;
            excerpt: string;
        }[];
    };
};
export declare function getHomepageProperties(): archiveMap[];
