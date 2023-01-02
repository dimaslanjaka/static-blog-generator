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
exports.safelinkProcess = void 0;
var fs_1 = require("fs");
var gulp_1 = __importDefault(require("gulp"));
var safelinkify_1 = __importDefault(require("safelinkify"));
var through2_1 = __importDefault(require("through2"));
var gulp_cache_1 = __importDefault(require("./gulp-utils/gulp.cache"));
var gulp_config_1 = require("./gulp.config");
var logger_1 = __importDefault(require("./utils/logger"));
function safelinkProcess(_done, cwd) {
    var _this = this;
    return new Promise(function (resolve) {
        var _a, _b, _c;
        var config = (0, gulp_config_1.getConfig)();
        if (!config.external_link.safelink)
            return resolve(new Error('config safelink not configured'));
        if (!config.external_link.safelink.redirect)
            return resolve(new Error('safelink redirector not configured'));
        var configSafelink = Object.assign({ enable: false }, config.external_link.safelink || {});
        var baseURL = '';
        try {
            baseURL = new URL(config.url).host;
        }
        catch (_d) {
        }
        var opt = {
            exclude: __spreadArray(__spreadArray(__spreadArray([], __read((((_a = config.external_link) === null || _a === void 0 ? void 0 : _a.exclude) || [])), false), [
                /https?:\/\/?(?:([^*]+)\.)?webmanajemen\.com/,
                /([a-z0-9](?:[a-z0-9-]{1,61}[a-z0-9])?[.])*webmanajemen\.com/,
                baseURL,
                'www.webmanajemen.com',
                'https://github.com/dimaslanjaka',
                'https://facebook.com/dimaslanjaka1',
                'dimaslanjaka.github.io'
            ], false), __read(configSafelink.exclude), false).filter(function (x, i, a) {
                return a.indexOf(x) === i && x.toString().trim().length !== 0;
            }),
            redirect: [],
            password: configSafelink.password || config.external_link.safelink.password,
            type: configSafelink.type || config.external_link.safelink.type
        };
        if (configSafelink.redirect) {
            opt.redirect = configSafelink.redirect;
        }
        var safelink = new safelinkify_1.default.safelink(opt);
        var folder = cwd || config.deploy.deployDir;
        var gulpopt = {
            cwd: folder,
            ignore: []
        };
        if (Array.isArray(config.external_link.exclude)) {
            (_b = gulpopt.ignore) === null || _b === void 0 ? void 0 : _b.concat.apply(_b, __spreadArray([], __read(config.external_link.exclude), false));
        }
        if (Array.isArray(configSafelink.exclude)) {
            var ignore = configSafelink.exclude.filter(function (str) {
                if (typeof str === 'string') {
                    return !/^(https?:\/|www.)/.test(str);
                }
                return false;
            });
            (_c = gulpopt.ignore) === null || _c === void 0 ? void 0 : _c.concat.apply(_c, __spreadArray([], __read(ignore), false));
        }
        if ((0, fs_1.existsSync)(folder)) {
            return gulp_1.default
                .src(['**/*.{html,htm}'], gulpopt)
                .pipe((0, gulp_cache_1.default)({ name: 'safelink' }))
                .pipe(through2_1.default.obj(function (file, _enc, next) { return __awaiter(_this, void 0, void 0, function () {
                var content, parsed;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (file.isNull() || file.isDirectory() || !file)
                                return [2, next()];
                            if (!(file.isBuffer() && Buffer.isBuffer(file.contents))) return [3, 2];
                            content = file.contents.toString('utf-8');
                            return [4, safelink.parse(content)];
                        case 1:
                            parsed = _a.sent();
                            if (typeof parsed === 'string') {
                                file.contents = Buffer.from(parsed);
                                return [2, next(null, file)];
                            }
                            _a.label = 2;
                        case 2:
                            logger_1.default.log('cannot parse', file.path);
                            next();
                            return [2];
                    }
                });
            }); }))
                .pipe(gulp_1.default.dest(config.deploy.deployDir))
                .once('end', function () { return resolve(null); });
        }
        return resolve(null);
    });
}
exports.safelinkProcess = safelinkProcess;
gulp_1.default.task('safelink', safelinkProcess);
