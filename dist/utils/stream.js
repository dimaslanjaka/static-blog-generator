"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDuplexStream = void 0;
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var stream_1 = require("stream");
function createDuplexStream() {
    var readStream = fs_1.default.createReadStream(path_1.default.join(process.cwd(), "build/streams/read-".concat(process.pid, ".txt")));
    var writeStream = fs_1.default.createWriteStream(path_1.default.join(process.cwd(), "build/streams/write-".concat(process.pid, ".txt")));
    var tunnel = new stream_1.PassThrough();
    console.log(tunnel.writable);
    console.log(writeStream.writable);
    return readStream.pipe(tunnel).pipe(writeStream);
}
exports.createDuplexStream = createDuplexStream;
