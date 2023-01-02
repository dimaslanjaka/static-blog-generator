/// <reference types="node" />
import { getConfig, setConfig } from './gulp.config';
declare class SBG {
    cwd: string;
    config: import("./gulp.config").ProjConf;
    setConfig: typeof setConfig;
    getConfig: typeof getConfig;
    constructor(cwd?: null | string);
    standalone: () => NodeJS.ReadWriteStream;
    seo: () => NodeJS.ReadWriteStream;
    copy: () => Promise<unknown>;
    safelink: () => Promise<unknown>;
    generate(): Promise<void>;
    deploy(): Promise<void>;
    clean(opt?: 'all'): Promise<void>;
}
export default SBG;
