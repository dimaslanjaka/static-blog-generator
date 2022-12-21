"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.safelinkProcess = void 0;
var tslib_1 = require("tslib");
var fs_1 = require("fs");
var gulp_1 = tslib_1.__importDefault(require("gulp"));
var safelinkify_1 = tslib_1.__importDefault(require("safelinkify"));
var through2_1 = tslib_1.__importDefault(require("through2"));
var gulp_config_1 = require("./gulp.config");
function safelinkProcess(_done, cwd) {
    var _this = this;
    return new Promise(function (resolve) {
        var _a;
        var _b, _c, _d, _e, _f;
        var config = (0, gulp_config_1.getConfig)();
        var configSafelink = Object.assign({ enable: false }, ((_b = config.external_link) === null || _b === void 0 ? void 0 : _b.safelink) || {});
        var baseURL = '';
        try {
            baseURL = new URL(config.url).host;
        }
        catch (_g) {
        }
        var safelink = new safelinkify_1.default.safelink({
            exclude: tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray([], tslib_1.__read((((_c = config.external_link) === null || _c === void 0 ? void 0 : _c.exclude) || [])), false), [
                /https?:\/\/?(?:([^*]+)\.)?webmanajemen\.com/,
                /([a-z0-9](?:[a-z0-9-]{1,61}[a-z0-9])?[.])*webmanajemen\.com/,
                baseURL,
                'www.webmanajemen.com',
                'https://github.com/dimaslanjaka',
                'https://facebook.com/dimaslanjaka1',
                'dimaslanjaka.github.io'
            ], false), tslib_1.__read(configSafelink.exclude), false).filter(function (x, i, a) {
                return a.indexOf(x) === i && x.toString().trim().length !== 0;
            }),
            redirect: [config.external_link.safelink.redirect, configSafelink.redirect],
            password: configSafelink.password || config.external_link.safelink.password,
            type: configSafelink.type || config.external_link.safelink.type
        });
        var folder = cwd || gulp_config_1.deployDir;
        if ((0, fs_1.existsSync)(folder)) {
            return gulp_1.default
                .src(['**/*.{html,htm}'], {
                cwd: folder,
                ignore: (_a = []).concat.apply(_a, tslib_1.__spreadArray(tslib_1.__spreadArray([], tslib_1.__read((((_d = (0, gulp_config_1.getConfig)().external_link) === null || _d === void 0 ? void 0 : _d.exclude) || [])), false), tslib_1.__read((((_f = (_e = (0, gulp_config_1.getConfig)().external_link) === null || _e === void 0 ? void 0 : _e.safelink) === null || _f === void 0 ? void 0 : _f.exclude) || [])), false))
            })
                .pipe(through2_1.default.obj(function (file, _enc, next) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var content, parsed;
                return tslib_1.__generator(this, function (_a) {
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
                            console.log('cannot parse', file.path);
                            next();
                            return [2];
                    }
                });
            }); }))
                .pipe(gulp_1.default.dest(gulp_config_1.deployDir))
                .once('end', function () { return resolve(null); });
        }
        return resolve(null);
    });
}
exports.safelinkProcess = safelinkProcess;
gulp_1.default.task('safelink', safelinkProcess);
