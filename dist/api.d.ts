/// <reference types="node" />
declare class SBG {
    cwd: string;
    config: import("./gulp.config").ProjConf;
    /**
     * Static blog generator
     * @param cwd base folder
     */
    constructor(cwd?: null | string);
    standalone: () => NodeJS.ReadWriteStream;
    /**
     * Auto seo on public dir (_config_yml.public_dir) (run after generated)
     * @returns
     */
    seo: () => NodeJS.ReadWriteStream;
    /**
     * Copy all **src-post** to **source/_posts** (run before generate)
     * * see the method {@link copyAllPosts}
     * @returns
     */
    copy: () => Promise<unknown>;
    /**
     * Anonymize external links on public dir (_config_yml.public_dir) (run after generated)
     * @returns
     */
    safelink: () => Promise<unknown>;
    /**
     * generate site with hexo
     */
    generate(): Promise<void>;
    deploy(): Promise<void>;
    /**
     * clean cache, auto generated posts, etc
     * @see {@link cleanDb}
     * @see {@link cleanOldArchives}
     */
    clean(opt?: 'all'): Promise<void>;
}
export default SBG;
