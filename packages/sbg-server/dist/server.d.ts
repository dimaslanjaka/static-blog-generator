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
    server: import('express').Express;
    env: nunjucks.Environment;
    api: apis.Application;
    config: SBGServer['config'];
    constructor(options?: Partial<SBGServer['config']>);
    startExpress(): express.Express;
    /**
     * get the configured server
     * @returns express server instance
     */
    get: () => express.Express;
    /**
     * start server
     */
    start(): void;
    start2(): void;
    test(): void;
}
export default SBGServer;
