/// <reference types="node" />
import { Nullable } from './globals';
import { getConfig, setConfig } from './gulp.config';
declare class SBG {
    cwd: string;
    config: import("./gulp.config").ProjConf;
    setConfig: typeof setConfig;
    getConfig: typeof getConfig;
    constructor(cwd: Nullable<string>);
    static currentApI: SBG;
    static setApi(api: SBG): void;
    static getApi(): SBG;
    standalone: () => NodeJS.ReadWriteStream;
    seo: () => NodeJS.ReadWriteStream;
    copy: () => Promise<any>;
    safelink: () => any;
    generate(): Promise<void>;
    deploy(): Promise<void>;
    clean(opt?: 'all' | 'archives' | 'database'): Promise<void>;
}
export default SBG;
