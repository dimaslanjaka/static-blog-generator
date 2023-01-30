import { dateMapper } from '../dateMapper';
import { postAuthor } from '../types';
/**
 * post metadata information (title, etc)
 */
export interface postMeta {
    [key: string]: any;
    /**
     * Article language code
     */
    lang?: string;
    /**
     * Article title
     */
    title: string;
    /**
     * published indicator
     * * 1 / true = published
     * * 0 / false = drafted
     */
    published?: boolean | 1 | 0;
    /**
     * post description
     */
    description?: string;
    /**
     * word count
     */
    wordcount?: number;
    /**
     * Auto generated fixed id with uuid v4
     */
    id?: string;
    /**
     * Post modified date
     */
    updated?: string | dateMapper;
    /**
     * Author metadata
     */
    author?: string | postAuthor;
    /**
     * Post published date
     */
    date?: string | dateMapper;
    /**
     * Post tags
     */
    tags?: string[];
    /**
     * Post categories
     */
    categories?: string[];
    /**
     * All photos of post/page
     */
    photos?: string[];
    /**
     * thumbnail
     */
    cover?: string;
    /**
     * thumbnail (unused when `cover` property is settled)
     */
    thumbnail?: string;
    /**
     * Post moved indicator
     * * canonical should be replaced to this url
     * * indicate this post was moved to another url
     */
    redirect?: string;
    /**
     * full url
     */
    url?: string;
    /**
     * just pathname
     */
    permalink?: string;
    /**
     * archive (index, tags, categories)
     */
    type?: 'post' | 'page' | 'archive';
    /**
     * Custom layout (hexo)
     */
    layout?: string;
}
