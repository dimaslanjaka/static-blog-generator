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
exports.cleanOldArchives = exports.del = exports.cleanDb = void 0;
var ansi_colors_1 = __importDefault(require("ansi-colors"));
var bluebird_1 = __importDefault(require("bluebird"));
var fs_extra_1 = require("fs-extra");
var gulp_1 = __importDefault(require("gulp"));
var hexo_1 = __importDefault(require("hexo"));
var os_1 = require("os");
var upath_1 = require("upath");
var util_1 = require("util");
var gulp_config_1 = require("./gulp.config");
var fm_1 = require("./utils/fm");
var logger_1 = __importDefault(require("./utils/logger"));
var noop_1 = __importDefault(require("./utils/noop"));
function cleanDb() {
    return __awaiter(this, void 0, void 0, function () {
        var config, postDir, publicDir, tmpDir, _a, _b, _c, hexo;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    config = (0, gulp_config_1.getConfig)();
                    if (typeof config.source_dir !== 'string') {
                        (0, fm_1.writefile)((0, upath_1.join)(config.cwd, 'build/errors/clean.log'), (0, util_1.inspect)(config));
                        throw new Error('config.source_dir must be configured');
                    }
                    postDir = (0, upath_1.join)(config.cwd, config.source_dir, '_posts');
                    publicDir = (0, upath_1.join)(config.cwd, config.public_dir);
                    tmpDir = (0, upath_1.join)(config.cwd, 'build');
                    logger_1.default.log('[clean]', { tmpDir: tmpDir, postDir: postDir, publicDir: publicDir });
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 4, , 5]);
                    if (!(0, fs_extra_1.existsSync)(tmpDir)) return [3, 3];
                    return [4, del(tmpDir)];
                case 2:
                    _d.sent();
                    _d.label = 3;
                case 3: return [3, 5];
                case 4:
                    _a = _d.sent();
                    logger_1.default.log('[clean]', 'cannot delete', tmpDir);
                    return [3, 5];
                case 5:
                    _d.trys.push([5, 8, , 9]);
                    if (!(0, fs_extra_1.existsSync)(publicDir)) return [3, 7];
                    return [4, del(publicDir)];
                case 6:
                    _d.sent();
                    _d.label = 7;
                case 7: return [3, 9];
                case 8:
                    _b = _d.sent();
                    logger_1.default.log('[clean]', 'cannot delete', publicDir);
                    return [3, 9];
                case 9:
                    _d.trys.push([9, 12, , 13]);
                    if (!(0, fs_extra_1.existsSync)(postDir)) return [3, 11];
                    return [4, del(postDir)];
                case 10:
                    _d.sent();
                    _d.label = 11;
                case 11: return [3, 13];
                case 12:
                    _c = _d.sent();
                    logger_1.default.log('[clean]', 'cannot delete', postDir);
                    return [3, 13];
                case 13:
                    hexo = new hexo_1.default(config.base_dir);
                    return [4, hexo.init().catch(noop_1.default)];
                case 14:
                    _d.sent();
                    return [4, hexo.call('clean').catch(noop_1.default)];
                case 15:
                    _d.sent();
                    return [2, undefined];
            }
        });
    });
}
exports.cleanDb = cleanDb;
function del(path) {
    return new bluebird_1.default(function (resolve) {
        var rmOpt = { recursive: true, force: true };
        if ((0, fs_extra_1.existsSync)(path)) {
            (0, fs_extra_1.rm)(path, rmOpt).then(resolve).catch(resolve);
        }
        else {
            resolve(new Error(path + ' not found'));
        }
    });
}
exports.del = del;
gulp_1.default.task('clean', cleanDb);
function cleanOldArchives(done) {
    return __awaiter(this, void 0, void 0, function () {
        var config, logname, archives, categories, tags, folders, langDir, pagesDir, pages, promises, dumpfile, i, pathStr, finishNow;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    config = (0, gulp_config_1.getConfig)();
                    logname = 'clean:' + ansi_colors_1.default.grey('archives');
                    archives = (0, upath_1.join)(config.deploy.deployDir, config.archive_dir);
                    categories = (0, upath_1.join)(config.deploy.deployDir, config.category_dir);
                    tags = (0, upath_1.join)(config.deploy.deployDir, config.tag_dir);
                    folders = [archives, tags, categories].filter(function (str) { return (0, fs_extra_1.existsSync)(str); });
                    if (Array.isArray(config.language)) {
                        langDir = config.language.map(function (path) { return (0, upath_1.join)(config.deploy.deployDir, path); });
                        folders.push.apply(folders, __spreadArray([], __read(langDir), false));
                    }
                    else if (typeof config.language === 'string' && String(config.language).trim().length > 0) {
                        folders.push((0, upath_1.join)(config.deploy.deployDir, String(config.language)));
                    }
                    pagesDir = (0, upath_1.join)(config.deploy.deployDir, 'page');
                    if (!(0, fs_extra_1.existsSync)(pagesDir)) return [3, 2];
                    return [4, (0, fs_extra_1.readdir)(pagesDir)];
                case 1:
                    pages = (_a.sent()).filter(function (str) { return /^\d+$/.test(str); }).map(function (str) { return (0, upath_1.join)(pagesDir, str); });
                    folders.push.apply(folders, __spreadArray([], __read(pages), false));
                    _a.label = 2;
                case 2:
                    promises = [];
                    dumpfile = (0, upath_1.join)(process.cwd(), 'build/dump/clean.txt');
                    (0, fm_1.writefile)(dumpfile, folders.join(os_1.EOL));
                    logger_1.default.log(logname, 'list deleted files', dumpfile);
                    for (i = 0; i < folders.length; i++) {
                        pathStr = folders[i];
                        try {
                            if ((0, fs_extra_1.existsSync)(pathStr))
                                promises.push(del(pathStr).catch(noop_1.default));
                        }
                        catch (_b) {
                        }
                    }
                    finishNow = function (e) {
                        if (e instanceof Error) {
                            console.log('clean archives has some erros');
                        }
                        if (typeof done === 'function')
                            done();
                        return undefined;
                    };
                    return [4, bluebird_1.default.all(promises).then(finishNow).catch(finishNow)];
                case 3:
                    _a.sent();
                    return [2];
            }
        });
    });
}
exports.cleanOldArchives = cleanOldArchives;
gulp_1.default.task('clean-archives', cleanOldArchives);
gulp_1.default.task('clean-archive', cleanOldArchives);
gulp_1.default.task('clean-all', gulp_1.default.series('clean', 'clean-archives'));
