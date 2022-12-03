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
var bluebird_1 = __importDefault(require("bluebird"));
var hexo_1 = __importDefault(require("hexo"));
var upath_1 = require("upath");
var gulp_clean_1 = require("./gulp.clean");
var gulp_config_1 = __importDefault(require("./gulp.config"));
var gulp_post_1 = require("./gulp.post");
var gulp_safelink_1 = require("./gulp.safelink");
var gulp_seo_1 = require("./gulp.seo");
var noop_1 = __importDefault(require("./utils/noop"));
var SBG = /** @class */ (function () {
    /**
     * Static blog generator
     * @param base base folder
     */
    function SBG(base) {
        if (base === void 0) { base = null; }
        var _this = this;
        this.base = (0, upath_1.toUnix)(process.cwd());
        /**
         * Auto seo on public dir (_config_yml.public_dir) (run after generated)
         * @returns
         */
        this.seo = function () { return (0, gulp_seo_1.autoSeo)((0, upath_1.join)(_this.base, gulp_config_1.default.public_dir)); };
        /**
         * Copy all **src-post** to **source/_posts** (run before generate)
         * * see the method {@link copyAllPosts}
         * @returns
         */
        this.copy = function () {
            return new bluebird_1.default(function (resolve) {
                (0, gulp_post_1.copyAllPosts)().once('end', function () {
                    resolve.bind(this)();
                });
            });
        };
        /**
         * Anonymize external links on public dir (_config_yml.public_dir) (run after generated)
         * @returns
         */
        this.safelink = function () { return (0, gulp_safelink_1.safelinkProcess)(noop_1.default, (0, upath_1.join)(_this.base, gulp_config_1.default.public_dir)); };
        /**
         * clean cache, auto generated posts, etc
         */
        this.clean = (0, gulp_clean_1.cleanDb)();
        if (typeof base === 'string')
            this.base = base;
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
                        instance = new hexo_1.default(this.base);
                        return [4 /*yield*/, instance.init().catch(noop_1.default)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, instance.call('generate').catch(noop_1.default)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return SBG;
}());
exports.default = SBG;
