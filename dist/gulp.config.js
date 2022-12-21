"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.commonIgnore = exports.getConfig = exports.setConfig = exports.deployConfig = exports.deployDir = void 0;
var tslib_1 = require("tslib");
var fs_1 = require("fs");
var git_command_helper_1 = tslib_1.__importDefault(require("git-command-helper"));
var path_1 = require("path");
var yaml_1 = tslib_1.__importDefault(require("yaml"));
var defaults_1 = require("./defaults");
var fm_1 = require("./utils/fm");
exports.deployDir = (0, path_1.join)(getConfig().cwd, '.deploy_' + ((_a = getConfig().deploy) === null || _a === void 0 ? void 0 : _a.type) || 'git');
function deployConfig() {
    var config = getConfig().deploy || {};
    var github = new git_command_helper_1.default(exports.deployDir);
    return { deployDir: exports.deployDir, config: config, github: github };
}
exports.deployConfig = deployConfig;
var settledConfig = (0, defaults_1.getDefaultConfig)();
function setConfig(obj) {
    settledConfig = Object.assign({}, settledConfig, obj);
    return getConfig();
}
exports.setConfig = setConfig;
function getConfig() {
    var fileYML = '';
    if ('cwd' in settledConfig) {
        fileYML = (0, path_1.join)(settledConfig.cwd, '_config.yml');
    }
    else {
        fileYML = (0, path_1.join)(process.cwd(), '_config.yml');
    }
    if ((0, fs_1.existsSync)(fileYML)) {
        var configYML = yaml_1.default.parse((0, fs_1.readFileSync)(fileYML, 'utf-8'));
        settledConfig = Object.assign({}, configYML, settledConfig);
        (0, fm_1.writefile)((0, path_1.join)(__dirname, '_config.json'), JSON.stringify(configYML, null, 2));
    }
    return settledConfig;
}
exports.getConfig = getConfig;
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
