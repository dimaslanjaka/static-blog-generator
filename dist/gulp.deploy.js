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
exports.asyncCopyGen = exports.copyGen = void 0;
var ansi_colors_1 = __importDefault(require("ansi-colors"));
var bluebird_1 = __importDefault(require("bluebird"));
var fs_1 = require("fs");
var git_command_helper_1 = __importDefault(require("git-command-helper"));
var spawn_1 = require("git-command-helper/dist/spawn");
var gulp_1 = __importDefault(require("gulp"));
var moment_timezone_1 = __importDefault(require("moment-timezone"));
var upath_1 = require("upath");
require("./clean");
require("./gulp.safelink");
var logger_1 = __importDefault(require("./utils/logger"));
var _config_1 = require("./_config");
function copyGen() {
    var deployDir = (0, _config_1.deployConfig)().deployDir;
    var publicDir = (0, upath_1.join)(process.cwd(), (0, _config_1.getConfig)().public_dir);
    return gulp_1.default
        .src(['**/**', '!**/.git*', '!**/tmp/**', '!**/node_modules/**'], {
        cwd: publicDir,
        dot: true
    })
        .pipe(gulp_1.default.dest(deployDir))
        .on('error', console.trace);
}
exports.copyGen = copyGen;
function asyncCopyGen() {
    return new bluebird_1.default(function (resolve) {
        copyGen().once('end', function () {
            resolve(null);
        });
    });
}
exports.asyncCopyGen = asyncCopyGen;
gulp_1.default.task('deploy:copy', copyGen);
function pull(done) {
    return __awaiter(this, void 0, void 0, function () {
        var config, cwd, gh, doPull, clone, submodules, i, sub;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    config = (0, _config_1.getConfig)();
                    cwd = config.deploy.deployDir;
                    gh = config.deploy.github;
                    doPull = function (cwd) { return __awaiter(_this, void 0, void 0, function () {
                        var e_1, e_2;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4, (0, spawn_1.spawnAsync)('git', ['config', 'pull.rebase', 'false'], {
                                            cwd: cwd
                                        })];
                                case 1:
                                    _a.sent();
                                    return [3, 3];
                                case 2:
                                    e_1 = _a.sent();
                                    return [3, 3];
                                case 3:
                                    _a.trys.push([3, 5, , 6]);
                                    logger_1.default.log('pulling', cwd);
                                    return [4, (0, spawn_1.spawnAsync)('git', ['pull', '-X', 'theirs'], {
                                            cwd: cwd,
                                            stdio: 'pipe'
                                        })];
                                case 4:
                                    _a.sent();
                                    return [3, 6];
                                case 5:
                                    e_2 = _a.sent();
                                    logger_1.default.log('cannot pull', cwd);
                                    return [3, 6];
                                case 6: return [2];
                            }
                        });
                    }); };
                    clone = function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!!(0, fs_1.existsSync)(cwd)) return [3, 2];
                                    return [4, (0, spawn_1.spawnAsync)('git', __spreadArray(__spreadArray([], __read('clone -b master --single-branch'.split(' ')), false), [config.deploy.repo, '.deploy_git'], false), {
                                            cwd: __dirname
                                        })];
                                case 1:
                                    _a.sent();
                                    _a.label = 2;
                                case 2: return [2];
                            }
                        });
                    }); };
                    return [4, clone()];
                case 1:
                    _a.sent();
                    doPull(cwd);
                    if (gh) {
                        submodules = gh.submodule.get();
                        for (i = 0; i < submodules.length; i++) {
                            sub = submodules[i];
                            doPull(sub.root);
                        }
                    }
                    done();
                    return [2];
            }
        });
    });
}
function status(done) {
    var github = (0, _config_1.deployConfig)().github;
    if (!github)
        return;
    github.status().then(function (statuses) {
        statuses.map(function (item) {
            var str = '';
            switch (item.changes) {
                case 'deleted':
                    str += ansi_colors_1.default.red(item.changes);
                    break;
                case 'added':
                    str += ansi_colors_1.default.green(item.changes);
                    break;
                case 'modified':
                    str += ansi_colors_1.default.yellow(item.changes);
                    break;
                case 'untracked':
                    str += ansi_colors_1.default.grey(item.changes);
                    break;
                default:
                    str += item.changes;
                    break;
            }
            str += ' ';
            str += item.path;
            logger_1.default.log(str);
        });
        if (typeof done === 'function')
            done();
    });
}
function commit() {
    var github = (0, _config_1.deployConfig)().github;
    if (!github)
        return Promise.resolve(null);
    var now = (0, moment_timezone_1.default)().tz((0, _config_1.getConfig)().timezone).format('LLL');
    var commitRoot = function () {
        return new Promise(function (resolve) {
            github.status().then(function (changes) {
                logger_1.default.log('changes', changes.length, (0, upath_1.toUnix)(github.cwd).replace((0, upath_1.toUnix)(process.cwd()), ''));
                if (changes.length > 0) {
                    github.add('-A').then(function () {
                        github.commit('update site ' + now).then(function () {
                            resolve(null);
                        });
                    });
                }
                else {
                    resolve(null);
                }
            });
        });
    };
    var commitSubmodule = function () {
        var _this = this;
        return new Promise(function (resolve) {
            if (github.submodule.hasSubmodule()) {
                var info_1 = github.submodule.get();
                var commitSubmoduleChild_1 = function (sub) { return __awaiter(_this, void 0, void 0, function () {
                    var submodule, items;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                submodule = new git_command_helper_1.default(sub.root);
                                return [4, submodule.status()];
                            case 1:
                                items = _a.sent();
                                if (!(items.length > 0)) return [3, 4];
                                return [4, submodule.add('-A')];
                            case 2:
                                _a.sent();
                                return [4, submodule.commit("update ".concat(sub.path, " ").concat(now), 'am')];
                            case 3:
                                _a.sent();
                                _a.label = 4;
                            case 4: return [2];
                        }
                    });
                }); };
                var iterate_1 = function () {
                    return new Promise(function (resolveIt) {
                        if (info_1.length === 0)
                            return resolveIt(null);
                        commitSubmoduleChild_1(info_1[0])
                            .catch(noop)
                            .finally(function () {
                            info_1.shift();
                            if (info_1.length > 0)
                                return iterate_1();
                            resolveIt(null);
                        });
                    });
                };
                iterate_1().then(function () {
                    resolve(null);
                });
            }
        });
    };
    return new Promise(function (resolve) {
        commitSubmodule()
            .then(commitRoot)
            .then(function () { return resolve(null); });
    });
}
function noop() {
}
function push() {
    var github = (0, _config_1.deployConfig)().github;
    if (!github) {
        return;
    }
    var submodules = github.submodule.hasSubmodule() ? github.submodule.get() : [];
    var pushSubmodule = function (submodule) {
        var url = submodule.url, branch = submodule.branch, root = submodule.root;
        if (!submodule.github) {
            submodule.github = new git_command_helper_1.default(root);
        }
        var github = submodule.github;
        return new Promise(function (resolvePush) {
            var setR = function () { return github.setremote(url); };
            var setB = function () { return github.setbranch(branch); };
            Promise.all([setR(), setB()]).then(function () {
                github.canPush().then(function (allowed) {
                    logger_1.default.log(workspace(root), 'can push', allowed);
                    if (allowed) {
                        github.push(false, { stdio: 'pipe' }).then(resolvePush);
                    }
                    else {
                        github.status().then(function (changes) {
                            if (changes.length > 0) {
                                logger_1.default.log('submodule', workspace(root), 'changes not staged');
                                resolvePush(null);
                            }
                            else {
                                github.isUpToDate().then(function (updated) {
                                    logger_1.default.log('submodule', workspace(root), 'updated', updated);
                                    resolvePush(null);
                                });
                            }
                        });
                    }
                });
            });
        });
    };
    var iterateSubmodule = function () {
        return new Promise(function (resolve) {
            if (submodules.length === 0) {
                resolve(null);
            }
            else {
                var submodule = submodules.shift();
                if (submodule) {
                    pushSubmodule(submodule).then(function () {
                        if (submodules.length > 0) {
                            iterateSubmodule().then(resolve);
                        }
                        else {
                            resolve(null);
                        }
                    });
                }
                else {
                    resolve(null);
                }
            }
        });
    };
    return new Promise(function (resolve) {
        iterateSubmodule()
            .then(function () {
            return new Promise(function (resolvePush) {
                github.canPush().then(function (allowed) {
                    logger_1.default.log(workspace(github.cwd), 'can push', allowed);
                    if (allowed) {
                        github.push().then(resolvePush);
                    }
                });
            });
        })
            .then(resolve);
    });
}
gulp_1.default.task('deploy:push', push);
gulp_1.default.task('deploy:status', status);
gulp_1.default.task('deploy:commit', commit);
gulp_1.default.task('deploy:pull', pull);
function workspace(str) {
    return (0, upath_1.toUnix)(str).replace((0, upath_1.toUnix)(process.cwd()), '');
}
gulp_1.default.task('deploy', gulp_1.default.series('deploy:pull', 'deploy:copy', 'safelink', 'deploy:commit', 'deploy:push'));
