/**
 * generate tags archive
 * @param labelname specific tag name
 */
export declare function getChunkOf(type: 'tag' | 'category', labelname?: string | null): {
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
