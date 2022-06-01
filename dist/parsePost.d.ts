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
};
export interface postMap extends Object {
    [key: string]: any;
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
}
export interface Config extends DeepPartial<typeof config> {
    [key: string]: any;
}
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
        codeblock: boolean;
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
    config?: Config;
    /**
     * run auto fixer such as thumbnail, excerpt, etc
     */
    fix?: boolean;
}
/**
 * make all properties as optional recursively
 */
export declare type DeepPartial<T> = T extends object ? {
    [P in keyof T]?: DeepPartial<T[P]>;
} : T;
/**
 * null | type
 */
export declare type Nullable<T> = T | null | undefined;
/**
 * Parse Hexo markdown post (structured with yaml and universal markdown blocks)
 * * return {@link postMap} metadata {string & object} and body
 * * return {@link null} == failed
 * @param target file path or string markdown contents (used for cache key)
 * @param options options parser
 * * {@link ParseOptions.sourceFile} used for cache key when `target` is file contents
 */
export declare function parsePost(target: string, options?: DeepPartial<ParseOptions>): Promise<postMap>;
export default parsePost;
