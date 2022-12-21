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
var hexo_1 = __importDefault(require("hexo"));
var upath_1 = require("upath");
var gulp_clean_1 = require("./gulp.clean");
var gulp_config_1 = require("./gulp.config");
var gulp_deploy_1 = require("./gulp.deploy");
var gulp_post_1 = require("./gulp.post");
var gulp_safelink_1 = require("./gulp.safelink");
var gulp_seo_1 = require("./gulp.seo");
var gulp_standalone_1 = __importDefault(require("./gulp.standalone"));
var noop_1 = __importDefault(require("./utils/noop"));
var SBG = /** @class */ (function () {
    /**
     * Static blog generator
     * @param cwd base folder
     */
    function SBG(cwd) {
        if (cwd === void 0) { cwd = null; }
        var _this = this;
        this.config = (0, gulp_config_1.getConfig)();
        this.standalone = function () { return (0, gulp_standalone_1.default)(); };
        /**
         * Auto seo on public dir (_config_yml.public_dir) (run after generated)
         * @returns
         */
        this.seo = function () { return (0, gulp_seo_1.autoSeo)((0, upath_1.join)(_this.cwd, (0, gulp_config_1.getConfig)().public_dir)); };
        /**
         * Copy all **src-post** to **source/_posts** (run before generate)
         * * see the method {@link copyAllPosts}
         * @returns
         */
        this.copy = function () {
            return new Promise(function (resolve) {
                (0, gulp_post_1.copyAllPosts)().once('end', resolve);
            });
        };
        /**
         * Anonymize external links on public dir (_config_yml.public_dir) (run after generated)
         * @returns
         */
        this.safelink = function () { return (0, gulp_safelink_1.safelinkProcess)(noop_1.default, (0, upath_1.join)(_this.cwd, (0, gulp_config_1.getConfig)().public_dir)); };
        if (typeof cwd === 'string') {
            this.cwd = cwd;
            this.config = (0, gulp_config_1.setConfig)({ cwd: cwd });
        }
    }
    /**
     * generate site with hexo
     */
    SBG.prototype.generate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var instance;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        instance = new hexo_1.default(this.cwd);
                        // hexo init
                        return [4 /*yield*/, instance.init().catch(noop_1.default)];
                    case 1:
                        // hexo init
                        _a.sent();
                        // hexo generate
                        return [4 /*yield*/, instance.call('generate').catch(noop_1.default)];
                    case 2:
                        // hexo generate
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SBG.prototype.deploy = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, github, config;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: 
                    // run generate task
                    return [4 /*yield*/, this.generate()];
                    case 1:
                        // run generate task
                        _b.sent();
                        // copy generated files to deployment directory
                        return [4 /*yield*/, (0, gulp_deploy_1.asyncCopyGen)()];
                    case 2:
                        // copy generated files to deployment directory
                        _b.sent();
                        _a = (0, gulp_config_1.deployConfig)(), github = _a.github, config = _a.config;
                        return [4 /*yield*/, github.init().catch(noop_1.default)];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, github.setremote(config.repo).catch(noop_1.default)];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, github.setuser(config.username).catch(noop_1.default)];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, github.setemail(config.email).catch(noop_1.default)];
                    case 6:
                        _b.sent();
                        return [4 /*yield*/, github.setbranch(config.branch).catch(noop_1.default)];
                    case 7:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * clean cache, auto generated posts, etc
     * @see {@link cleanDb}
     * @see {@link cleanOldArchives}
     */
    SBG.prototype.clean = function (opt) {
        if (opt !== 'all') {
            return (0, gulp_clean_1.cleanDb)();
        }
        else {
            return (0, gulp_clean_1.cleanOldArchives)();
        }
    };
    return SBG;
}());
exports.default = SBG;
