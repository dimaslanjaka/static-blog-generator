import express from 'express';
import nunjucks from 'nunjucks';
import * as apis from 'sbg-api';
export interface SBGServer {
    config: {
        root: string;
        port: number;
    };
}
export declare class SBGServer {
    server: ReturnType<typeof express>;
    env: nunjucks.Environment;
    api: apis.Application;
    config: SBGServer['config'];
    constructor(options?: Partial<SBGServer['config']>);
    startExpress(): import("express-serve-static-core").Express;
    /**
     * get the configured server
     * @returns express server instance
     */
    get: () => import("express-serve-static-core").Express;
    /**
     * start server
     */
    start(): void;
}
export default SBGServer;
