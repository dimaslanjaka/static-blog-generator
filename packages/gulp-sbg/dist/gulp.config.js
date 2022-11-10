"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commonIgnore = exports.deployConfig = void 0;
var fs_1 = require("fs");
var git_command_helper_1 = require("git-command-helper");
var path_1 = require("path");
var yaml_1 = __importDefault(require("yaml"));
var fileYML = (0, path_1.join)(process.cwd(), '_config.yml');
var parse = {};
if ((0, fs_1.existsSync)(fileYML)) {
    parse = yaml_1.default.parse((0, fs_1.readFileSync)(fileYML, 'utf-8'));
    (0, fs_1.writeFileSync)((0, path_1.join)(__dirname, '_config.json'), JSON.stringify(parse, null, 2));
}
var ProjectConfig = parse;
exports.default = ProjectConfig;
function deployConfig() {
    var deployDir = (0, path_1.join)(process.cwd(), '.deploy_git');
    var config = ProjectConfig;
    var github = new git_command_helper_1.gitCommandHelper(deployDir);
    return { deployDir: deployDir, config: config, github: github };
}
exports.deployConfig = deployConfig;
exports.commonIgnore = [
    '**/yandex_*.html',
    '**/comments.html',
    '**/disqus-comments.html',
    '**/comment.html',
    '**/favicon.html',
    '**/404.html',
    '**/node_modules/**',
    '**/tmp/**',
    '**/.cache/**',
    '**/.vscode/**',
    '**/pinterest-*.html'
];
