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
exports.copyAllPosts = exports.updatePost = exports.copySinglePost = void 0;
var ansi_colors_1 = __importDefault(require("ansi-colors"));
var front_matter_1 = __importDefault(require("front-matter"));
var fs_1 = require("fs");
var gulp_1 = __importDefault(require("gulp"));
var hexo_post_parser_1 = require("hexo-post-parser");
var moment_timezone_1 = __importDefault(require("moment-timezone"));
var through2_1 = __importDefault(require("through2"));
var upath_1 = require("upath");
var gulp_cache_1 = __importDefault(require("./gulp-utils/gulp.cache"));
var gulp_debug_1 = __importDefault(require("./gulp-utils/gulp.debug"));
var gulp_config_1 = require("./gulp.config");
var fm = __importStar(require("./utils/fm"));
var lockmanager_1 = __importDefault(require("./utils/lockmanager"));
var logger_1 = __importDefault(require("./utils/logger"));
var sourcePostDir = (0, upath_1.join)(process.cwd(), (0, gulp_config_1.getConfig)().post_dir);
var generatedPostDir = (0, upath_1.join)(process.cwd(), (0, gulp_config_1.getConfig)().source_dir, '_posts');
function copySinglePost(identifier, callback) {
    identifier = identifier.replace((0, upath_1.extname)(identifier), '');
    gulp_1.default
        .src(['**/*' + identifier + '*/*', '**/*' + identifier + '*'], {
        cwd: sourcePostDir
    })
        .pipe(gulp_1.default.dest(generatedPostDir))
        .on('end', function () {
        if (typeof callback === 'function')
            callback();
    });
}
exports.copySinglePost = copySinglePost;
function updatePost(postPath) {
    return __awaiter(this, void 0, void 0, function () {
        var config, parse, oriUp, oriPath, post, rBuild, rebuild, build;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    config = (0, gulp_config_1.getConfig)();
                    return [4, (0, hexo_post_parser_1.parsePost)(postPath, {
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
                            sourceFile: postPath
                        })];
                case 1:
                    parse = _a.sent();
                    if (parse && parse.metadata) {
                        oriUp = parse.metadata.updated;
                        oriPath = postPath;
                        parse.metadata.updated = (0, moment_timezone_1.default)()
                            .tz(config.timezone || 'UTC')
                            .format();
                        post = (0, front_matter_1.default)((0, fs_1.readFileSync)(postPath, 'utf-8'));
                        if ('updated' in post.attributes === false) {
                            post.attributes.updated = parse.metadata.updated;
                        }
                        post.attributes.updated = parse.metadata.updated;
                        post.attributes.date = parse.metadata.date;
                        if ('modified' in parse.metadata) {
                            post.attributes.modified = parse.metadata.modified;
                        }
                        rBuild = {
                            metadata: post.attributes,
                            body: post.body,
                            content: post.body,
                            config: config
                        };
                        rebuild = (0, hexo_post_parser_1.buildPost)(rBuild);
                        logger_1.default.log('write to', (0, upath_1.toUnix)(oriPath).replace((0, upath_1.toUnix)(process.cwd()), ''), oriUp, '->', post.attributes.updated);
                        fm.writefile(oriPath, rebuild);
                        build = (0, hexo_post_parser_1.buildPost)(parse);
                        fm.writefile(postPath, build);
                    }
                    else {
                        logger_1.default.log('cannot parse', postPath);
                    }
                    return [2];
            }
        });
    });
}
exports.updatePost = updatePost;
function copyAllPosts() {
    var _this = this;
    var lm = new lockmanager_1.default(copyAllPosts.name);
    var logname = 'post:' + ansi_colors_1.default.grey('copy');
    if (lm.exist()) {
        logger_1.default.log('another process still running');
        var writeStream = fm.createWriteStream((0, upath_1.join)(lm.folder, 'dummy.txt'), { flags: 'a' });
        writeStream.write(String(new Date()));
        writeStream.close();
        return writeStream;
    }
    lm.lock();
    var config = (0, gulp_config_1.getConfig)();
    var excludes = Array.isArray(config.exclude) ? config.exclude : [];
    excludes.push.apply(excludes, __spreadArray([], __read(gulp_config_1.commonIgnore), false));
    logger_1.default.log(logname, 'cwd', (0, upath_1.toUnix)(process.cwd()));
    logger_1.default.log(logname, 'copying source posts from', sourcePostDir);
    return gulp_1.default
        .src('**/*.*', { cwd: (0, upath_1.toUnix)(sourcePostDir), ignore: excludes })
        .pipe((0, gulp_cache_1.default)({ name: 'post' }))
        .pipe((0, gulp_debug_1.default)())
        .pipe(through2_1.default.obj(function (file, _enc, callback) { return __awaiter(_this, void 0, void 0, function () {
        var contents, parse, array, i, groupLabel, _loop_1, oldLabel, _loop_2, oldLabel, build;
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    if (file.isNull())
                        return [2, callback()];
                    if (!(file.extname === '.md')) return [3, 2];
                    contents = ((_a = file.contents) === null || _a === void 0 ? void 0 : _a.toString()) || '';
                    if (contents.trim().length === 0)
                        return [2, callback()];
                    return [4, (0, hexo_post_parser_1.parsePost)(contents, {
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
                    parse = _f.sent();
                    if (parse && parse.metadata) {
                        array = ['tags', 'categories'];
                        for (i = 0; i < array.length; i++) {
                            groupLabel = array[i];
                            if (parse.metadata[groupLabel]) {
                                if ((_b = config[groupLabel]) === null || _b === void 0 ? void 0 : _b.assign) {
                                    _loop_1 = function (oldLabel) {
                                        var index = parse.metadata[groupLabel].findIndex(function (str) { return str == oldLabel; });
                                        if (index !== -1) {
                                            parse.metadata[groupLabel] = config[groupLabel].assign[oldLabel];
                                        }
                                    };
                                    for (oldLabel in config[groupLabel].assign) {
                                        _loop_1(oldLabel);
                                    }
                                }
                                if ((_c = config[groupLabel]) === null || _c === void 0 ? void 0 : _c.mapper) {
                                    _loop_2 = function (oldLabel) {
                                        var index = parse.metadata[groupLabel].findIndex(function (str) { return str == oldLabel; });
                                        if (index !== -1) {
                                            parse.metadata[groupLabel][index] = config[groupLabel].mapper[oldLabel];
                                        }
                                    };
                                    for (oldLabel in config[groupLabel].mapper) {
                                        _loop_2(oldLabel);
                                    }
                                }
                                if ((_d = config.tags) === null || _d === void 0 ? void 0 : _d.lowercase) {
                                    parse.metadata.tags = ((_e = parse.metadata.tags) === null || _e === void 0 ? void 0 : _e.map(function (str) { return str.toLowerCase(); })) || [];
                                }
                            }
                        }
                        build = (0, hexo_post_parser_1.buildPost)(parse);
                        file.contents = Buffer.from(build);
                        return [2, callback(null, file)];
                    }
                    else {
                        logger_1.default.log(logname, 'cannot parse', (0, upath_1.toUnix)(file.path).replace((0, upath_1.toUnix)(process.cwd()), ''));
                    }
                    _f.label = 2;
                case 2:
                    callback(null, file);
                    return [2];
            }
        });
    }); }))
        .pipe(gulp_1.default.dest(generatedPostDir))
        .once('end', function () {
        lm.release();
    });
}
exports.copyAllPosts = copyAllPosts;
gulp_1.default.task('post:copy', copyAllPosts);
gulp_1.default.task('copy-all-post', gulp_1.default.series('post:copy'));
gulp_1.default.task('copy-all-posts', gulp_1.default.series('post:copy'));
gulp_1.default.task('copy-posts', gulp_1.default.series('post:copy'));
gulp_1.default.task('copy-post', gulp_1.default.series('post:copy'));
