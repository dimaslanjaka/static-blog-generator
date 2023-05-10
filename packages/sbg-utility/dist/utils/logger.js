"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
var tslib_1 = require("tslib");
var fs_extra_1 = require("fs-extra");
var os_1 = require("os");
var slugify_1 = tslib_1.__importDefault(require("slugify"));
var upath_1 = require("upath");
var configs = tslib_1.__importStar(require("../config"));
var filemanager_1 = require("./filemanager");
var jest_1 = require("./jest");
var getConfig = configs.getConfig;
var FOLDER = (0, upath_1.join)(process.cwd(), 'tmp/logs');
// disable console.log on jest
if ((0, jest_1.areWeTestingWithJest)()) {
    // const log = console.log;
    console.log = function () {
        var _a;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var config = getConfig();
        var stack = (_a = new Error('').stack) === null || _a === void 0 ? void 0 : _a.split(/\r?\n/gm);
        var msg = (stack || [])[3] || '';
        if (msg.includes(__filename)) {
            msg = (stack || [])[4] || '';
        }
        var filename = (0, slugify_1.default)((0, upath_1.toUnix)(msg).replace((0, upath_1.toUnix)(config.cwd), ''), {
            lower: true,
            trim: true,
            replacement: '-',
            strict: true
        });
        (0, filemanager_1.writefile)((0, upath_1.join)(config.cwd, 'tmp/logs/', filename + '.log'), args.join(os_1.EOL), { append: true });
    };
}
var _log = typeof hexo === 'undefined' ? console : Object.assign({ log: console.log }, hexo.log);
/**
 * @example
 * const console = Logger
 * Logger.log('hello world'); // should be written in <temp folder>/logs/[trace-name].log
 */
var Logger = /** @class */ (function () {
    function Logger() {
    }
    Logger.log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        _log.log.apply(_log, tslib_1.__spreadArray([], tslib_1.__read(args), false));
        this.tracer.apply(this, tslib_1.__spreadArray([], tslib_1.__read(args), false));
    };
    Logger.info = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        _log.info.apply(null, args);
        this.tracer.apply(this, tslib_1.__spreadArray([], tslib_1.__read(args), false));
    };
    Logger.error = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        _log.error.apply(null, args);
        this.tracer.apply(this, tslib_1.__spreadArray([], tslib_1.__read(args), false));
    };
    Logger.tracer = function () {
        var _a;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var error = new Error();
        var split = (_a = error.stack) === null || _a === void 0 ? void 0 : _a.split(/\r?\n/gm).map(function (str) {
            var _a;
            var split2 = str.trim().split(' ');
            return {
                name: split2[1],
                path: (_a = split2[2]) === null || _a === void 0 ? void 0 : _a.replace(/\\+/gm, '/').replace(/^\(/, '').replace(/\)$/, '')
                //trace: error.stack
            };
        });
        if (split) {
            split.splice(0, 3);
            var logfile = void 0;
            var templ_1;
            // anonymous caller
            if (typeof split[0].path === 'undefined' && split[1].path.includes('anonymous')) {
                var id = split[1].name;
                var path = split[0].name;
                var base = (0, upath_1.basename)(path.split(':')[0].length === 1 ? path.split(':')[0] + ':' + path.split(':')[1] : path.split(':')[0]);
                logfile = (0, upath_1.join)(FOLDER, (0, slugify_1.default)(id, { trim: true }) + '-' + (0, slugify_1.default)(base, { trim: true }) + '.log');
                if (!(0, fs_extra_1.existsSync)(logfile)) {
                    (0, filemanager_1.writefile)(logfile, '');
                }
                templ_1 = "".concat('='.repeat(20), "\nfile: ").concat(path, "\ndate: ").concat(new Date(), "\n").concat('='.repeat(20), "\n\n");
                args.forEach(function (o) {
                    if (o === null)
                        o = 'null';
                    if (typeof o === 'object') {
                        try {
                            o = JSON.stringify(o, null, 2);
                        }
                        catch (_a) {
                            //
                        }
                    }
                    templ_1 += String(o) + '\n\n';
                });
                (0, fs_extra_1.appendFileSync)(logfile, templ_1);
            }
            // Logger.log(split);
        }
    };
    return Logger;
}());
exports.Logger = Logger;
exports.default = Logger;
//# sourceMappingURL=logger.js.map