import { getConfig } from './_config';
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
    config?: ReturnType<typeof getConfig> & Record<string, any>;
    /**
     * run auto fixer such as thumbnail, excerpt, etc
     */
    fix?: boolean;
}
