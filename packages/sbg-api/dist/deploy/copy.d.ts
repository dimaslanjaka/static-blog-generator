/// <reference types="node" />
import { getConfig } from 'sbg-utility';
export interface deployCopyOptions {
    cwd: string;
    config: ReturnType<typeof getConfig>;
}
/**
 * copy generated site to deployment directory
 * @param opt
 * @param ignore
 */
export declare function deployCopy(opt: deployCopyOptions, ignore?: string | string[]): NodeJS.ReadWriteStream;
