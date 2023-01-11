import cookieParser from 'cookie-parser';
import express from 'express';
import { Express } from 'express-serve-static-core';
import nunjucks from 'nunjucks';
import path from 'upath';
import serverConfig from './config';

export default interface SBGServer {
  config: {
    root: string;
  };
}

export default class SBGServer {
  server: Express;
  env: nunjucks.Environment;
  constructor(options?: SBGServer['config']) {
    this.server = express();
    const app = this.server;
    serverConfig.update(options || {});
    const config = serverConfig.get();
    this.env = nunjucks.configure(path.join(__dirname, 'views'), {
      noCache: true,
      autoescape: true,
      express: app,
      web: { useCache: true, async: true }
    });
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.static(path.join(config.root, 'public')));
    app.use(express.static(path.join(config.root, 'node_modules')));
  }
  get = () => this.server;
}
