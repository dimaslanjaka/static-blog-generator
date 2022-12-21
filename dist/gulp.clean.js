"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanOldArchives = exports.del = exports.cleanDb = void 0;
var tslib_1 = require("tslib");
var bluebird_1 = tslib_1.__importDefault(require("bluebird"));
var fs_extra_1 = require("fs-extra");
var gulp_1 = tslib_1.__importDefault(require("gulp"));
var hexo_1 = tslib_1.__importDefault(require("hexo"));
var upath_1 = require("upath");
var util_1 = require("util");
var gulp_config_1 = require("./gulp.config");
var fm_1 = require("./utils/fm");
var logger_1 = tslib_1.__importDefault(require("./utils/logger"));
var noop_1 = tslib_1.__importDefault(require("./utils/noop"));
function cleanDb() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var config, postDir, publicDir, tmpDir, _a, _b, _c, hexo;
        return tslib_1.__generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    config = (0, gulp_config_1.getConfig)();
                    if (typeof config.source_dir !== 'string') {
                        (0, fm_1.writefile)((0, upath_1.join)(config.cwd, 'tmp/errors/clean.log'), (0, util_1.inspect)(config));
                        throw new Error('config.source_dir must be configured');
                    }
                    postDir = (0, upath_1.join)(config.cwd, config.source_dir, '_posts');
                    publicDir = (0, upath_1.join)(config.cwd, config.public_dir);
                    tmpDir = (0, upath_1.join)(config.cwd, 'tmp');
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
                    return [2];
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
    var config = (0, gulp_config_1.getConfig)();
    var archives = (0, upath_1.join)(gulp_config_1.deployDir, config.archive_dir);
    var categories = (0, upath_1.join)(gulp_config_1.deployDir, config.category_dir);
    var tags = (0, upath_1.join)(gulp_config_1.deployDir, config.tag_dir);
    var folders = [archives, tags, categories]
        .concat(config.language.map(function (str) { return (0, upath_1.join)(gulp_config_1.deployDir, str); }))
        .filter(function (str) { return (0, fs_extra_1.existsSync)(str); });
    var promises = [];
    for (var i = 0; i < folders.length; i++) {
        var pathStr = folders[i];
        try {
            if ((0, fs_extra_1.existsSync)(pathStr))
                promises.push(del(pathStr).catch(noop_1.default));
        }
        catch (_a) {
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
