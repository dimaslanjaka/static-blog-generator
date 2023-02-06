import { Express } from 'express-serve-static-core';
import nunjucks from 'nunjucks';
import * as apis from 'sbg-api';
export interface SBGServer {
    config: {
        root: string;
        port: number;
    };
}
export declare class SBGServer {
    server: Express;
    env: nunjucks.Environment;
    api: apis.Application;
    config: SBGServer['config'];
    constructor(options?: Partial<SBGServer['config']>);
    private startExpress;
    /**
     * get the configured server
     * @returns express server instance
     */
    get: () => Express;
    /**
     * start server
     */
    start(): void;
}
export default SBGServer;
