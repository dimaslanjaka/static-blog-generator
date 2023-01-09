/// <reference types="node" />
/// <reference types="node" />
import { Nullable } from './globals';
import { getConfig, setConfig } from './_config';
declare class SBG {
    cwd: string;
    config: import("./_config").ProjConf;
    setConfig: typeof setConfig;
    getConfig: typeof getConfig;
    constructor(cwd: Nullable<string>, options?: Parameters<typeof setConfig>[0]);
    static currentApI: SBG;
    static setApi(api: SBG): void;
    static getApi(): SBG;
    standalone: () => Promise<void>;
    seo: () => NodeJS.ReadWriteStream;
    copy: () => Promise<void>;
    safelink: () => import("fs").WriteStream | NodeJS.ReadWriteStream;
    generate(): Promise<void>;
    clean(opt?: 'all' | 'archive' | 'database' | 'post'): Promise<void>;
}
export default SBG;
