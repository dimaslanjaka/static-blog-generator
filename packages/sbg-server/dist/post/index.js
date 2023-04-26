"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheRouterPost = void 0;
var debug_1 = __importDefault(require("debug"));
var express_1 = __importDefault(require("express"));
var hexo_post_parser_1 = require("hexo-post-parser");
var parseDateMapper_1 = require("hexo-post-parser/dist/parseDateMapper");
var sbg_api_1 = require("sbg-api");
var sbg_utility_1 = require("sbg-utility");
var serve_index_1 = __importDefault(require("serve-index"));
var upath_1 = __importDefault(require("upath"));
var yaml_1 = __importDefault(require("yaml"));
var log = (0, debug_1.default)('sbg').extend('server').extend('route').extend('post');
var router = express_1.default.Router();
exports.cacheRouterPost = new sbg_utility_1.persistentCache({
    base: upath_1.default.join(process.cwd(), 'tmp'),
    name: 'sbg-server/post',
    duration: 1000 * 60 * 60 * 24 // 1 day cache
});
function routePost(api) {
    var POST_ROOT = upath_1.default.join(api.cwd, api.config.post_dir);
    log('root<post>', POST_ROOT);
    var middleware = function (_req, _res, _next) {
        return __awaiter(this, void 0, void 0, function () {
            var isEmpty, posts;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _req.origin_post_data = exports.cacheRouterPost.getSync('origin_post_data', []);
                        _req.post_data = exports.cacheRouterPost.getSync('origin_post_data', []);
                        isEmpty = _req.origin_post_data.length === 0 && _req.post_data.length === 0;
                        if (!isEmpty) return [3 /*break*/, 2];
                        return [4 /*yield*/, (0, sbg_api_1.getSourcePosts)().catch(function (err) {
                                console.error(err);
                                return [];
                            })];
                    case 1:
                        posts = _a.sent();
                        // assign to response property
                        _req.origin_post_data = posts;
                        _req.post_data = posts.map(function (parsed) {
                            return Object.assign(parsed, parsed.metadata, { body: parsed.body });
                        });
                        exports.cacheRouterPost.setSync('post_data', _req.post_data);
                        exports.cacheRouterPost.setSync('origin_post_data', _req.origin_post_data);
                        _a.label = 2;
                    case 2:
                        _next(null);
                        return [2 /*return*/];
                }
            });
        });
    };
    // get checksum all posts
    router.all('/checksum', function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var hash, current;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, sbg_utility_1.folder_to_hash)('sha256', upath_1.default.join(api.cwd, api.config.post_dir), {
                            ignored: ['**/node_modules', '**/dist'],
                            pattern: '**/*.md',
                            encoding: 'base64'
                        })];
                    case 1:
                        hash = _a.sent();
                        current = exports.cacheRouterPost.getSync('checksum', {});
                        if (current !== hash) {
                            // req['session']['checksum'] = 'changed';
                            exports.cacheRouterPost.setSync('checksum', hash);
                        }
                        res.json(hash);
                        return [2 /*return*/];
                }
            });
        });
    });
    // list all posts
    router.get('/debug', express_1.default.static(POST_ROOT), (0, serve_index_1.default)(POST_ROOT, { icons: true }));
    router.get('/', middleware, function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                data = {
                    title: 'Post List',
                    section: 'Post',
                    // merge metadata
                    posts: req.post_data.map(function (item) {
                        item.relative_source = item.full_source.replace(api.config.cwd, '<root>');
                        if (!item.title)
                            item.title = "No Title - ".concat(item.id);
                        return item;
                    })
                };
                res.render('post/index.njk', data);
                return [2 /*return*/];
            });
        });
    });
    // get all posts json format
    router.get('/json', middleware, function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _data;
            return __generator(this, function (_a) {
                _data = {
                    posts: req.post_data.map(function (item) {
                        item.relative_source = item.full_source.replace(api.config.cwd, '<root>');
                        if (!item.title)
                            item.title = "No Title - ".concat(item.id);
                        return item;
                    })
                };
                console.log(_data);
                //res.json(_data);
                res.json({});
                return [2 /*return*/];
            });
        });
    });
    // edit post
    router.get('/edit/:id', middleware, function (req, res) {
        var postid = req.params['id'];
        var findPost = req.post_data.find(function (post) { var _a; return ((_a = post.metadata) === null || _a === void 0 ? void 0 : _a.id) === postid; }) ||
            new Error(postid + ' not found');
        // show errors
        if (findPost instanceof Error) {
            return res.json({
                error: true,
                message: findPost.message,
                stack: findPost.stack
            });
        }
        res.render('post/edit2.html', { post: findPost });
    });
    // post saver
    router.post('/save', middleware, function (req, res) {
        var _a;
        var data = req.body;
        var postid = data['id'];
        var findPost = req.origin_post_data.find(function (post) { var _a; return ((_a = post.metadata) === null || _a === void 0 ? void 0 : _a.id) === postid; }) ||
            new Error(postid + ' not found');
        // show errors
        if (findPost instanceof Error) {
            return res.json({
                error: true,
                message: findPost.message,
                stack: (_a = findPost.stack) === null || _a === void 0 ? void 0 : _a.split('\n')
            });
        }
        // assign new post body
        if (data.body)
            findPost.body = data.body;
        // assign new post metadata
        if (data.metadata)
            findPost.metadata = data.metadata;
        // update post.metadata.updated with timezone on config.timezone
        if (findPost.metadata) {
            findPost.metadata.updated = (0, parseDateMapper_1.moment)()
                .tz(api.config.timezone || 'UTC')
                .format();
        }
        // rebuild post to markdown
        var build = (0, hexo_post_parser_1.buildPost)(findPost);
        if (typeof build === 'string') {
            [
                upath_1.default.join(api.config.cwd, 'tmp/post-save', postid + '.md'),
                findPost.full_source
            ].forEach(function (f) { return (0, sbg_utility_1.writefile)(f, build); });
            res.json({ error: false, message: postid + ' saved successfully' });
        }
        else {
            res.json({ error: true, message: 'fail to build post ' + postid });
        }
    });
    // post metadata settings
    router.get('/settings/:id', middleware, function (req, res) {
        var postid = req.params['id'];
        var findPost = req.post_data.find(function (post) { var _a; return ((_a = post.metadata) === null || _a === void 0 ? void 0 : _a.id) === postid; }) ||
            new Error(postid + ' not found');
        if (findPost instanceof Error)
            return res.json(findPost);
        if (findPost.metadata) {
            if (findPost.metadata.description === findPost.metadata.excerpt) {
                delete findPost.metadata.excerpt;
            }
            if (findPost.metadata.description === findPost.metadata.subtitle) {
                delete findPost.metadata.subtitle;
            }
            if (findPost.metadata.thumbnail === findPost.metadata.cover) {
                delete findPost.metadata.cover;
            }
        }
        // clone meta for edit
        var meta = findPost.metadata;
        // remove meta id and wordcount
        meta === null || meta === void 0 ? true : delete meta.id;
        meta === null || meta === void 0 ? true : delete meta.wordcount;
        // render
        res.render('post/settings.njk', {
            post: findPost,
            metadata: yaml_1.default.stringify(meta),
            section: 'Post settings',
            title: 'Post settings'
        });
    });
    return router;
}
exports.default = routePost;
//# sourceMappingURL=index.js.map