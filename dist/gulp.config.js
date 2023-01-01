"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commonIgnore = exports.deployConfig = exports.getConfig = exports.setConfig = void 0;
var tslib_1 = require("tslib");
var deepmerge_ts_1 = require("deepmerge-ts");
var fs_1 = require("fs");
var git_command_helper_1 = tslib_1.__importDefault(require("git-command-helper"));
var path_1 = require("path");
var true_case_path_1 = tslib_1.__importDefault(require("true-case-path"));
var upath_1 = require("upath");
var yaml_1 = tslib_1.__importDefault(require("yaml"));
var defaults_1 = require("./defaults");
var fm_1 = require("./utils/fm");
var settledConfig = (0, defaults_1.getDefaultConfig)();
function setConfig(obj) {
    settledConfig = (0, deepmerge_ts_1.deepmerge)({}, settledConfig, obj);
    return getConfig(false);
}
exports.setConfig = setConfig;
function getConfig(get) {
    if (get === void 0) { get = true; }
    if (get) {
        var fileYML = '';
        if (settledConfig && 'cwd' in settledConfig) {
            fileYML = (0, path_1.join)(settledConfig.cwd, '_config.yml');
            settledConfig.cwd = (0, upath_1.toUnix)(true_case_path_1.default.trueCasePathSync(settledConfig.cwd));
        }
        else {
            fileYML = (0, path_1.join)(process.cwd(), '_config.yml');
            settledConfig.cwd = (0, upath_1.toUnix)(true_case_path_1.default.trueCasePathSync(process.cwd()));
        }
        if ((0, fs_1.existsSync)(fileYML)) {
            var configYML = yaml_1.default.parse((0, fs_1.readFileSync)(fileYML, 'utf-8'));
            settledConfig = Object.assign({}, configYML, settledConfig);
            (0, fm_1.writefile)((0, path_1.join)(__dirname, '_config.json'), JSON.stringify(configYML, null, 2));
        }
        else {
            throw new Error('_config.yml not found');
        }
    }
    settledConfig.deploy = Object.assign(settledConfig.deploy || {}, deployConfig());
    return settledConfig;
}
exports.getConfig = getConfig;
function deployConfig() {
    var _a;
    var deployDir = (0, path_1.join)(settledConfig.cwd, '.deploy_' + ((_a = settledConfig.deploy) === null || _a === void 0 ? void 0 : _a.type) || 'git');
    var github = (0, fs_1.existsSync)(deployDir) ? new git_command_helper_1.default(deployDir) : null;
    return { deployDir: deployDir, github: github };
}
exports.deployConfig = deployConfig;
exports.commonIgnore = [
    '**/yandex_*.html',
    '**/favicon.html',
    '**/404.html',
    '**/node_modules/**',
    '**/tmp/**',
    '**/.cache/**',
    '**/.vscode/**',
    '**/.frontmatter/**',
    '**/pinterest-*.html',
    '**/_*.standalone.{js,ts}',
    '**/desktop.ini',
    '**/node_modules/**',
    '**/.frontmatter/**',
    '**/.git*/**'
];
