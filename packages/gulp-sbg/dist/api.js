"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var upath_1 = require("upath");
var gulp_config_1 = __importDefault(require("./gulp.config"));
var gulp_post_1 = require("./gulp.post");
var gulp_safelink_1 = require("./gulp.safelink");
var gulp_seo_1 = require("./gulp.seo");
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
         * Auto seo on public dir (run after generated)
         * @returns
         */
        this.seo = function () { return (0, gulp_seo_1.autoSeo)((0, upath_1.join)(_this.base, gulp_config_1.default.public_dir)); };
        /**
         * Copy all **src-post** to **source/_posts**
         * * see the method {@link copyAllPosts}
         * @returns
         */
        this.copy = function () { return (0, gulp_post_1.copyAllPosts)(); };
        /**
         * Anonymize external links
         * @returns
         */
        this.safelink = function () { return (0, gulp_safelink_1.safelinkProcess)(); };
        if (typeof base === 'string')
            this.base = base;
    }
    return SBG;
}());
exports.default = SBG;
