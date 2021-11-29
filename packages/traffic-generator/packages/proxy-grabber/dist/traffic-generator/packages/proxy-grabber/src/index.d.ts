import { returnObj } from './spys';
import Promise from 'bluebird';
declare class proxyGrabber {
    method1(): Promise<returnObj[]>;
    method2(): Promise<returnObj[]>;
    method3(): Promise<returnObj[]>;
    /**
     * Get all grabbed proxies
     * @returns
     */
    get(): Promise<returnObj[]>;
    toString(): string;
}
export default proxyGrabber;
