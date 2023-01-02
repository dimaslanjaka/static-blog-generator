"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultConfigYaml = exports.getDefaultConfig = void 0;
var fs_1 = require("fs");
var upath_1 = require("upath");
var yaml_1 = __importDefault(require("yaml"));
function getDefaultConfig() {
    var defaultConfig = { post_dir: 'src-posts', cwd: (0, upath_1.toUnix)(process.cwd()) };
    var configYML = yaml_1.default.parse(getDefaultConfigYaml());
    return Object.assign(defaultConfig, configYML);
}
exports.getDefaultConfig = getDefaultConfig;
function getDefaultConfigYaml() {
    return (0, fs_1.readFileSync)((0, upath_1.join)(__dirname, '_config.yml'), 'utf-8');
}
exports.getDefaultConfigYaml = getDefaultConfigYaml;
