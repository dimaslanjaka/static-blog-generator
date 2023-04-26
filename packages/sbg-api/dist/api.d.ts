import Bluebird from 'bluebird';
import { Nullable } from 'hexo-post-parser';
import { ProjConf, getConfig, setConfig } from 'sbg-utility';
import { deployCopy } from './deploy/copy';
declare class SBG {
    cwd: string;
    config: ProjConf;
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
     * @param customPath run seo fixer on spesific folder
     * @returns
     */
    seo(customPath?: string | null | undefined): Bluebird<unknown>;
    /**
     * Copy all **src-post** to **source/_posts** (run before generate)
     * * see the method {@link pcopy.copyAllPosts}
     * @returns
     */
    copy(): Promise<void>;
    /**
     * Anonymize external links on public dir (_config_yml.public_dir) (run after generated)
     * @param customPath run anonymizer external links on spesific folder
     * @returns
     */
    safelink(customPath?: string | null | undefined): Bluebird<unknown>;
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
    deploy: {
        superThis: SBG;
        copy: typeof deployCopy;
    };
}
export default SBG;
export { SBG };
