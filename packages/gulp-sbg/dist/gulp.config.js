"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const yaml_1 = __importDefault(require("yaml"));
const fileYML = (0, path_1.join)(process.cwd(), '_config.yml');
let parse = {};
if ((0, fs_1.existsSync)(fileYML)) {
    parse = yaml_1.default.parse((0, fs_1.readFileSync)(fileYML, 'utf-8'));
    (0, fs_1.writeFileSync)((0, path_1.join)(__dirname, '_config.json'), JSON.stringify(parse, null, 2));
}
const ProjectConfig = parse;
exports.default = ProjectConfig;
