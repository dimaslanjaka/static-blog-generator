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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractText = void 0;
const chalk_1 = __importDefault(require("chalk"));
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
const _config_1 = require("../types/_config");
const logname = chalk_1.default.bgMagenta.whiteBright('[extract-text]');
function extractText(file, str) {
    const config = (0, _config_1.getConfig)();
    const regex = /<!--\s+?extract-text\s+?(.+?)\s+?-->/gim;
    let m;
    while ((m = regex.exec(str)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        const allmatch = m[0];
        const bracketmatch = m[1];
        //console.info(logname, allmatch, bracketmatch);
        // search from file directory
        const directFile = path_1.default.join(path_1.default.dirname(file.toString()), bracketmatch);
        if (fs.existsSync(directFile)) {
            if (config.generator.verbose)
                console.info(`${logname} found from direct ${directFile.replace(process.cwd() + '/', '')}`);
            const directRead = fs.readFileSync(directFile).toString();
            str = str.replace(allmatch, directRead);
        }
        else {
            // search from workspace directory
            if (config.generator.verbose) {
                console.info(`${logname} found from workspace ${directFile.replace(process.cwd() + '/', '')}`);
            }
            const rootFile = path_1.default.join(process.cwd(), bracketmatch);
            if (fs.existsSync(rootFile)) {
                const rootRead = fs.readFileSync(rootFile).toString();
                str = str.replace(allmatch, () => rootRead);
            }
        }
    }
    return str;
}
exports.extractText = extractText;
exports.default = extractText;
//# sourceMappingURL=extractText.js.map