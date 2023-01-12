import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { Express } from 'express-serve-static-core';
import http from 'http';
import nunjucks from 'nunjucks';
import * as apis from 'sbg-api';
import { sbgDebug } from 'sbg-utility/dist/utils/debug';
import path from 'upath';
import serverConfig from './config';
import setupNunjuckHelper from './helper/nunjucks';
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
  config: SBGServer['config'];
  constructor(options?: Partial<SBGServer['config']>) {
    // update config
    serverConfig.update(options || {});
    // get updated config
    this.config = serverConfig.get();
    // start api
    this.api = new apis.Application(this.config.root);
    // start express
    this.startExpress();
  }
  private startExpress() {
    // vars
    const isDev = new Error('').stack?.includes('server.runner');
    // init express
    this.server = express();
    // set views
    this.server.set('views', [path.join(__dirname, 'views')]);
    // init nunjuck environment
    this.env = nunjucks.configure(path.join(__dirname, 'views'), {
      noCache: isDev,
      autoescape: true,
      express: this.server,
      web: { useCache: isDev, async: true }
    });
    setupNunjuckHelper(this.env);
    // init default middleware
    this.server.use(express.json());
    this.server.use(cors());
    this.server.use(express.urlencoded({ extended: true }));
    this.server.use(cookieParser());
    // https://stackoverflow.com/questions/13442377/redirect-all-trailing-slashes-globally-in-express
    this.server.use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      //res.header('Access-Control-Allow-Credentials', true);

      // set no cache for local development from server.runner.ts
      if (isDev) {
        this.server.set('etag', false);
        res.set('Cache-Control', 'no-store');
      }

      if (req.path.substring(-1) === '/' && req.path.length > 1) {
        const query = req.url.slice(req.path.length);
        const safepath = req.path.slice(0, -1).replace(/\/+/g, '/');
        const location = safepath + query;
        res.setHeader('location', location);
        res.redirect(301, location);
      } else {
        next();
      }
    });
    // init default express static
    this.server.use(express.static(path.join(__dirname, 'public')));
    this.server.use(express.static(path.join(this.config.root, 'public')));
    this.server.use(express.static(path.join(this.config.root, 'node_modules')));
    this.server.use(express.static(path.join(__dirname,'/../node_modules')));
    // register router
    this.server.get('/', function (_, res) {
      const data = {
        message: 'Hello world!',
        layout: 'layout.njk',
        title: 'Nunjucks example'
      };

      res.render('index.njk', data);
    });
    const router = express.Router();
    router.use('/post', routePost(this.api));
    this.server.use(router);
    return this.server;
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
    const server = http.createServer(this.server);
    server.listen(this.config.port, () => {
      console.log('Listening on http://localhost:' + this.config.port);
    });
    process.on('SIGTERM', () => {
      sbgDebug()('SIGTERM signal received: closing HTTP server');
      server.close(() => {
        sbgDebug()('HTTP server closed');
      });
    });
  }
}
