"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectIgnores = exports.commonIgnore = exports.deployConfig = exports.getConfig = exports.setConfig = exports.fetchConfig = void 0;
var tslib_1 = require("tslib");
var fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
var git_command_helper_1 = tslib_1.__importDefault(require("git-command-helper"));
var hexoPostParser = tslib_1.__importStar(require("hexo-post-parser"));
var upath_1 = require("upath");
var yaml_1 = tslib_1.__importDefault(require("yaml"));
var utils = tslib_1.__importStar(require("../utils"));
var defaults = tslib_1.__importStar(require("./defaults"));
var configFileJSON = (0, upath_1.join)(__dirname, '_config.json');
if (!fs_extra_1.default.existsSync(configFileJSON))
    fs_extra_1.default.writeFileSync(configFileJSON, '{}');
var settledConfig = defaults.getDefaultConfig();
/**
 * find `_config.yml`
 * @param fileYML path to file `_config.yml` or working directory
 */
function fetchConfig(fileYML) {
    if (!fileYML.endsWith('_config.yml'))
        fileYML += '/_config.yml';
    if (!fileYML)
        fileYML = (0, upath_1.join)(process.cwd(), '_config.yml');
    var configYML = yaml_1.default.parse(fs_extra_1.default.readFileSync((0, upath_1.resolve)(fileYML), 'utf-8'));
    setConfig(utils.object.orderKeys(configYML));
    utils.filemanager.writefile(configFileJSON, JSON.stringify(configYML, null, 2));
}
exports.fetchConfig = fetchConfig;
// fetch _config.yml first init
// fetchConfig(join(process.cwd(), '_config.yml'));
/**
 * Config setter
 * * useful for jest
 * @param obj
 */
function setConfig(obj) {
    settledConfig = Object.assign(settledConfig || {}, obj);
    // update hexo-post-parser config
    hexoPostParser.setConfig(settledConfig);
    return getConfig();
}
exports.setConfig = setConfig;
/**
 * Config getter
 * * useful for jest
 * @returns
 */
function getConfig() {
    settledConfig.deploy = Object.assign(settledConfig.deploy || {}, deployConfig());
    return settledConfig;
}
exports.getConfig = getConfig;
/**
 * get deployment config
 * @returns
 */
function deployConfig() {
    var _a;
    var deployDir;
    if (settledConfig.deploy_dir) {
        // deploy_dir was set
        deployDir = settledConfig.deploy_dir;
    }
    else {
        // fallback get from deploy.type
        deployDir = (0, upath_1.join)(settledConfig.cwd, '.deploy_' + ((_a = settledConfig.deploy) === null || _a === void 0 ? void 0 : _a.type) || 'git');
    }
    // subfolder - assign deploy.folder
    if (settledConfig.deploy.folder) {
        deployDir = (0, upath_1.join)(deployDir, settledConfig.folder);
    }
    var github = fs_extra_1.default.existsSync(deployDir) ? new git_command_helper_1.default(deployDir) : { submodule: [] };
    return { deployDir: deployDir, github: github };
}
exports.deployConfig = deployConfig;
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
    '**/build/**',
    '**/.cache/**',
    '**/.vscode/**',
    '**/.frontmatter/**',
    '**/pinterest-*.html',
    '**/_*.standalone.{js,ts}',
    '**/desktop.ini',
    '**/node_modules/**',
    '**/.frontmatter/**',
    '**/.git*/**',
    '**/.*' // skip dots
];
/**
 * array of config.exclude, config.ignore
 */
exports.projectIgnores = tslib_1.__spreadArray(tslib_1.__spreadArray([], tslib_1.__read((getConfig().skip_render || [])), false), tslib_1.__read((getConfig().ignore || [])), false);
//# sourceMappingURL=_config.js.map