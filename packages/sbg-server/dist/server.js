"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SBGServer = void 0;
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var cors_1 = __importDefault(require("cors"));
var express_1 = __importDefault(require("express"));
var find_yarn_workspace_root_1 = __importDefault(require("find-yarn-workspace-root"));
var fs_extra_1 = __importDefault(require("fs-extra"));
var http_1 = __importDefault(require("http"));
var nunjucks_1 = __importDefault(require("nunjucks"));
var apis = __importStar(require("sbg-api"));
var sbg_utility_1 = require("sbg-utility");
var upath_1 = __importDefault(require("upath"));
var config_1 = __importDefault(require("./config"));
var nunjucks_2 = __importDefault(require("./helper/nunjucks"));
var post_1 = __importDefault(require("./post"));
var SBGServer = /** @class */ (function () {
    function SBGServer(options) {
        var _this = this;
        /**
         * get the configured server
         * @returns express server instance
         */
        this.get = function () { return _this.server; };
        // update config
        config_1.default.update(options || {});
        // get updated config
        this.config = config_1.default.get();
        // start api
        this.api = new apis.Application(this.config.root);
    }
    SBGServer.prototype.startExpress = function () {
        var _this = this;
        var _a;
        // vars
        var isDev = (_a = new Error('').stack) === null || _a === void 0 ? void 0 : _a.includes('server.runner');
        (0, sbg_utility_1.debug)('sbg-server')('is-dev', isDev);
        var self = this;
        // init express
        this.server = (0, express_1.default)();
        (0, sbg_utility_1.debug)('sbg-server').extend('views')(upath_1.default.join(__dirname, 'views'));
        // set views
        this.server.set('views', [upath_1.default.join(__dirname, 'views')]);
        // init nunjuck environment
        this.env = nunjucks_1.default.configure(upath_1.default.join(__dirname, 'views'), {
            noCache: isDev,
            autoescape: true,
            express: this.server,
            web: { useCache: isDev, async: true }
        });
        (0, nunjucks_2.default)(this.env);
        // init default middleware
        //debug('sbg-server').extend('middleware')('enabling cors');
        this.server.use((0, cors_1.default)());
        this.server.use(express_1.default.urlencoded({ extended: true, limit: '50mb' }));
        this.server.use(express_1.default.json({ limit: '50mb' }));
        this.server.use((0, cookie_parser_1.default)());
        //this.server.use(favicon(__dirname + '/public/images/nodejs.webp'));
        (0, sbg_utility_1.debug)('sbg-server').extend('middleware')('redirect all trailing slashes');
        // https://stackoverflow.com/questions/13442377/redirect-all-trailing-slashes-globally-in-express
        this.server.use(function (req, res, next) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            //res.header('Access-Control-Allow-Credentials', true);
            // set no cache for local development from server.runner.ts
            if (isDev) {
                _this.server.set('etag', false);
                res.set('Cache-Control', 'no-store');
            }
            if (req.path.substring(-1) === '/' && req.path.length > 1) {
                var query = req.url.slice(req.path.length);
                var safepath = req.path.slice(0, -1).replace(/\/+/g, '/');
                var location_1 = safepath + query;
                res.setHeader('location', location_1);
                res.redirect(301, location_1);
            }
            else {
                next();
            }
        });
        // init default express static
        var workspaceRoot = (0, find_yarn_workspace_root_1.default)(process.cwd());
        var statics = [
            upath_1.default.join(__dirname, 'public'),
            // path.join(__dirname, '/../node_modules'),
            // project node_modules
            upath_1.default.join(this.config.root, 'node_modules'),
            // static generated site
            // path.join(this.config.root, this.api.config.public_dir),
            // static source post when not yet generated at source dir
            upath_1.default.join(this.config.root, this.api.config.post_dir),
            // static source dir such as images etc
            upath_1.default.join(this.config.root, this.api.config.source_dir),
            // path.join(__dirname, '/../../../node_modules'),
            // resolve workspace node_modules
            upath_1.default.join(workspaceRoot, 'node_modules')
        ]
            .filter(fs_extra_1.default.existsSync)
            .map(function (p) {
            return upath_1.default.resolve(p);
        });
        /*.filter(function (elem, index, self) {
            return index === self.indexOf(elem);
          });*/
        for (var i = 0; i < statics.length; i++) {
            var p = statics[i];
            (0, sbg_utility_1.debug)('sbg-server').extend('static')(p);
            this.server.use(express_1.default.static(p));
            this.server.use(this.api.config.root, express_1.default.static(p));
        }
        // register router
        // index page
        this.server.get('/', function (_, res) {
            res.render('index.njk', self.renderData({ title: 'Static Blog Generator Manager' }));
        });
        var router = express_1.default.Router();
        (0, sbg_utility_1.debug)('sbg-server').extend('middleware')('register /post');
        router.use('/post', post_1.default.bind(this)(this.api));
        this.server.use(router);
        return this.server;
    };
    SBGServer.prototype.renderData = function (assign) {
        var api = this.api;
        var self = this;
        return Object.assign(assign, {
            config: api.config,
            configserver: self.config
        });
    };
    /**
     * start server
     */
    SBGServer.prototype.start = function () {
        (0, sbg_utility_1.debug)('sbg-server').extend('cwd')(this.config.root);
        (0, sbg_utility_1.debug)('sbg-server').extend('port')(this.config.port);
        var httpserver = http_1.default
            .createServer(this.startExpress())
            .listen(this.config.port);
        process.on('SIGTERM', function () {
            (0, sbg_utility_1.debug)('sbg-server').extend('exit')('SIGTERM signal received: closing HTTP server');
            httpserver.close(function () {
                (0, sbg_utility_1.debug)('sbg-server').extend('exit')('HTTP server closed');
            });
        });
        console.log('server listening at http://localhost:' + this.config.port);
        return httpserver;
    };
    SBGServer.prototype.start2 = function () {
        (0, sbg_utility_1.debug)('sbg-server').extend('cwd')(this.config.root);
        (0, sbg_utility_1.debug)('sbg-server').extend('port')(this.config.port);
        var httpserver = http_1.default
            .createServer(this.startExpress())
            .listen(this.config.port);
        console.log('server listening at http://localhost:' + this.config.port);
        return httpserver;
    };
    SBGServer.prototype.__dump = function () {
        (0, sbg_utility_1.debug)('sbg-server').extend('cwd')(this.config.root);
        (0, sbg_utility_1.debug)('sbg-server').extend('port')(this.config.port);
        console.log(this.startExpress());
    };
    return SBGServer;
}());
exports.SBGServer = SBGServer;
exports.default = SBGServer;
//# sourceMappingURL=server.js.map