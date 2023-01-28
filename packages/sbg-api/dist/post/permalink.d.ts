/**
 * transform permalink format in `_config.yml`
 * @param post post path
 */
export declare function parsePermalink(post: string, config: {
    [key: string]: any;
    /**
     * permalink pattern
     */
    permalink_pattern: string;
    /**
     * post created date
     */
    date: moment.MomentInput;
    /**
     * post title
     */
    title: string;
}): string;
