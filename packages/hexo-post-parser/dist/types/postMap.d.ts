import { postMeta } from './postMeta';
import { getConfig } from './_config';
export interface postMap extends Object {
    [key: string]: any;
    /**
     * Article metadata as string
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
    config?: ReturnType<typeof getConfig> | null;
    /**
     * Article metadata
     */
    metadata?: postMeta;
    /**
     * Article body
     */
    body?: string;
    /**
     * raw body (no shortcodes parsed)
     */
    rawbody: string;
    /**
     * Article body (unused when property `body` is settled)
     */
    content?: string;
}
