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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deployConfig = void 0;
const ansi_colors_1 = __importDefault(require("ansi-colors"));
const fs_1 = require("fs");
const git_command_helper_1 = require("git-command-helper");
const gulp_1 = __importDefault(require("gulp"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const upath_1 = require("upath");
const gulp_config_1 = __importDefault(require("./gulp.config"));
function pull() {
    return new Promise((resolve) => {
        const { deployDir, github, config } = deployConfig();
        github
            .setremote(config.deploy.repo)
            .then(() => {
            return new Promise((resolveInit) => {
                if (!(0, fs_1.existsSync)(deployDir)) {
                    github.init().then(resolveInit);
                }
                else {
                    resolveInit(null);
                }
            });
        })
            .then(() => github.setuser(config.deploy.username))
            .then(() => github.setemail(config.deploy.email))
            // reset repository to latest commit
            .then(() => github.reset(config.deploy.branch))
            // pull any changes inside submodule from their latest commit
            .then(() => {
            github.pull(['--recurse-submodule']).then(() => {
                if (github.submodule.hasSubmodule()) {
                    console.log('safe update submodule');
                    github.submodule.safeUpdate(true).then(resolve);
                }
                else {
                    resolve(null);
                }
            });
        });
    });
}
function status(done) {
    const { github } = deployConfig();
    github.status().then((statuses) => {
        statuses.map((item) => {
            let str = '';
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
            console.log(str);
        });
        if (typeof done === 'function')
            done();
    });
}
function commit() {
    const { github, config } = deployConfig();
    const now = (0, moment_timezone_1.default)().tz(config.timezone).format('LLL');
    const commitRoot = function () {
        return new Promise((resolve) => {
            github.status().then((changes) => {
                console.log('changes', changes.length, (0, upath_1.toUnix)(github.cwd).replace((0, upath_1.toUnix)(process.cwd()), ''));
                if (changes.length > 0) {
                    github.add('-A').then(() => {
                        github.commit('update site ' + now).then(() => {
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
    const commitSubmodule = function () {
        return new Promise((resolve) => {
            if (github.submodule.hasSubmodule()) {
                const info = github.submodule.get();
                const commitSubmoduleChild = (sub) => __awaiter(this, void 0, void 0, function* () {
                    const submodule = new git_command_helper_1.gitHelper(sub.root);
                    const items = yield submodule.status();
                    if (items.length > 0) {
                        yield submodule.add('-A');
                        yield submodule.commit(`update ${sub.path} ${now}`, 'am');
                    }
                });
                const iterate = function () {
                    return new Promise((resolveIt) => {
                        // resolve directly when submodule items no made changes
                        if (info.length === 0)
                            return resolveIt(null);
                        commitSubmoduleChild(info[0])
                            .catch(noop)
                            .finally(() => {
                            info.shift();
                            // re-iterate when submodule items not committed
                            if (info.length > 0)
                                return iterate();
                            // resolves all
                            resolveIt(null);
                        });
                    });
                };
                iterate().then(() => {
                    resolve(null);
                });
            }
        });
    };
    return new Promise((resolve) => {
        commitSubmodule()
            .then(commitRoot)
            .then(() => resolve(null));
    });
}
function noop() {
    //
}
function push() {
    const { github } = deployConfig();
    const submodules = github.submodule.hasSubmodule() ? github.submodule.get() : [];
    const pushSubmodule = function (submodule) {
        const { url, branch, root } = submodule;
        if (!submodule.github) {
            submodule.github = new git_command_helper_1.gitHelper(root);
        }
        const { github } = submodule;
        return new Promise((resolvePush) => {
            const setR = () => github.setremote(url);
            const setB = () => github.setbranch(branch);
            Promise.all([setR(), setB()]).then(() => {
                github.canPush().then((allowed) => {
                    console.log(workspace(root), 'can push', allowed);
                    if (allowed) {
                        // push then resolve
                        github.push(false, { stdio: 'pipe' }).then(resolvePush);
                    }
                    else {
                        github.status().then((changes) => {
                            if (changes.length > 0) {
                                console.log('submodule', workspace(root), 'changes not staged');
                                // resolve changes not staged
                                resolvePush(null);
                            }
                            else {
                                github.isUpToDate().then((updated) => {
                                    console.log('submodule', workspace(root), 'updated', updated);
                                    // resolve is up to date
                                    resolvePush(null);
                                });
                            }
                        });
                    }
                });
            });
        });
    };
    const iterateSubmodule = function () {
        return new Promise((resolve) => {
            if (submodules.length === 0) {
                resolve(null);
            }
            else {
                pushSubmodule(submodules.shift()).then(() => {
                    if (submodules.length > 0) {
                        iterateSubmodule().then(resolve);
                    }
                    else {
                        resolve(null);
                    }
                });
            }
        });
    };
    return new Promise((resolve) => {
        iterateSubmodule()
            .then(function () {
            return new Promise((resolvePush) => {
                github.canPush().then((allowed) => {
                    console.log(workspace(github.cwd), 'can push', allowed);
                    if (allowed) {
                        github.push().then(resolvePush);
                    }
                });
            });
        })
            .then(resolve);
        //pushSubmodule(submodules[1]).then(resolve);
    });
}
gulp_1.default.task('push', push);
gulp_1.default.task('status', status);
gulp_1.default.task('commit', commit);
gulp_1.default.task('pull', pull);
function deployConfig() {
    const deployDir = (0, upath_1.join)(process.cwd(), '.deploy_git');
    const config = gulp_config_1.default;
    const github = new git_command_helper_1.gitHelper(deployDir);
    return { deployDir, config, github };
}
exports.deployConfig = deployConfig;
/**
 * get relative path from workspace
 * @param str
 * @returns
 */
function workspace(str) {
    return (0, upath_1.toUnix)(str).replace((0, upath_1.toUnix)(process.cwd()), '');
}
