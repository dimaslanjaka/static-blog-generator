/// <reference types="node" />
import { Curl, HeaderInfo } from 'node-libcurl';
interface CurlOpt {
    method: 'GET' | 'POST' | 'HEAD' | 'PATCH' | 'OPTION';
    callback: (status: number, data: string | Buffer, headers: Buffer | HeaderInfo[], curlInstance: Curl) => void;
}
declare class Translator {
    sl: string;
    tl: string;
    result: string | Buffer;
    debug: false;
    constructor(sourceLang?: string, toLang?: string);
    try1(url: string, callback?: (html: string) => any): this;
    try2(html: string, callback?: (html: string) => any): this;
    extractTranslated(html: string): any;
    private capture;
    /**
     * Curl Requester
     * @param url
     * @param responseCallback
     */
    request(url: string, responseCallback?: CurlOpt['callback'] | CurlOpt): this;
    toString(): string | Buffer;
}
export default Translator;
