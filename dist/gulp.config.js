"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.commonIgnore = exports.getConfig = exports.setConfig = exports.deployConfig = exports.deployDir = void 0;
var fs_1 = require("fs");
var git_command_helper_1 = __importDefault(require("git-command-helper"));
var path_1 = require("path");
var upath_1 = require("upath");
var yaml_1 = __importDefault(require("yaml"));
var fm_1 = require("./utils/fm");
var originalConfig = {};
// auto parse _config.yml from process.cwd()
var fileYML = (0, path_1.join)(process.cwd(), '_config.yml');
if ((0, fs_1.existsSync)(fileYML)) {
    originalConfig = yaml_1.default.parse((0, fs_1.readFileSync)(fileYML, 'utf-8'));
    (0, fm_1.writefile)((0, path_1.join)(__dirname, '_config.json'), JSON.stringify(originalConfig, null, 2));
}
var ProjectConfig = Object.assign({ post_dir: 'src-posts', cwd: (0, upath_1.toUnix)(process.cwd()) }, originalConfig);
(0, fm_1.writefile)((0, path_1.join)(__dirname, '_config.auto-generated.json'), JSON.stringify(Object.assign({}, ProjectConfig, { fileYML: fileYML }), null, 2));
exports.default = ProjectConfig;
exports.deployDir = (0, path_1.join)(ProjectConfig.cwd, '.deploy_' + ((_a = ProjectConfig.deploy) === null || _a === void 0 ? void 0 : _a.type) || 'git');
function deployConfig() {
    var config = ProjectConfig.deploy || {};
    var github = new git_command_helper_1.default(exports.deployDir);
    return { deployDir: exports.deployDir, config: config, github: github };
}
exports.deployConfig = deployConfig;
var settledConfig = ProjectConfig;
/**
 * Config setter
 * * useful for jest
 * @param obj
 */
function setConfig(obj) {
    settledConfig = Object.assign({}, settledConfig, obj);
    return getConfig();
}
exports.setConfig = setConfig;
/**
 * Config getter
 * * useful for jest
 * @returns
 */
function getConfig() {
    if ('cwd' in settledConfig) {
        var fileYML_1 = (0, path_1.join)(settledConfig.cwd, '_config.yml');
        if ((0, fs_1.existsSync)(fileYML_1)) {
            var configYML = yaml_1.default.parse((0, fs_1.readFileSync)(fileYML_1, 'utf-8'));
            settledConfig = Object.assign({}, configYML, settledConfig);
            (0, fm_1.writefile)((0, path_1.join)(__dirname, '_config.json'), JSON.stringify(configYML, null, 2));
        }
    }
    //const deployDir = join(settledConfig.cwd, '.deploy_' + settledConfig.deploy?.type || 'git');
    return settledConfig;
}
exports.getConfig = getConfig;
/**
 * common ignore files
 * @example
 * const config = getConfig();
 * const excludes = Array.isArray(config.exclude) ? config.exclude : [];
 * excludes.push(...commonIgnore);
 */
exports.commonIgnore = [
    '**/yandex_*.html',
    // '**/comments.html',
    // '**/disqus-comments.html',
    // '**/comment.html', // skip comment.html
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
    '**/.git*/**' // any git configs
];
