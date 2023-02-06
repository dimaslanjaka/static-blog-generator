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
        // start express
        this.startExpress();
    }
    SBGServer.prototype.startExpress = function () {
        var _this = this;
        var _a;
        // vars
        var isDev = (_a = new Error('').stack) === null || _a === void 0 ? void 0 : _a.includes('server.runner');
        (0, sbg_utility_1.debug)('sbg-server')('is-dev', isDev);
        var api = this.api;
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
        [
            upath_1.default.join(__dirname, 'public'),
            upath_1.default.join(__dirname, '/../node_modules'),
            upath_1.default.join(this.config.root, 'node_modules'),
            upath_1.default.join(this.config.root, this.api.config.public_dir),
            upath_1.default.join(this.config.root, this.api.config.post_dir),
            upath_1.default.join(this.config.root, this.api.config.source_dir),
            upath_1.default.join(__dirname, '/../../../node_modules')
        ]
            .filter(fs_extra_1.default.existsSync)
            .forEach(function (p) {
            console.log('init static', p);
            _this.server.use(express_1.default.static(p));
        });
        // register router
        // index page
        this.server.get('/', function (_, res) {
            var data = {
                title: 'Static Blog Generator Manager',
                config: api.config
            };
            res.render('index.njk', data);
        });
        this.server.get('/test', function (_, res) {
            var data = {
                title: 'Test'
            };
            res.render('test.html', data);
        });
        var router = express_1.default.Router();
        router.use('/post', (0, post_1.default)(this.api));
        this.server.use(router);
        return this.server;
    };
    /**
     * start server
     */
    SBGServer.prototype.start = function () {
        var _this = this;
        (0, sbg_utility_1.debug)('sbg-server')('cwd', this.config.root);
        (0, sbg_utility_1.debug)('sbg-server')('port', this.config.port);
        /*this.server.listen(this.config.port, () => {
          console.log('Listening on http://localhost:' + this.config.port);
        });*/
        var server = http_1.default.createServer(this.server);
        server.listen(this.config.port, function () {
            console.log('Listening on http://localhost:' + _this.config.port);
        });
        process.on('SIGTERM', function () {
            (0, sbg_utility_1.debug)('sbg-server')('SIGTERM signal received: closing HTTP server');
            server.close(function () {
                (0, sbg_utility_1.debug)('sbg-server')('HTTP server closed');
            });
        });
    };
    return SBGServer;
}());
exports.SBGServer = SBGServer;
exports.default = SBGServer;
//# sourceMappingURL=server.js.map