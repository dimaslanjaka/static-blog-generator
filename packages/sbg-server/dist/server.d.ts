/// <reference types="node" />
import express from 'express';
import http from 'http';
import nunjucks from 'nunjucks';
import * as apis from 'sbg-api';
export interface SBGServer {
    config: {
        root: string;
        port: number;
        cache: boolean;
    };
}
export declare class SBGServer {
    server: import('express').Express;
    env: nunjucks.Environment;
    api: apis.Application;
    config: SBGServer['config'];
    cache: boolean;
    constructor(options?: Partial<SBGServer['config']>);
    startExpress(): express.Express;
    renderData(assign: Record<string, any>): Record<string, any> & {
        config: import("sbg-utility").ProjConf;
        configserver: {
            root: string;
            port: number;
            cache: boolean;
        };
    };
    /**
     * get the configured server
     * @returns express server instance
     */
    get: () => express.Express;
    /**
     * start server
     */
    start(): http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
    start2(): http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
    __dump(): void;
}
export default SBGServer;
