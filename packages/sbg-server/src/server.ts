import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
// import findWorkspaceRoot from 'find-yarn-workspace-root';
import session from 'express-session';
import fs from 'fs-extra';
import http from 'http';
import nunjucks from 'nunjucks';
import * as apis from 'sbg-api';
import { debug } from 'sbg-utility';
import path from 'upath';
import serverConfig from './config';
import setupNunjuckHelper from './helper/nunjucks';
import { sessionFileStoreConfig } from './middleware/session-file-helpers';
import { sessionFileStore } from './middleware/session-file-store';
import routePost from './post';

const FileStore = sessionFileStore(session);
const fileStoreOptions: Partial<sessionFileStoreConfig> = {
  logFn: debug('sbg-server').extend('session')
};

export interface SBGServer {
  config: {
    root: string;
    port: number;
    cache: boolean;
  };
}

export class SBGServer {
  server: import('express').Express;
  env: nunjucks.Environment;
  api: apis.Application;
  config: SBGServer['config'];
  cache = true;
  constructor(options?: Partial<SBGServer['config']>) {
    // update config
    serverConfig.update(options || {});
    // use cache
    if (options.cache) this.cache = options.cache;
    // get updated config
    this.config = serverConfig.get();
    // start api
    this.api = new apis.Application(this.config.root);
  }

  startExpress() {
    const self = this;
    // init express
    this.server = express();
    debug('sbg-server').extend('views')(path.join(__dirname, 'views'));
    // set views
    this.server.set('views', [path.join(__dirname, 'views')]);
    // init nunjuck environment
    this.env = nunjucks.configure(path.join(__dirname, 'views'), {
      // make sure cache is false
      noCache: !this.cache,
      autoescape: true,
      express: this.server,
      web: {
        // make sure cache is true
        useCache: this.cache,
        async: true
      }
    });
    setupNunjuckHelper(this.env);
    // init default middleware
    fileStoreOptions.path = path.join(this.api.cwd, 'tmp/sbg-server/session');
    this.server.use(
      session({
        store: <any>new FileStore(<any>fileStoreOptions),
        secret: 'sbg-server-session',
        resave: true,
        saveUninitialized: true
      })
    );
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
      if (this.cache) {
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
    // const workspaceRoot = findWorkspaceRoot(process.cwd());
    const statics = [
      path.join(__dirname, 'public'),
      // path.join(__dirname, '/../node_modules'),
      // project node_modules
      path.join(this.config.root, 'node_modules'),
      // static generated site
      // path.join(this.config.root, this.api.config.public_dir),
      // static source post when not yet generated at source dir
      path.join(this.config.root, this.api.config.post_dir),
      // static source dir such as images etc
      path.join(this.config.root, this.api.config.source_dir)
      // path.join(__dirname, '/../../../node_modules'),
      // resolve workspace node_modules
      // path.join(workspaceRoot, 'node_modules')
    ]
      .filter(fs.existsSync)
      .map((p) => {
        return path.resolve(p);
      });
    /*.filter(function (elem, index, self) {
        return index === self.indexOf(elem);
      });*/

    for (let i = 0; i < statics.length; i++) {
      const p = statics[i];
      debug('sbg-server').extend('static')(p);
      this.server.use(express.static(p));
      this.server.use(this.api.config.root, express.static(p));
    }

    // register router
    // index page
    this.server.get('/', function (_, res) {
      res.render(
        'index.njk',
        self.renderData({ title: 'Static Blog Generator Manager' })
      );
    });
    const router = express.Router();
    debug('sbg-server').extend('middleware')('register /post');
    router.use('/post', routePost.bind(this)(this.api));
    this.server.use(router);
    return this.server;
  }

  renderData(assign: Record<string, any>) {
    const api = this.api;
    const self = this;
    return Object.assign(assign, {
      config: api.config,
      configserver: self.config
    });
  }

  /**
   * get the configured server
   * @returns express server instance
   */
  get = () => this.server;

  /**
   * start server
   */
  start(customServer?: express.Express) {
    debug('sbg-server').extend('cwd')(this.config.root);
    debug('sbg-server').extend('port')(this.config.port);
    const httpserver = http
      .createServer(customServer || this.startExpress())
      .listen(this.config.port);
    process.on('SIGTERM', () => {
      debug('sbg-server').extend('exit')(
        'SIGTERM signal received: closing HTTP server'
      );
      httpserver.close(() => {
        debug('sbg-server').extend('exit')('HTTP server closed');
      });
    });
    console.log('server listening at http://localhost:' + this.config.port);
    return httpserver;
  }

  start2() {
    debug('sbg-server').extend('cwd')(this.config.root);
    debug('sbg-server').extend('port')(this.config.port);
    const httpserver = http
      .createServer(this.startExpress())
      .listen(this.config.port);
    console.log('server listening at http://localhost:' + this.config.port);
    return httpserver;
  }

  __dump() {
    debug('sbg-server').extend('cwd')(this.config.root);
    debug('sbg-server').extend('port')(this.config.port);
    console.log(this.startExpress());
  }
}

export default SBGServer;
