"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = require("path");
var yaml_1 = __importDefault(require("yaml"));
var fileYML = (0, path_1.join)(process.cwd(), '_config.yml');
var parse = {};
if ((0, fs_1.existsSync)(fileYML)) {
    parse = yaml_1.default.parse((0, fs_1.readFileSync)(fileYML, 'utf-8'));
    (0, fs_1.writeFileSync)((0, path_1.join)(__dirname, '_config.json'), JSON.stringify(parse));
}
var ProjectConfig = parse;
exports.default = ProjectConfig;
