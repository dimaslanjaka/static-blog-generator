import { dateMapper } from './dateMapper';
import { DynamicObject } from './types';
import config from './types/_config';
/**
 * post metadata information (title, etc)
 */
export declare type postMeta = DynamicObject & {
    /**
     * Article language code
     */
    lang?: string;
    /**
     * Article title
     */
    title: string;
    subtitle: string;
    uuid?: string;
    updated?: string | dateMapper;
    author?: string | {
        [key: string]: any;
    };
    date: string | dateMapper;
    description?: string;
    tags: string[];
    category: string[];
    photos?: string[];
    cover?: string;
    thumbnail?: string;
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
};
export declare type postMap = DynamicObject & {
    /**
     * Article metadata
     */
    metadataString?: string;
    fileTree?: {
        /**
         * [post source] post file from `src-posts/`
         */
        source?: string;
        /**
         * [public source] post file from source_dir _config.yml
         */
        public?: string;
    };
    /**
     * _config.yml
     */
    config?: DeepPartial<typeof config> | null;
    /**
     * Article metadata
     */
    metadata?: Partial<postMeta>;
    /**
     * Article body
     */
    body?: string;
};
export interface ParseOptions {
    shortcodes?: {
        /**
         * Transform shortcode `<!-- css path/to/file.css -->`
         */
        css: boolean;
        /**
         * Transform shortcode `<!-- script path/to/file.js -->`
         */
        script: boolean;
        /**
         * Transform shortcode `<!-- include path/to/file -->`
         */
        include: boolean;
        /**
         * Transform shortcode `{% youtube id 'type' %}` tag
         */
        youtube: boolean;
        /**
         * Transform hyperlinks ends with `path/to/file.md` with `path/to/file.html`
         */
        link: boolean;
        /**
         * Transform shortcode `<!-- extract-text path/to/file -->`
         * @see {@link extractText}
         */
        text: boolean;
        /**
         * Transform shortcode `<!-- now() -->`
         * @see {@link shortcodeNow}
         */
        now: boolean;
    };
    cache?: boolean;
    /**
     * Source File, keep empty when first parameter (text) is file
     */
    sourceFile?: null | string;
    /**
     * Format dates?
     */
    formatDate?: boolean | {
        pattern: string;
    };
    /**
     * Site Config
     */
    config?: DeepPartial<typeof config>;
    /**
     * run auto fixer such as thumbnail, excerpt, etc
     */
    fix?: boolean;
}
export declare type DeepPartial<T> = T extends object ? {
    [P in keyof T]?: DeepPartial<T[P]>;
} : T;
/**
 * Parse Hexo markdown post (structured with yaml and universal markdown blocks)
 * * return {@link postMap} metadata {string & object} and body
 * * return {@link null} == failed
 * @param text file path or string markdown contents
 */
export declare function parsePost(text: string, options?: DeepPartial<ParseOptions>): postMap | null;
export default parsePost;
