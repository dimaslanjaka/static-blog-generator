"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commonIgnore = exports.deployConfig = exports.getConfig = exports.setConfig = void 0;
var tslib_1 = require("tslib");
var fs_1 = require("fs");
var git_command_helper_1 = tslib_1.__importDefault(require("git-command-helper"));
var path_1 = require("path");
var yaml_1 = tslib_1.__importDefault(require("yaml"));
var defaults_1 = require("./defaults");
var fm_1 = require("./utils/fm");
var settledConfig = (0, defaults_1.getDefaultConfig)();
function setConfig(obj) {
    settledConfig = Object.assign({}, settledConfig, obj);
    return getConfig();
}
exports.setConfig = setConfig;
function getConfig() {
    if (Object.keys(settledConfig).length < 5) {
        var fileYML = '';
        if (settledConfig && 'cwd' in settledConfig) {
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
    var github = new git_command_helper_1.default(deployDir);
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
