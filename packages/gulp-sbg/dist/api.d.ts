/// <reference types="node" />
declare class SBG {
    base: string;
    /**
     * Static blog generator
     * @param base base folder
     */
    constructor(base?: null | string);
    /**
     * Auto seo on public dir (run after generated)
     * @returns
     */
    seo: () => NodeJS.ReadWriteStream;
    /**
     * Copy all **src-post** to **source/_posts**
     * * see the method {@link copyAllPosts}
     * @returns
     */
    copy: () => NodeJS.ReadWriteStream;
    /**
     * Anonymize external links
     * @returns
     */
    safelink: () => Promise<unknown>;
}
export default SBG;
