import { returnObj } from './spys';
import Promise from 'bluebird';
import '../../../../hexo-seo/packages/js-prototypes/src/Array';
declare class proxyGrabber {
    method1(): Promise<returnObj[]>;
    method2(): Promise<returnObj[]>;
    method3(): Promise<returnObj[]>;
    /**
     * Get all grabbed proxies
     * @returns
     */
    get(): Promise<returnObj[]>;
    /**
     * Test all proxies
     * @param limit limit proxies each instance to test (0=unlimited)
     */
    test(limit?: number): Promise<TestResult[][]>;
    toString(): string;
}
interface TestResult {
    error: boolean;
    proxy: returnObj;
    message?: string;
    code?: number;
}
export = proxyGrabber;
