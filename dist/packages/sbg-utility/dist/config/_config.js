"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
exports.createConfig = exports.projectIgnores = exports.commonIgnore = exports.deployConfig = exports.getConfig = exports.setConfig = exports.fetchConfig = void 0;
var events_1 = __importDefault(require("events"));
var fs_extra_1 = __importDefault(require("fs-extra"));
var git_command_helper_1 = __importDefault(require("git-command-helper"));
var hexoPostParser = __importStar(require("hexo-post-parser"));
var path_1 = require("path");
var yaml_1 = __importDefault(require("yaml"));
var utils = __importStar(require("../utils"));
var fm_1 = require("../utils/fm");
var defaults = __importStar(require("./defaults"));
var settledConfig = defaults.getDefaultConfig();
function fetchConfig(fileYML) {
    if (!fileYML.endsWith('_config.yml'))
        fileYML += '/_config.yml';
    if (fs_extra_1.default.existsSync(fileYML)) {
        var configYML = yaml_1.default.parse(fs_extra_1.default.readFileSync(fileYML, 'utf-8'));
        setConfig(utils.object.orderKeys(configYML));
        utils.filemanager.writefile((0, path_1.join)(__dirname, '_config.json'), JSON.stringify(configYML, null, 2));
    }
}
exports.fetchConfig = fetchConfig;
// fetch _config.yml first init
fetchConfig((0, path_1.join)(process.cwd(), '_config.yml'));
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
    //const deployDir = join(settledConfig.cwd, '.deploy_' + settledConfig.deploy?.type || 'git');
    return settledConfig;
}
exports.getConfig = getConfig;
function deployConfig() {
    var _a;
    var deployDir = (0, path_1.join)(settledConfig.cwd, '.deploy_' + ((_a = settledConfig.deploy) === null || _a === void 0 ? void 0 : _a.type) || 'git');
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
exports.projectIgnores = __spreadArray(__spreadArray([], __read((getConfig().skip_render || [])), false), __read((getConfig().ignore || [])), false);
var configWrapperFile = (0, path_1.join)(__dirname, '_config_wrapper.json');
var configWrapper = fs_extra_1.default.existsSync(fs_extra_1.default.readFileSync(configWrapperFile, 'utf-8'))
    ? JSON.parse(configWrapperFile)
    : {};
/**
 * Create/Update config wrapper
 * @param name
 * @param value
 * @returns
 */
var createConfig = /** @class */ (function (_super) {
    __extends(createConfig, _super);
    function createConfig(name, value) {
        var _this = _super.call(this) || this;
        // assign config name
        _this.cname = name;
        // add config
        if (!configWrapper[name]) {
            configWrapper[name] = value;
            _this.emit('add', value);
        }
        else {
            // update config
            _this.update(value);
        }
        return _this;
    }
    createConfig.prototype.get = function () {
        return configWrapper[this.cname];
    };
    createConfig.prototype.update = function (value) {
        configWrapper[this.cname] = Object.assign(configWrapper[this.cname], value);
        if ((fs_extra_1.default.access(configWrapperFile), fs_extra_1.default.constants.W_OK)) {
            (0, fm_1.writefile)(configWrapperFile, JSON.stringify(configWrapper, null, 2));
            this.emit('update');
        }
    };
    return createConfig;
}(events_1.default));
exports.createConfig = createConfig;
//# sourceMappingURL=_config.js.map