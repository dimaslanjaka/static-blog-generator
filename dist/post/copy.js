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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processSinglePost = exports.pipeProcessPost = exports.copyAllPosts = exports.copySinglePost = void 0;
var ansi_colors_1 = __importDefault(require("ansi-colors"));
var fs_1 = __importDefault(require("fs"));
var gulp_1 = __importDefault(require("gulp"));
var through2_1 = __importDefault(require("through2"));
var hexoPostParser = __importStar(require("hexo-post-parser"));
var __1 = require("..");
var debug_1 = __importDefault(require("../utils/debug"));
var upath_1 = require("upath");
var logger_1 = __importDefault(require("../utils/logger"));
var _config_1 = require("../_config");
var permalink_1 = require("./permalink");
var log = (0, debug_1.default)('post');
var logerr = log.extend('error');
var logLabel = log.extend('label');
function copySinglePost(identifier, callback) {
    identifier = identifier.replace((0, upath_1.extname)(identifier), '');
    var config = (0, _config_1.getConfig)();
    var sourcePostDir = (0, upath_1.join)(process.cwd(), config.post_dir);
    var generatedPostDir = (0, upath_1.join)(process.cwd(), config.source_dir, '_posts');
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
function copyAllPosts() {
    var config = (0, _config_1.getConfig)();
    var excludes = config.exclude || [];
    var sourcePostDir = (0, upath_1.join)(process.cwd(), config.post_dir);
    var generatedPostDir = (0, upath_1.join)(process.cwd(), config.source_dir, '_posts');
    return (gulp_1.default
        .src(['**/*.*', '*.*', '**/*'], {
        cwd: (0, upath_1.toUnix)(sourcePostDir),
        ignore: excludes,
        dot: true,
        noext: true
    })
        .pipe((0, __1.gulpCached)({ name: 'post-copy' }))
        .pipe(pipeProcessPost(config))
        .pipe(gulp_1.default.dest(generatedPostDir)));
}
exports.copyAllPosts = copyAllPosts;
function pipeProcessPost(config) {
    var logname = 'post:' + ansi_colors_1.default.blueBright('processing');
    if (config.generator.verbose) {
        logger_1.default.log(logname, 'cache=' + (config.generator.cache ? ansi_colors_1.default.green('true') : ansi_colors_1.default.red('false')));
    }
    return through2_1.default.obj(function (file, _enc, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var compile;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (file.isDirectory()) {
                            return [2, callback()];
                        }
                        if (file.isNull()) {
                            logerr(file.path + ' is null');
                            return [2, callback()];
                        }
                        if (file.isStream()) {
                            logerr(file.path + ' is stream');
                            return [2, callback()];
                        }
                        if (!config) return [3, 4];
                        if (!(file.extname === '.md')) return [3, 2];
                        return [4, processSinglePost(file.path)];
                    case 1:
                        compile = _a.sent();
                        if (typeof compile === 'string') {
                            file.contents = Buffer.from(compile);
                            this.push(file);
                            callback();
                        }
                        else {
                            callback();
                        }
                        return [3, 3];
                    case 2:
                        this.push(file);
                        callback();
                        _a.label = 3;
                    case 3: return [3, 5];
                    case 4:
                        logger_1.default.log('options not configured');
                        callback();
                        _a.label = 5;
                    case 5: return [2];
                }
            });
        });
    });
}
exports.pipeProcessPost = pipeProcessPost;
function processSinglePost(file) {
    var _a, _b, _c, _d, _e;
    return __awaiter(this, void 0, void 0, function () {
        var contents, config, dfile, parse, array, i, groupLabel, _loop_1, oldLabel, _loop_2, oldLabel, build, e_1;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    contents = fs_1.default.readFileSync(file, 'utf-8');
                    config = (0, _config_1.getConfig)();
                    dfile = ansi_colors_1.default.yellowBright((0, upath_1.toUnix)(file.replace(process.cwd(), '')));
                    log('processing', dfile);
                    if (contents.trim().length === 0) {
                        logerr('content empty', dfile);
                        return [2];
                    }
                    _f.label = 1;
                case 1:
                    _f.trys.push([1, 3, , 4]);
                    return [4, hexoPostParser
                            .parsePost(fs_1.default.readFileSync(file, 'utf-8'), {
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
                            formatDate: true,
                            fix: true,
                            sourceFile: file
                        })
                            .catch(function (e) { return logger_1.default.log(e); })];
                case 2:
                    parse = _f.sent();
                    if (parse && parse.metadata) {
                        log.extend('permalink').extend('pattern')(config.permalink);
                        if (!parse.metadata.permalink) {
                            parse.metadata.permalink = (0, permalink_1.parsePermalink)(file, {
                                title: parse.metadata.title,
                                date: String(parse.metadata.date || new Date()),
                                permalink_pattern: (0, _config_1.getConfig)().permalink
                            });
                        }
                        if ((_a = parse.metadata.permalink) === null || _a === void 0 ? void 0 : _a.startsWith('/')) {
                            parse.metadata.permalink = parse.metadata.permalink.replace(/^\//, '');
                        }
                        log.extend('permalink')(parse.metadata.permalink);
                        if (parse.metadata.uuid) {
                            if (!parse.metadata.id)
                                parse.metadata.id = parse.metadata.uuid;
                            delete parse.metadata.uuid;
                        }
                        array = ['tags', 'categories'];
                        for (i = 0; i < array.length; i++) {
                            groupLabel = array[i];
                            if (parse.metadata[groupLabel]) {
                                if ((_b = config[groupLabel]) === null || _b === void 0 ? void 0 : _b.assign) {
                                    _loop_1 = function (oldLabel) {
                                        var index = parse.metadata[groupLabel].findIndex(function (str) { return str == oldLabel; });
                                        if (index !== -1) {
                                            logLabel(groupLabel, parse.metadata[groupLabel], ansi_colors_1.default.yellowBright('+'), config[groupLabel].assign[oldLabel]);
                                            parse.metadata[groupLabel] = parse.metadata[groupLabel].concat(config[groupLabel].assign[oldLabel]);
                                            logLabel.extend('result')(groupLabel, parse.metadata[groupLabel]);
                                        }
                                    };
                                    for (oldLabel in config[groupLabel].assign) {
                                        _loop_1(oldLabel);
                                    }
                                }
                                if ((_c = config[groupLabel]) === null || _c === void 0 ? void 0 : _c.mapper) {
                                    _loop_2 = function (oldLabel) {
                                        var index = parse.metadata[groupLabel].findIndex(function (str) { return str === oldLabel; });
                                        if (index !== -1) {
                                            parse.metadata[groupLabel][index] = config[groupLabel].mapper[oldLabel];
                                            if (config.generator.verbose) {
                                                logger_1.default.log(ansi_colors_1.default.redBright(parse.metadata[groupLabel][index]), '~>', ansi_colors_1.default.greenBright(config[groupLabel].mapper[oldLabel]));
                                            }
                                        }
                                    };
                                    for (oldLabel in config[groupLabel].mapper) {
                                        _loop_2(oldLabel);
                                    }
                                }
                                if ((_d = config.tags) === null || _d === void 0 ? void 0 : _d.lowercase) {
                                    parse.metadata[groupLabel] =
                                        ((_e = parse.metadata[groupLabel]) === null || _e === void 0 ? void 0 : _e.map(function (str) { return str.toLowerCase(); })) || [];
                                    log.extend('label').extend('lowercase')(groupLabel, parse.metadata[groupLabel]);
                                }
                            }
                            else if (config.generator.verbose) {
                                logger_1.default.log(groupLabel, 'not found');
                            }
                        }
                        build = hexoPostParser.buildPost(parse);
                        if (typeof build === 'string') {
                            return [2, build];
                        }
                    }
                    else {
                        logerr(String(parse), file);
                    }
                    return [3, 4];
                case 3:
                    e_1 = _f.sent();
                    logger_1.default.log(e_1);
                    return [3, 4];
                case 4: return [2];
            }
        });
    });
}
exports.processSinglePost = processSinglePost;
gulp_1.default.task('post:copy', copyAllPosts);
