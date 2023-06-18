"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setApi = exports.getApi = exports.rootColor = void 0;
const ansi_colors_1 = __importDefault(require("ansi-colors"));
const sbg_api_1 = require("sbg-api");
let api = new sbg_api_1.Application(process.env.SBG_CWD || process.cwd());
exports.rootColor = ansi_colors_1.default.bgYellowBright.black('ROOT');
function getApi() {
    return api;
}
exports.getApi = getApi;
/**
 * change api cwd
 * @param root
 */
function setApi(root) {
    api = new sbg_api_1.Application(root);
}
exports.setApi = setApi;
//# sourceMappingURL=env.js.map