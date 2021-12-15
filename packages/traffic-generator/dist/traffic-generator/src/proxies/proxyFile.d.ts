/// <reference types="node" />
import { PathLike } from "fs";
import "../../../hexo-seo/packages/js-prototypes/src/globals";
export default class proxyFile {
    list: string[];
    file: string;
    constructor(filepath?: string | PathLike);
    /**
     * load from text
     * @param str
     * @returns
     */
    static fromText(str: string): proxyFile;
    /**
     * Parse string from text
     * @param str
     * @returns
     */
    static parseProxyFromText(str: string): string[];
    /**
     * get random proxy
     * @returns IP:PORT
     */
    random(): string;
    /**
     * Delete proxy
     * @param proxy
     */
    delete(proxy: string): void;
}
//# sourceMappingURL=proxyFile.d.ts.map