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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyAllPosts = exports.updatePost = exports.copySinglePost = exports.watchPost = void 0;
var front_matter_1 = __importDefault(require("front-matter"));
var fs_1 = require("fs");
var gulp_1 = __importDefault(require("gulp"));
var hexo_post_parser_1 = require("hexo-post-parser");
var moment_timezone_1 = __importDefault(require("moment-timezone"));
var through2_1 = __importDefault(require("through2"));
var upath_1 = require("upath");
var gulp_cache_1 = require("./gulp-utils/gulp.cache");
var gulp_config_1 = require("./gulp.config");
var logger_1 = __importDefault(require("./utils/logger"));
var scheduler_1 = __importDefault(require("./utils/scheduler"));
var sourceDir = (0, upath_1.join)(process.cwd(), 'src-posts');
var destDir = (0, upath_1.join)(process.cwd(), 'source/_posts');
/**
 * Watch post while you writing new or modify posts from src-posts folder
 * @param done
 */
function watchPost(done) {
    var watcher = gulp_1.default.watch(['**/*'], { cwd: sourceDir });
    watcher.on('change', function (path) {
        (0, exports.copySinglePost)(path);
    });
    watcher.on('add', function (path) {
        (0, exports.copySinglePost)(path);
    });
    watcher.once('close', done);
}
exports.watchPost = watchPost;
/**
 * Copy single post from src-posts folder to source/_posts
 * @param identifier
 * @param callback
 */
var copySinglePost = function (identifier, callback) {
    identifier = identifier.replace((0, upath_1.extname)(identifier), '');
    ///const fileList = [];
    gulp_1.default
        .src(['**/*' + identifier + '*/*', '**/*' + identifier + '*'], {
        cwd: sourceDir
    })
        .pipe(updatePost())
        .pipe(gulp_1.default.dest(destDir))
        .on('end', function () {
        //Logger.log(fileList);
        if (typeof callback === 'function')
            callback();
    });
};
exports.copySinglePost = copySinglePost;
/**
 * copy watched post
 * @returns
 */
function updatePost() {
    return through2_1.default.obj(function (file, _enc, next) {
        return __awaiter(this, void 0, void 0, function () {
            var config, parse, oriUp_1, oriPath_1, post_1, rBuild_1, build;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ///fileList.push(file.path);
                        if (file.isNull())
                            return [2 /*return*/, next()];
                        if (!(file.extname === '.md')) return [3 /*break*/, 2];
                        config = (0, gulp_config_1.getConfig)();
                        return [4 /*yield*/, (0, hexo_post_parser_1.parsePost)(file.path, {
                                shortcodes: {
                                    youtube: true,
                                    css: true,
                                    include: true,
                                    link: true,
                                    now: true,
                                    script: true,
                                    text: true,
                                    codeblock: true
                                },
                                cache: false,
                                config: config,
                                formatDate: true,
                                fix: true,
                                sourceFile: file.path
                            })];
                    case 1:
                        parse = _a.sent();
                        if (parse && parse.metadata) {
                            oriUp_1 = parse.metadata.updated;
                            oriPath_1 = file.path;
                            parse.metadata.updated = (0, moment_timezone_1.default)()
                                .tz(config.timezone || 'UTC')
                                .format();
                            post_1 = (0, front_matter_1.default)(String(file.contents));
                            if ('updated' in post_1.attributes === false) {
                                post_1.attributes.updated = parse.metadata.updated;
                            }
                            post_1.attributes.updated = parse.metadata.updated;
                            post_1.attributes.date = parse.metadata.date;
                            if ('modified' in parse.metadata) {
                                post_1.attributes.modified = parse.metadata.modified;
                            }
                            rBuild_1 = {
                                metadata: post_1.attributes,
                                body: post_1.body,
                                content: post_1.body,
                                config: config
                            };
                            // update original source post after process ends
                            scheduler_1.default.add(oriPath_1, function () {
                                var rebuild = (0, hexo_post_parser_1.buildPost)(rBuild_1);
                                //writeFileSync(join(process.cwd(), 'tmp/rebuild.md'), rebuild);
                                logger_1.default.log('write to', (0, upath_1.toUnix)(oriPath_1).replace((0, upath_1.toUnix)(process.cwd()), ''), oriUp_1, '->', post_1.attributes.updated);
                                (0, fs_1.writeFileSync)(oriPath_1, rebuild); // write original post
                            });
                            build = (0, hexo_post_parser_1.buildPost)(parse);
                            file.contents = Buffer.from(build);
                            return [2 /*return*/, next(null, file)];
                        }
                        else {
                            logger_1.default.log('cannot parse', file.path);
                            return [2 /*return*/, next(null)];
                        }
                        _a.label = 2;
                    case 2:
                        // keep copy other files
                        next(null, file);
                        return [2 /*return*/];
                }
            });
        });
    });
}
exports.updatePost = updatePost;
/**
 * copy all posts from src-posts to source/_posts
 * @returns
 */
