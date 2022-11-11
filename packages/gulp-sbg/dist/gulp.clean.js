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
        while (_) try {
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
exports.cleanOldArchives = exports.del = exports.cleanDb = void 0;
var bluebird_1 = __importDefault(require("bluebird"));
var fs_extra_1 = require("fs-extra");
var gulp_1 = __importDefault(require("gulp"));
var hexo_1 = __importDefault(require("hexo"));
var upath_1 = require("upath");
var gulp_config_1 = __importStar(require("./gulp.config"));
var noop_1 = __importDefault(require("./utils/noop"));
/**
 * Clean Project Databases
 */
function cleanDb() {
    return __awaiter(this, void 0, void 0, function () {
        var config, post, publicDir, tmpDir, _a, _b, _c, hexo;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    config = gulp_config_1.default;
                    post = (0, upath_1.join)(process.cwd(), config.source_dir, '_posts');
                    publicDir = (0, upath_1.join)(process.cwd(), config.public_dir);
                    tmpDir = (0, upath_1.join)(process.cwd(), 'tmp');
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 4, , 5]);
                    if (!(0, fs_extra_1.existsSync)(tmpDir)) return [3 /*break*/, 3];
                    return [4 /*yield*/, del(tmpDir).catch(noop_1.default)];
                case 2:
                    _d.sent();
                    _d.label = 3;
                case 3: return [3 /*break*/, 5];
                case 4:
                    _a = _d.sent();
                    return [3 /*break*/, 5];
                case 5:
                    _d.trys.push([5, 8, , 9]);
                    if (!(0, fs_extra_1.existsSync)(publicDir)) return [3 /*break*/, 7];
                    return [4 /*yield*/, del(publicDir).catch(noop_1.default)];
                case 6:
                    _d.sent();
                    _d.label = 7;
                case 7: return [3 /*break*/, 9];
                case 8:
                    _b = _d.sent();
                    return [3 /*break*/, 9];
                case 9:
                    _d.trys.push([9, 12, , 13]);
                    if (!(0, fs_extra_1.existsSync)(post)) return [3 /*break*/, 11];
                    return [4 /*yield*/, del(post).catch(noop_1.default)];
                case 10:
                    _d.sent();
                    _d.label = 11;
                case 11: return [3 /*break*/, 13];
                case 12:
                    _c = _d.sent();
                    return [3 /*break*/, 13];
                case 13:
                    hexo = new hexo_1.default(process.cwd());
                    return [4 /*yield*/, hexo.init().catch(noop_1.default)];
                case 14:
                    _d.sent();
                    return [4 /*yield*/, hexo.call('clean').catch(noop_1.default)];
                case 15:
                    _d.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.cleanDb = cleanDb;
/**
 * delete folder async for gulp
 * @param path
 * @returns
 */
function del(path) {
    return new bluebird_1.default(function (resolve) {
        var rmOpt = { recursive: true, force: true };
        if ((0, fs_extra_1.existsSync)(path)) {
            if ((0, fs_extra_1.statSync)(path).isDirectory()) {
                (0, fs_extra_1.rmdir)(path, rmOpt).then(resolve).catch(noop_1.default);
            }
            else {
                (0, fs_extra_1.rm)(path, rmOpt).then(resolve).catch(noop_1.default);
            }
        }
        else {
            resolve(new Error(path + ' not found'));
        }
    });
}
exports.del = del;
gulp_1.default.task('clean', cleanDb);
/**
 * clean old archives (categories, tags, pagination)
 */
function cleanOldArchives(done) {
    var archives = (0, upath_1.join)(gulp_config_1.deployDir, gulp_config_1.default.archive_dir);
    var categories = (0, upath_1.join)(gulp_config_1.deployDir, gulp_config_1.default.category_dir);
    var tags = (0, upath_1.join)(gulp_config_1.deployDir, gulp_config_1.default.tag_dir);
    var folders = [archives, tags, categories]
        .concat(gulp_config_1.default.language.map(function (str) { return (0, upath_1.join)(gulp_config_1.deployDir, str); }))
        .filter(function (str) { return (0, fs_extra_1.existsSync)(str); });
    var promises = [];
    for (var i = 0; i < folders.length; i++) {
        var pathStr = folders[i];
        try {
            if ((0, fs_extra_1.existsSync)(pathStr))
                promises.push(del(pathStr).catch(noop_1.default));
        }
        catch (_a) {
            //
        }
    }
    var finishNow = function () {
        if (typeof done === 'function')
            done();
    };
    return bluebird_1.default.all(promises).then(finishNow).catch(finishNow);
}
exports.cleanOldArchives = cleanOldArchives;
gulp_1.default.task('clean-archives', cleanOldArchives);
gulp_1.default.task('clean-all', gulp_1.default.series('clean', 'clean-archives'));
