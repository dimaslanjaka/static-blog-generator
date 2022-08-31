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
        while (_) try {
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
exports.extractSubmodule = exports.gitAddAndCommit = exports.gitDescribe = exports.isGitHasSubmodule = exports.getLatestCommitHash = exports.git = void 0;
var bluebird_1 = __importDefault(require("bluebird"));
var deepmerge_ts_1 = require("deepmerge-ts");
var fs_1 = require("fs");
var ini_1 = __importDefault(require("ini"));
var upath_1 = require("upath");
var _config_1 = require("../../types/_config");
var spawner_1 = __importDefault(require("../spawner"));
/**
 * git command
 * @param optionsOrCmd git argument or spawn options
 * @param args git variadic arguments
 * @returns
 * @example
 * await git('add', '-A');
 * await git('commit', '-m', 'commit messages');
 * await git('push');
 * // async the result
 * git({stdio:'pipe'}, 'submodule', 'status').then(console.log);
 */
function git(optionsOrCmd) {
    if (optionsOrCmd === void 0) { optionsOrCmd = null; }
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    if (optionsOrCmd !== null) {
        if (typeof optionsOrCmd === 'object') {
            return spawner_1.default.promise.apply(spawner_1.default, __spreadArray([optionsOrCmd, 'git'], __read(args), false));
        }
        else if (typeof optionsOrCmd === 'string') {
            return spawner_1.default.promise.apply(spawner_1.default, __spreadArray([{
                    cwd: _config_1.deployDir,
                    stdio: 'inherit'
                },
                'git',
                optionsOrCmd], __read(args), false));
        }
    }
}
exports.git = git;
/**
 * get latest commit hash
 * * git log --pretty=tformat:%H -n 1 path
 * * git log --pretty=tformat:%h -n 1 path
 * * git rev-parse HEAD
 * * git rev-parse --short HEAD
 * @param path specific folder
 * @returns
 */
var getLatestCommitHash = function (path, options) {
    if (options === void 0) { options = {}; }
    return __awaiter(void 0, void 0, void 0, function () {
        var default_options, short, args, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    default_options = {
                        short: true,
                        cwd: process.cwd()
                    };
                    options = (0, deepmerge_ts_1.deepmerge)(default_options, options);
                    short = options.short;
                    args = [];
                    if (!path) {
                        args.push('rev-parse');
                        if (short)
                            args.push('--short');
                        args.push('HEAD');
                    }
                    else {
                        args.push('log');
                        if (!short) {
                            args.push('--pretty=tformat:%H');
                        }
                        else {
                            args.push('--pretty=tformat:%h');
                        }
                        args.push('-n');
                        args.push('1');
                        args.push(path);
                    }
                    return [4 /*yield*/, git.apply(void 0, __spreadArray([options], __read(args), false))];
                case 1:
                    res = _a.sent();
                    return [2 /*return*/, res.stdout[0]];
            }
        });
    });
};
exports.getLatestCommitHash = getLatestCommitHash;
/**
 * check if git has submodule
 * @param gitDir git directory
 * @returns
 */
function isGitHasSubmodule(gitDir) {
    return new bluebird_1.default(function (resolve) {
        git({ stdio: 'pipe', cwd: gitDir }, 'submodule', 'status', '--recursive').then(function (o) {
            if ('stdout' in o) {
                if (Array.isArray(o.stdout) && o.stdout.length > 0) {
                    return resolve(true);
                }
            }
            return resolve(false);
        });
    });
}
exports.isGitHasSubmodule = isGitHasSubmodule;
/**
 * git describe
 * @returns
 */
var gitDescribe = function () { return __awaiter(void 0, void 0, void 0, function () {
    var res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, git({
                    cwd: process.cwd() //join(__dirname, '../../')
                }, 'describe', '--tags')];
            case 1:
                res = _a.sent();
                return [2 /*return*/, res.stdout[0]];
        }
    });
}); };
exports.gitDescribe = gitDescribe;
function gitAddAndCommit(file, msg, options) {
    if (options === void 0) { options = null; }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, git(options, 'add', file)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, git(options, 'commit', '-m', msg)];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.gitAddAndCommit = gitAddAndCommit;
exports.default = git;
/**
 * extract submodule to object
 * @param path path to .gitmodules or git directory
 */
function extractSubmodule(path) {
    // fix when path is git directory
    if (!path.endsWith('.gitmodules') && !path.endsWith('.ini')) {
        path = (0, upath_1.join)(path, '.gitmodules');
    }
    if (!(0, fs_1.existsSync)(path))
        return null;
    var config = ini_1.default.parse((0, fs_1.readFileSync)(path).toString());
    var result = [];
    Object.keys(config).forEach(function (key) {
        if (key.startsWith('submodule')) {
            var submodule = config[key];
            submodule.fullpath = (0, upath_1.join)((0, upath_1.dirname)(path), submodule.path);
            //console.log(key, submodule);
            result.push(submodule);
        }
    });
    return {
        hasSubmodule: (0, fs_1.existsSync)(path),
        data: result
    };
}
exports.extractSubmodule = extractSubmodule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvbm9kZS9naXQvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHNEQUFnQztBQUVoQyw2Q0FBeUM7QUFDekMseUJBQThDO0FBQzlDLDRDQUFzQjtBQUN0QiwrQkFBc0M7QUFDdEMsK0NBQWdEO0FBQ2hELHVEQUFpQztBQUVqQzs7Ozs7Ozs7Ozs7R0FXRztBQUNILFNBQWdCLEdBQUcsQ0FDakIsWUFBaUQ7SUFBakQsNkJBQUEsRUFBQSxtQkFBaUQ7SUFDakQsY0FBaUI7U0FBakIsVUFBaUIsRUFBakIscUJBQWlCLEVBQWpCLElBQWlCO1FBQWpCLDZCQUFpQjs7SUFFakIsSUFBSSxZQUFZLEtBQUssSUFBSSxFQUFFO1FBQ3pCLElBQUksT0FBTyxZQUFZLEtBQUssUUFBUSxFQUFFO1lBQ3BDLE9BQU8saUJBQU8sQ0FBQyxPQUFPLE9BQWYsaUJBQU8saUJBQVMsWUFBWSxFQUFFLEtBQUssVUFBSyxJQUFJLFdBQUU7U0FDdEQ7YUFBTSxJQUFJLE9BQU8sWUFBWSxLQUFLLFFBQVEsRUFBRTtZQUMzQyxPQUFPLGlCQUFPLENBQUMsT0FBTyxPQUFmLGlCQUFPLGlCQUNaO29CQUNFLEdBQUcsRUFBRSxtQkFBUztvQkFDZCxLQUFLLEVBQUUsU0FBUztpQkFDakI7Z0JBQ0QsS0FBSztnQkFDTCxZQUFZLFVBQ1QsSUFBSSxXQUNQO1NBQ0g7S0FDRjtBQUNILENBQUM7QUFuQkQsa0JBbUJDO0FBTUQ7Ozs7Ozs7O0dBUUc7QUFDSSxJQUFNLG1CQUFtQixHQUFHLFVBQ2pDLElBQWEsRUFDYixPQUFpRDtJQUFqRCx3QkFBQSxFQUFBLFlBQWlEOzs7Ozs7b0JBRTNDLGVBQWUsR0FBK0I7d0JBQ2xELEtBQUssRUFBRSxJQUFJO3dCQUNYLEdBQUcsRUFBRSxPQUFP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