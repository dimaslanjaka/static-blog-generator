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
exports.processPost = exports.copyAllPosts = exports.copySinglePost = void 0;
var ansi_colors_1 = __importDefault(require("ansi-colors"));
var gulp_1 = __importDefault(require("gulp"));
var through2_1 = __importDefault(require("through2"));
var upath_1 = require("upath");
var __1 = require("..");
var gulp_cache_1 = __importDefault(require("../gulp-utils/gulp.cache"));
var gulp_debug_1 = __importDefault(require("../gulp-utils/gulp.debug"));
var gulp_config_1 = require("../gulp.config");
var fm = __importStar(require("../utils/fm"));
var lockmanager_1 = __importDefault(require("../utils/lockmanager"));
var logger_1 = __importDefault(require("../utils/logger"));
var src_1 = require("../../packages/hexo-post-parser/src");
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
function copyAllPosts(callback) {
    var _a, _b;
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
    var api = new __1.Application(process.cwd());
    var config = api.getConfig();
    var excludes = Array.isArray(config.exclude) ? config.exclude : [];
    excludes.push.apply(excludes, __spreadArray([], __read(gulp_config_1.commonIgnore), false));
    logger_1.default.log(logname, 'cwd', (0, upath_1.toUnix)(process.cwd()));
    logger_1.default.log(logname, 'copying source posts from', sourcePostDir);
    if (config.generator.verbose)
        logger_1.default.log(logname, { excludes: excludes });
    var streamer = gulp_1.default.src(['**/*.*', '*.*', '**/*'], {
        cwd: (0, upath_1.toUnix)(sourcePostDir),
        ignore: excludes,
        dot: true,
        noext: true
    });
    streamer.once('end', function () {
        lm.release();
    });
    if ((_a = config.generator) === null || _a === void 0 ? void 0 : _a.cache)
        streamer.pipe((0, gulp_cache_1.default)({ name: 'post-copy' }));
    var verbose = (_b = config.generator) === null || _b === void 0 ? void 0 : _b.verbose;
    if (verbose)
        streamer.pipe((0, gulp_debug_1.default)('post-copy'));
    streamer.pipe(processPost(config)).pipe(gulp_1.default.dest(generatedPostDir));
    return streamer.once('end', function () {
        typeof callback == 'function' && callback();
    });
}
exports.copyAllPosts = copyAllPosts;
function processPost(config) {
    var logname = processPost.name;
    if (config.generator.verbose) {
        logger_1.default.log('post:process', 'cache=' + (config.generator.cache ? ansi_colors_1.default.green('true') : ansi_colors_1.default.red('false')));
    }
    return through2_1.default.obj(function (file, _enc, callback) {
        var _a;
        if (file.isNull()) {
            if (config.generator.verbose)
                logger_1.default.log(file.path + ' is null');
            return callback();
        }
        if (file.isStream()) {
            if (config.generator.verbose)
                logger_1.default.log(file.path + ' is stream');
            return callback();
        }
        if (config) {
            if (file.extname === '.md') {
                logger_1.default.log('post:processing', ansi_colors_1.default.greenBright((0, upath_1.toUnix)(file.path.replace(process.cwd(), ''))));
                var contents = ((_a = file.contents) === null || _a === void 0 ? void 0 : _a.toString()) || '';
                if (contents.trim().length === 0) {
                    if (config.generator.verbose) {
                        logger_1.default.log('content empty', ansi_colors_1.default.redBright((0, upath_1.toUnix)(file.path.replace(process.cwd(), ''))));
                    }
                    return callback();
                }
                (0, src_1.parsePost)(file.path, {
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
                })
                    .then(function (parse) {
                    var _a, _b, _c, _d;
                    console.log(parse);
                    if (parse && parse.metadata) {
                        var array = ['tags', 'categories'];
                        for (var i = 0; i < array.length; i++) {
                            var groupLabel = array[i];
                            if (parse.metadata[groupLabel]) {
                                if ((_a = config[groupLabel]) === null || _a === void 0 ? void 0 : _a.assign) {
                                    var _loop_1 = function (oldLabel) {
                                        var index = parse.metadata[groupLabel].findIndex(function (str) { return str == oldLabel; });
                                        if (index !== -1) {
                                            parse.metadata[groupLabel] = config[groupLabel].assign[oldLabel];
                                        }
                                    };
                                    for (var oldLabel in config[groupLabel].assign) {
                                        _loop_1(oldLabel);
                                    }
                                }
                                if ((_b = config[groupLabel]) === null || _b === void 0 ? void 0 : _b.mapper) {
                                    var _loop_2 = function (oldLabel) {
                                        var index = parse.metadata[groupLabel].findIndex(function (str) { return str == oldLabel; });
                                        if (index !== -1) {
                                            parse.metadata[groupLabel][index] = config[groupLabel].mapper[oldLabel];
                                        }
                                    };
                                    for (var oldLabel in config[groupLabel].mapper) {
                                        _loop_2(oldLabel);
                                    }
                                }
                                if ((_c = config.tags) === null || _c === void 0 ? void 0 : _c.lowercase) {
                                    parse.metadata.tags = ((_d = parse.metadata.tags) === null || _d === void 0 ? void 0 : _d.map(function (str) { return str.toLowerCase(); })) || [];
                                }
                            }
                        }
                        logger_1.default.log(parse.metadata.permalink);
                        var build = (0, src_1.buildPost)(parse);
                        if (typeof build === 'string') {
                            file.contents = Buffer.from(build);
                            logger_1.default.log(logname, 'rebuild', (0, upath_1.toUnix)(file.path).replace((0, upath_1.toUnix)(process.cwd()), ''));
                            return callback(null, file);
                        }
                        else {
                            logger_1.default.log(logname, 'cannot rebuild', (0, upath_1.toUnix)(file.path).replace((0, upath_1.toUnix)(process.cwd()), ''));
                        }
                    }
                    else if (config.generator.verbose) {
                        logger_1.default.log(logname, 'cannot parse', (0, upath_1.toUnix)(file.path).replace((0, upath_1.toUnix)(process.cwd()), ''));
                    }
                })
                    .catch(callback)
                    .finally(callback);
            }
            else {
                callback(null, file);
            }
        }
        else {
            logger_1.default.log('options not configured');
            callback();
        }
    });
}
exports.processPost = processPost;
gulp_1.default.task('post:copy', copyAllPosts);
