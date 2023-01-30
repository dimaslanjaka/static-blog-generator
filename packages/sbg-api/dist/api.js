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
exports.SBG = void 0;
var bluebird_1 = __importDefault(require("bluebird"));
var hexo_1 = __importDefault(require("hexo"));
var sbg_utility_1 = require("sbg-utility");
var upath_1 = require("upath");
var cleaner = __importStar(require("./clean"));
var copy_1 = require("./deploy/copy");
var gulp_safelink_1 = require("./gulp.safelink");
var gulp_seo_1 = require("./gulp.seo");
var pcopy = __importStar(require("./post/copy"));
var standalone_1 = __importDefault(require("./post/standalone"));
var SBG = /** @class */ (function () {
    /**
     * Static blog generator
     * @param cwd base folder
     */
    function SBG(cwd, options) {
        this.config = (0, sbg_utility_1.getConfig)();
        this.setConfig = sbg_utility_1.setConfig;
        this.getConfig = sbg_utility_1.getConfig;
        /**
         * run files ends with `standalone.js` inside source posts {@link standaloneRunner}
         * @returns
         */
        this.standalone = function () { return (0, sbg_utility_1.chain)([{ callback: standalone_1.default }]); };
        this.deploy = new (/** @class */ (function () {
            function class_1(superThis) {
                this.superThis = superThis;
                //
            }
            class_1.prototype.copy = function (ignore) {
                if (ignore === void 0) { ignore = []; }
                var self = this.superThis;
                return new bluebird_1.default(function (resolve) {
                    (0, copy_1.deployCopy)(self, ignore).once('end', function () {
                        setTimeout(function () {
                            resolve();
                        }, 3000);
                    });
                });
            };
            return class_1;
        }()))(this);
        if (!cwd)
            cwd = process.cwd();
        (0, sbg_utility_1.fetchConfig)(cwd);
        this.cwd = cwd;
        this.config.cwd = cwd;
        options = Object.assign(this.config, options || {}, { cwd: cwd });
        this.config = (0, sbg_utility_1.setConfig)(options);
        SBG.setApi(this);
        new sbg_utility_1.scheduler();
    }
    SBG.setApi = function (api) {
        this.currentApI = api;
    };
    SBG.getApi = function () {
        return this.currentApI;
    };
    /**
     * get index packages
     * @returns
     */
    SBG.prototype.core = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // apply current config
                        (0, sbg_utility_1.setConfig)(this.config);
                        return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('./index')); })];
                    case 1: 
                    // recall index
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Auto seo on public dir (_config_yml.public_dir) (run after generated)
     * @param customPath run seo fixer on spesific folder
     * @returns
     */
    SBG.prototype.seo = function (customPath) {
        var _this = this;
        return new bluebird_1.default(function (resolve) {
            (0, gulp_seo_1.taskSeo)(null, customPath || (0, upath_1.join)(_this.cwd, _this.config.public_dir)).once('end', function () {
                setTimeout(function () {
                    resolve();
                }, 3000);
            });
        });
    };
    /**
     * Copy all **src-post** to **source/_posts** (run before generate)
     * * see the method {@link pcopy.copyAllPosts}
     * @returns
     */
    // copy = () => chain([{ callback: () => pcopy.copyAllPosts(undefined, this.config) }]);
    SBG.prototype.copy = function () {
        var config = this.config;
        return new Promise(function (resolve) {
            var streamer = pcopy.copyAllPosts(undefined, config);
            streamer.on('end', function () {
                // wait all handler to be closed
                setTimeout(function () {
                    resolve(null);
                }, 3000);
            });
        });
    };
    /**
     * Anonymize external links on public dir (_config_yml.public_dir) (run after generated)
     * @param customPath run anonymizer external links on spesific folder
     * @returns
     */
    SBG.prototype.safelink = function (customPath) {
        var _this = this;
        return new bluebird_1.default(function (resolve) {
            (0, gulp_safelink_1.taskSafelink)(null, customPath || (0, upath_1.join)(_this.cwd, _this.config.public_dir)).once('end', function () {
                setTimeout(function () {
                    resolve();
                }, 3000);
            });
        });
    };
    /**
     * generate site with hexo
     */
    SBG.prototype.generate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var hexo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        hexo = new hexo_1.default(this.cwd);
                        // hexo init
                        return [4 /*yield*/, hexo.init().catch(sbg_utility_1.noop)];
                    case 1:
                        // hexo init
                        _a.sent();
                        return [4 /*yield*/, hexo.load().catch(sbg_utility_1.noop)];
                    case 2:
                        _a.sent();
                        // hexo generate
                        return [4 /*yield*/, hexo.call('generate').catch(sbg_utility_1.noop)];
                    case 3:
                        // hexo generate
                        _a.sent();
                        return [4 /*yield*/, hexo.exit()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * clean cache, auto generated posts, etc
     * @see {@link cleaner.cleanDb}
     * @see {@link cleaner.cleanArchive}
     */
    SBG.prototype.clean = function (opt) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(opt === 'all')) return [3 /*break*/, 3];
                        return [4 /*yield*/, cleaner.cleanDb().catch(console.log)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, cleaner.cleanArchive().catch(console.log)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 9];
                    case 3:
                        if (!(opt === 'archive')) return [3 /*break*/, 5];
                        return [4 /*yield*/, cleaner.cleanArchive().catch(console.log)];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 9];
                    case 5:
                        if (!(opt === 'post')) return [3 /*break*/, 7];
                        return [4 /*yield*/, cleaner.cleanGeneratedPosts().catch(console.log)];
                    case 6:
                        _a.sent();
                        return [3 /*break*/, 9];
                    case 7: return [4 /*yield*/, cleaner.cleanDb().catch(console.log)];
                    case 8:
                        _a.sent();
                        _a.label = 9;
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    return SBG;
}());
exports.SBG = SBG;
exports.default = SBG;
//# sourceMappingURL=api.js.map