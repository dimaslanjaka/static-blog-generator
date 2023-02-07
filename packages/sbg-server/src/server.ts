import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import fs from 'fs-extra';
import http from 'http';
import nunjucks from 'nunjucks';
import * as apis from 'sbg-api';
import { debug } from 'sbg-utility';
import path from 'upath';
import serverConfig from './config';
import setupNunjuckHelper from './helper/nunjucks';
import routePost from './post';

export interface SBGServer {
  config: {
    root: string;
    port: number;
  };
}

export class SBGServer {
  server: import('express').Express;
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
  }

  startExpress() {
    // vars
    const isDev = new Error('').stack?.includes('server.runner');
    debug('sbg-server')('is-dev', isDev);
    const api = this.api;
    // init express
    this.server = express();
    debug('sbg-server').extend('views')(path.join(__dirname, 'views'));
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
    //debug('sbg-server').extend('middleware')('enabling cors');
    this.server.use(cors());
    this.server.use(express.urlencoded({ extended: true, limit: '50mb' }));
    this.server.use(express.json({ limit: '50mb' }));
    this.server.use(cookieParser());
    //this.server.use(favicon(__dirname + '/public/images/nodejs.webp'));
    debug('sbg-server').extend('middleware')('redirect all trailing slashes');
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
    [
      path.join(__dirname, 'public'),
      path.join(__dirname, '/../node_modules'),
      path.join(this.config.root, 'node_modules'),
      path.join(this.config.root, this.api.config.public_dir),
      path.join(this.config.root, this.api.config.post_dir),
      path.join(this.config.root, this.api.config.source_dir),
      path.join(__dirname, '/../../../node_modules')
    ]
      .filter(fs.existsSync)
      .forEach((p) => {
        console.log('init static', p);
        this.server.use(express.static(p));
      });
    // register router
    // index page
    this.server.get('/', function (_, res) {
      const data = {
        title: 'Static Blog Generator Manager',
        config: api.config
      };

      res.render('index.njk', data);
    });
    const router = express.Router();
    debug('sbg-server').extend('middleware')('register /post');
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
    debug('sbg-server').extend('cwd')(this.config.root);
    debug('sbg-server').extend('port')(this.config.port);
    const server = http.createServer(this.startExpress());
    server.listen(this.config.port, function () {
      console.log('server running at http://localhost:' + this.config.port);
    });
    process.on('SIGTERM', () => {
      debug('sbg-server')('SIGTERM signal received: closing HTTP server');
      server.close(() => {
        debug('sbg-server')('HTTP server closed');
      });
    });
  }
}

export default SBGServer;
