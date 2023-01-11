import cookieParser from 'cookie-parser';
import express from 'express';
import { Express } from 'express-serve-static-core';
import nunjucks from 'nunjucks';
import * as apis from 'sbg-api';
import path from 'upath';
import serverConfig from './config';
import routePost from './post';

export default interface SBGServer {
  config: {
    root: string;
    port: number;
  };
}

export default class SBGServer {
  server: Express;
  env: nunjucks.Environment;
  api: apis.Application;
  constructor(options?: Partial<SBGServer['config']>) {
    // init express
    this.server = express();
    // update config
    serverConfig.update(options || {});
    // get updated config
    const config = serverConfig.get();
    // start api
    this.api = new apis.Application(config.root);
    // init nunjuck environment
    this.env = nunjucks.configure(path.join(__dirname, 'views'), {
      noCache: true,
      autoescape: true,
      express: this.server,
      web: { useCache: true, async: true }
    });
    // init default express static
    this.server.use(express.json());
    this.server.use(express.urlencoded({ extended: false }));
    this.server.use(cookieParser());
    this.server.use(express.static(path.join(__dirname, 'public')));
    this.server.use(express.static(path.join(config.root, 'public')));
    this.server.use(express.static(path.join(config.root, 'node_modules')));
    // register router
    this.server.use('/post', () => routePost(this.api));
  }
  /**
   * get the configured server
   * @returns express server instance
   */
  get = () => this.server;
  /**
   * start server
   */
  start() {
    this.server.listen(this.config.port, function () {
      console.log('http://localhost:' + this.config.port);
    });
  }
}
