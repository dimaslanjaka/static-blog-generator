"use strict";
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
exports.projectIgnores = exports.commonIgnore = exports.deployConfig = exports.getConfig = exports.setConfig = void 0;
var fs_1 = require("fs");
var git_command_helper_1 = __importDefault(require("git-command-helper"));
var hexoPostParser = __importStar(require("hexo-post-parser"));
var path_1 = require("path");
var yaml_1 = __importDefault(require("yaml"));
var defaults_1 = require("./defaults");
var debug_1 = __importDefault(require("./utils/debug"));
var fm_1 = require("./utils/fm");
var object_1 = require("./utils/object");
var settledConfig = (0, defaults_1.getDefaultConfig)();
var fetched = {};
var fileYML = (0, path_1.join)(process.cwd(), '_config.yml');
var loadYml = function () {
    var _a;
    if ((0, fs_1.existsSync)(fileYML) && !fetched[fileYML]) {
        fetched[fileYML] = true;
        var configYML = yaml_1.default.parse((0, fs_1.readFileSync)(fileYML, 'utf-8'));
        settledConfig = Object.assign({}, configYML, settledConfig);
        settledConfig = (0, object_1.orderKeys)(settledConfig);
        hexoPostParser.setConfig(settledConfig);
        (0, debug_1.default)('config').extend('changed')((_a = new Error().stack) === null || _a === void 0 ? void 0 : _a.split(/\r?\n/gm).filter(function (str) {
            return !str.includes('node:internal');
        }).join('\n'));
        (0, fm_1.writefile)((0, path_1.join)(__dirname, '_config.json'), JSON.stringify(configYML, null, 2));
    }
};
loadYml();
function setConfig(obj) {
    settledConfig = Object.assign({}, settledConfig, obj);
    return getConfig();
}
exports.setConfig = setConfig;
function getConfig(customFolder) {
    if (typeof customFolder === 'string') {
        fileYML = (0, path_1.join)(customFolder, '_config.yml');
        loadYml();
        fetched[fileYML] = true;
    }
    settledConfig.deploy = Object.assign(settledConfig.deploy || {}, deployConfig());
    return settledConfig;
}
exports.getConfig = getConfig;
if (!fetched)
    getConfig();
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
    '**/.*'
];
exports.projectIgnores = __spreadArray(__spreadArray([], __read((getConfig().skip_render || [])), false), __read((getConfig().ignore || [])), false);
