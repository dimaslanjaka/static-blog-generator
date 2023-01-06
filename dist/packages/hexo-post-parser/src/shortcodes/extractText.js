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
var chalk_1 = __importDefault(require("chalk"));
var fs = __importStar(require("fs"));
var path_1 = __importDefault(require("path"));
var _config_1 = require("../types/_config");
var logname = chalk_1.default.bgMagenta.whiteBright('[extract-text]');
function extractText(file, str) {
    var regex = /<!--\s+?extract-text\s+?(.+?)\s+?-->/gim;
    var m;
    var _loop_1 = function () {
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        var allmatch = m[0];
        var bracketmatch = m[1];
        var directFile = path_1.default.join(path_1.default.dirname(file.toString()), bracketmatch);
        if (fs.existsSync(directFile)) {
            if (_config_1.verbose)
                console.info("".concat(logname, " found from direct ").concat(directFile.replace(process.cwd() + '/', '')));
            var directRead = fs.readFileSync(directFile).toString();
            str = str.replace(allmatch, directRead);
        }
        else {
            if (_config_1.verbose)
                console.info("".concat(logname, " found from workspace ").concat(directFile.replace(process.cwd() + '/', '')));
            var rootFile = path_1.default.join(process.cwd(), bracketmatch);
            if (fs.existsSync(rootFile)) {
                var rootRead_1 = fs.readFileSync(rootFile).toString();
                str = str.replace(allmatch, function () { return rootRead_1; });
            }
        }
    };
    while ((m = regex.exec(str)) !== null) {
        _loop_1();
    }
    return str;
}
exports.extractText = extractText;
exports.default = extractText;
