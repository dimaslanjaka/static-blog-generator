"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rootColor = exports.api = void 0;
const ansi_colors_1 = __importDefault(require("ansi-colors"));
const sbg_api_1 = require("sbg-api");
exports.api = new sbg_api_1.Application(process.cwd());
exports.rootColor = ansi_colors_1.default.bgYellowBright.black('ROOT');
//# sourceMappingURL=env.js.map