/// <reference types="node" />
/// <reference types="node" />
import { getConfig, setConfig } from './gulp.config';
declare class SBG {
    cwd: string;
    config: import("./gulp.config").ProjConf;
    setConfig: typeof setConfig;
    getConfig: typeof getConfig;
    constructor(cwd?: null | string);
    static currentApI: SBG;
    static setApi(api: SBG): void;
    static getApi(): SBG;
    standalone: () => NodeJS.ReadWriteStream;
    seo: () => NodeJS.ReadWriteStream;
    copy: () => Promise<import("fs").WriteStream | NodeJS.ReadWriteStream>;
    safelink: () => import("fs").WriteStream | NodeJS.ReadWriteStream;
    generate(): Promise<void>;
    deploy(): Promise<void>;
    clean(opt?: 'all'): Promise<void>;
}
export default SBG;
