"use strict";
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
exports.memoizeFs = void 0;
var fs_1 = require("fs");
var path_1 = require("path");
var color_1 = __importDefault(require("./color"));
var filemanager_1 = require("./filemanager");
var md5_file_1 = require("./md5-file");
var memoizer = /** @class */ (function () {
    function memoizer() {
        var _this = this;
        this.cache = {};
        this.memoize = function (fn) {
            var self = _this;
            return (function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var find = _this.getCacheFilePath.apply(_this, __spreadArray([fn], __read(args), false));
                if ((0, fs_1.existsSync)(find)) {
                    var read = JSON.parse((0, fs_1.readFileSync)(find, 'utf-8'));
                    if (_this.verbose)
                        console.log(color_1.default.greenBright('Fetching from cache'));
                    return read.content;
                }
                else {
                    if (_this.verbose)
                        console.log(color_1.default.Red('Calculating result'));
                    var result = fn.apply(void 0, __spreadArray([], __read(args), false));
                    var content = {
                        type: self.determineType(result),
                        content: result
                    };
                    (0, filemanager_1.write)(find, content);
                    return result;
                }
            });
        };
        /**
         * @see {@link memoizer.memoize}
         */
        this.fn = this.memoize;
        /**
         * cache directory
         */
        this.cacheDir = (0, filemanager_1.join)(filemanager_1.cacheDir, 'memoize-fs');
        this.verbose = false;
    }
    /**
     * determine function return type
     * @param arg
     * @returns
     */
    memoizer.prototype.determineType = function (arg) {
        if (typeof arg == 'object') {
            if (Array.isArray(arg))
                return 'array';
            return 'object';
        }
        return typeof arg;
    };
    /**
     * clear cache function
     * @param fn
     */
    memoizer.prototype.clear = function (fn) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var argpath = this.getCacheFilePath.apply(this, __spreadArray([fn], __read(args), false));
        var fnpath = this.getCacheFilePath(fn);
        if ((0, fs_1.existsSync)(fnpath)) {
            if (this.verbose)
                console.log('found fn');
            (0, filemanager_1.rm)(fnpath, { recursive: true });
        }
        if ((0, fs_1.existsSync)(argpath)) {
            if (this.verbose)
                console.log('found fn args');
            (0, filemanager_1.rm)(argpath, { recursive: true });
        }
    };
    /**
     * get function cache file
     * @param fn
     * @param args
     * @returns
     */
    memoizer.prototype.getCacheFilePath = function (fn) {
        var _this = this;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var args1 = String(args);
        return (function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var pathStr = _this.determinefn(fn);
            if (args1.length)
                pathStr += '/' + (0, md5_file_1.md5)(String(args1));
            if (args.length)
                pathStr += '/' + (0, md5_file_1.md5)(String(args));
            var path = (0, path_1.resolve)((0, filemanager_1.join)(_this.cacheDir, pathStr));
            if (_this.verbose)
                console.log(path, (0, fs_1.existsSync)(path));
            return path;
        })();
    };
    /**
     * determine function
     * @param fn
     * @param _args
     * @returns
     */
    memoizer.prototype.determinefn = function (fn) {
        var _args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            _args[_i - 1] = arguments[_i];
        }
        var fnStr = String(fn);
        return (0, md5_file_1.md5)(fnStr);
    };
    return memoizer;
}());
exports.default = memoizer;
var mem = new memoizer();
exports.memoizeFs = mem.memoize;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVtb2l6ZS1mcy5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInNyYy9ub2RlL21lbW9pemUtZnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHlCQUE4QztBQUM5Qyw2QkFBK0I7QUFDL0Isa0RBQTRCO0FBQzVCLDZDQUEwRDtBQUMxRCx1Q0FBaUM7QUFRakM7SUFBQTtRQUFBLGlCQXdGQztRQXZGQyxVQUFLLEdBQUcsRUFBRSxDQUFDO1FBQ1gsWUFBTyxHQUFHLFVBQWlCLEVBQUs7WUFDOUIsSUFBTSxJQUFJLEdBQUcsS0FBSSxDQUFDO1lBQ2xCLE9BQU8sQ0FBQztnQkFBQyxjQUFjO3FCQUFkLFVBQWMsRUFBZCxxQkFBYyxFQUFkLElBQWM7b0JBQWQseUJBQWM7O2dCQUNyQixJQUFNLElBQUksR0FBRyxLQUFJLENBQUMsZ0JBQWdCLE9BQXJCLEtBQUksaUJBQWtCLEVBQUUsVUFBSyxJQUFJLFVBQUMsQ0FBQztnQkFFaEQsSUFBSSxJQUFBLGVBQVUsRUFBQyxJQUFJLENBQUMsRUFBRTtvQkFDcEIsSUFBTSxJQUFJLEdBQWlCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBQSxpQkFBWSxFQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO29CQUNuRSxJQUFJLEtBQUksQ0FBQyxPQUFPO3dCQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBSyxDQUFDLFdBQVcsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUM7b0JBQ3hFLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztpQkFDckI7cUJBQU07b0JBQ0wsSUFBSSxLQUFJLENBQUMsT0FBTzt3QkFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQUssQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDO29CQUMvRCxJQUFNLE1BQU0sR0FBRyxFQUFFLHdDQUFJLElBQUksVUFBQyxDQUFDO29CQUMzQixJQUFNLE9B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