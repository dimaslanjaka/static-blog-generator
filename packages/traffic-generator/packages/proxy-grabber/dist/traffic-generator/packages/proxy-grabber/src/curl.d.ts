import Promise from 'bluebird';
import { CurlyResult } from 'node-libcurl';
import { CurlyOptions } from 'node-libcurl/dist/curly';
export declare function get(url: string, options?: CurlyOptions): Promise<CurlyResult>;
export declare function testProxy(proxy: string, target?: string, options?: CurlyOptions): Promise<CurlyResult<any>>;
declare const _default: {
    testProxy: typeof testProxy;
    curlGET: typeof get;
};
export default _default;