function copyAllPosts() {
    var _this = this;
    var config = (0, gulp_config_1.getConfig)();
    var excludes = Array.isArray(config.exclude) ? config.exclude : [];
    excludes.push.apply(excludes, __spreadArray([], __read(gulp_config_1.commonIgnore), false));
    logger_1.default.log('[copy] cwd', (0, upath_1.toUnix)(process.cwd()));
    logger_1.default.log('[copy] copying source posts from', sourceDir.replace((0, upath_1.toUnix)(process.cwd()), ''));
    return (gulp_1.default
        .src(['**/*', '**/*.*', '*.*'], { cwd: sourceDir, ignore: excludes })
        .pipe((0, gulp_cache_1.gulpCached)())
        //.pipe(gulpDebug())
        .pipe(through2_1.default.obj(function (file, _enc, callback) { return __awaiter(_this, void 0, void 0, function () {
        var config_1, contents, parse, build;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (file.isNull())
                        return [2 /*return*/, callback()];
                    if (!(file.extname === '.md')) return [3 /*break*/, 2];
                    config_1 = (0, gulp_config_1.getConfig)();
                    contents = ((_a = file.contents) === null || _a === void 0 ? void 0 : _a.toString()) || '';
                    // drop empty body
                    if (contents.trim().length === 0)
                        return [2 /*return*/, callback()];
                    return [4 /*yield*/, (0, hexo_post_parser_1.parsePost)(contents, {
                            shortcodes: {
                                youtube: true,
                                css: true,
                                include: true,
                                link: true,
                                now: true,
                                script: true,
                                text: true,
                                codeblock: true
                            },
                            cache: false,
                            config: config_1,
                            formatDate: true,
                            fix: true,
                            sourceFile: file.path
                        })];
                case 1:
                    parse = _b.sent();
                    if (parse && parse.metadata) {
                        build = (0, hexo_post_parser_1.buildPost)(parse);
                        file.contents = Buffer.from(build);
                        return [2 /*return*/, callback(null, file)];
                    }
                    else {
                        logger_1.default.log('cannot parse', (0, upath_1.toUnix)(file.path).replace((0, upath_1.toUnix)(process.cwd()), ''));
                    }
                    _b.label = 2;
                case 2:
                    callback(null, file);
                    return [2 /*return*/];
            }
        });
    }); }))
        .pipe(gulp_1.default.dest(destDir)));
}
exports.copyAllPosts = copyAllPosts;
gulp_1.default.task('post:copy', copyAllPosts);
gulp_1.default.task('copy-all-post', gulp_1.default.series('post:copy'));
gulp_1.default.task('copy-all-posts', gulp_1.default.series('post:copy'));
gulp_1.default.task('copy-posts', gulp_1.default.series('post:copy'));
gulp_1.default.task('copy-post', gulp_1.default.series('post:copy'));
gulp_1.default.task('watch-post', watchPost);
gulp_1.default.task('watch-posts', watchPost);
