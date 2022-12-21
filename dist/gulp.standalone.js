"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var cross_spawn_1 = tslib_1.__importDefault(require("cross-spawn"));
var gulp_1 = tslib_1.__importDefault(require("gulp"));
var through2_1 = tslib_1.__importDefault(require("through2"));
var upath_1 = require("upath");
var gulp_config_1 = require("./gulp.config");
var string_1 = require("./utils/string");
function standaloneRunner() {
    console.log('[standalone] Running scripts...\n');
    return gulp_1.default
        .src((0, upath_1.join)((0, gulp_config_1.getConfig)().cwd, '**/_*.standalone.js'), { cwd: (0, gulp_config_1.getConfig)().cwd, ignore: ['**/tmp/**'] })
        .pipe(through2_1.default.obj(function (file, _enc, next) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, child;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        console.log('='.repeat(10) + ' input ' + '='.repeat(10));
                        _b = (_a = console).log;
                        _c = "node ".concat;
                        return [4, (0, string_1.replacePath)(file.path, (0, gulp_config_1.getConfig)().cwd, '')];
                    case 1:
                        _b.apply(_a, [_c.apply("node ", [_d.sent()])]);
                        console.log('='.repeat(10) + ' ouput ' + '='.repeat(10));
                        child = (0, cross_spawn_1.default)('node', [file.path], { stdio: 'inherit' });
                        child.on('close', function () {
                            next();
                        });
                        return [2];
                }
            });
        });
    }))
        .pipe(gulp_1.default.dest((0, upath_1.join)((0, gulp_config_1.getConfig)().cwd, 'tmp/standalone')))
        .once('end', function () {
        console.log('\n[standalone] stopped');
    });
}
gulp_1.default.task('post:standalone', standaloneRunner);
exports.default = standaloneRunner;
