/// <reference types="node" />
declare class SBG {
    cwd: string;
    config: import("./gulp.config").ProjConf;
    constructor(cwd?: null | string);
    standalone: () => NodeJS.ReadWriteStream;
    seo: () => NodeJS.ReadWriteStream;
    copy: () => Promise<unknown>;
    safelink: () => Promise<unknown>;
    generate(): Promise<void>;
    deploy(): Promise<void>;
    clean(opt?: 'all'): Promise<undefined>;
}
export default SBG;
