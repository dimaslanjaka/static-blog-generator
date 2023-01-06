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
exports.md5 = exports.md5FileSync = void 0;
var crypto_1 = __importDefault(require("crypto"));
var fs = __importStar(require("fs"));
function md5FileSync(path) {
    var fileBuffer = Buffer.from(path);
    if (fs.existsSync(path)) {
        if (fs.statSync(path).isFile())
            fileBuffer = fs.readFileSync(path);
    }
    var hashSum = crypto_1.default.createHash('md5');
    hashSum.update(fileBuffer);
    return hashSum.digest('hex');
}
exports.md5FileSync = md5FileSync;
function md5(data) {
    return crypto_1.default.createHash('md5').update(data).digest('hex');
}
exports.md5 = md5;
function md5File(path) {
    return new Promise(function (resolve, reject) {
        var output = crypto_1.default.createHash('md5');
        var input = fs.createReadStream(path);
        input.on('error', function (err) {
            reject(err);
        });
        output.once('readable', function () {
            resolve(output.read().toString('hex'));
        });
        input.pipe(output);
    });
}
exports.default = md5File;
