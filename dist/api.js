"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var hexo_1 = tslib_1.__importDefault(require("hexo"));
var upath_1 = require("upath");
var gulp_clean_1 = require("./gulp.clean");
var gulp_config_1 = require("./gulp.config");
var gulp_deploy_1 = require("./gulp.deploy");
var gulp_post_1 = require("./gulp.post");
var gulp_safelink_1 = require("./gulp.safelink");
var gulp_seo_1 = require("./gulp.seo");
var gulp_standalone_1 = tslib_1.__importDefault(require("./gulp.standalone"));
var noop_1 = tslib_1.__importDefault(require("./utils/noop"));
var SBG = (function () {
    function SBG(cwd) {
        if (cwd === void 0) { cwd = null; }
        var _this = this;
        this.config = (0, gulp_config_1.getConfig)();
        this.standalone = function () { return (0, gulp_standalone_1.default)(); };
        this.seo = function () { return (0, gulp_seo_1.autoSeo)((0, upath_1.join)(_this.cwd, (0, gulp_config_1.getConfig)().public_dir)); };
        this.copy = function () {
            return new Promise(function (resolve) {
                (0, gulp_post_1.copyAllPosts)().once('end', resolve);
            });
        };
        this.safelink = function () { return (0, gulp_safelink_1.safelinkProcess)(noop_1.default, (0, upath_1.join)(_this.cwd, (0, gulp_config_1.getConfig)().public_dir)); };
        if (typeof cwd === 'string') {
            this.cwd = cwd;
            this.config = (0, gulp_config_1.setConfig)({ cwd: cwd });
        }
    }
    SBG.prototype.generate = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var instance;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        instance = new hexo_1.default(this.cwd);
                        return [4, instance.init().catch(noop_1.default)];
                    case 1:
                        _a.sent();
                        return [4, instance.call('generate').catch(noop_1.default)];
                    case 2:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    SBG.prototype.deploy = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, github, config;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4, this.generate()];
                    case 1:
                        _b.sent();
                        return [4, (0, gulp_deploy_1.asyncCopyGen)()];
                    case 2:
                        _b.sent();
                        _a = (0, gulp_config_1.deployConfig)(), github = _a.github, config = _a.config;
                        return [4, github.init().catch(noop_1.default)];
                    case 3:
                        _b.sent();
                        return [4, github.setremote(config.repo).catch(noop_1.default)];
                    case 4:
                        _b.sent();
                        return [4, github.setuser(config.username).catch(noop_1.default)];
                    case 5:
                        _b.sent();
                        return [4, github.setemail(config.email).catch(noop_1.default)];
                    case 6:
                        _b.sent();
                        return [4, github.setbranch(config.branch).catch(noop_1.default)];
                    case 7:
                        _b.sent();
                        return [2];
                }
            });
        });
    };
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
