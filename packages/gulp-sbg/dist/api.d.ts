/// <reference types="node" />
import Bluebird from 'bluebird';
declare class SBG {
    base: string;
    /**
     * Static blog generator
     * @param base base folder
     */
    constructor(base?: null | string);
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
    copy: () => Bluebird<unknown>;
    /**
     * Anonymize external links on public dir (_config_yml.public_dir) (run after generated)
     * @returns
     */
    safelink: () => Promise<unknown>;
    /**
     * generate site with hexo
     */
    generate(): Promise<void>;
    /**
     * clean cache, auto generated posts, etc
     */
    clean: Promise<void>;
}
export default SBG;
