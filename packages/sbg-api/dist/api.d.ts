import { Nullable } from 'hexo-post-parser';
import { getConfig, setConfig } from 'sbg-utility';
declare class SBG {
    cwd: string;
    config: import("sbg-utility").ProjConf;
    setConfig: typeof setConfig;
    getConfig: typeof getConfig;
    /**
     * Static blog generator
     * @param cwd base folder
     */
    constructor(cwd: Nullable<string>, options?: Parameters<typeof setConfig>[0]);
    static currentApI: SBG;
    static setApi(api: SBG): void;
    static getApi(): SBG;
    /**
     * get index packages
     * @returns
     */
    core(): Promise<typeof import("./index")>;
    /**
     * run files ends with `standalone.js` inside source posts {@link standaloneRunner}
     * @returns
     */
    standalone: () => Promise<void>;
    /**
     * Auto seo on public dir (_config_yml.public_dir) (run after generated)
     * @returns
     */
    seo: () => NodeJS.ReadWriteStream;
    /**
     * Copy all **src-post** to **source/_posts** (run before generate)
     * * see the method {@link pcopy.copyAllPosts}
     * @returns
     */
    copy(): Promise<void>;
    /**
     * Anonymize external links on public dir (_config_yml.public_dir) (run after generated)
     * @returns
     */
    safelink: () => NodeJS.ReadWriteStream | import("fs").WriteStream;
    /**
     * generate site with hexo
     */
    generate(): Promise<void>;
    /**
     * clean cache, auto generated posts, etc
     * @see {@link cleaner.cleanDb}
     * @see {@link cleaner.cleanArchive}
     */
    clean(opt?: 'all' | 'archive' | 'database' | 'post'): Promise<void>;
}
export default SBG;
export { SBG };
