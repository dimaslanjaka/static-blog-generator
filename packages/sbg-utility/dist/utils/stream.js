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
    var readStream = fs_1.default.createReadStream(path_1.default.join(process.cwd(), "tmp/streams/read-".concat(process.pid, ".txt")));
    var writeStream = fs_1.default.createWriteStream(path_1.default.join(process.cwd(), "tmp/streams/write-".concat(process.pid, ".txt")));
    var tunnel = new stream_1.PassThrough(); // simply...
    //tunnel.pipe(writeStream, { end: false }); // pipe without closing the target stream on end
    //closingFunction(tunnel); // this function closes the pipe for me
    console.log(tunnel.writable); // false: the pipe was closed
    console.log(writeStream.writable); // true: the stream is still open
    return readStream.pipe(tunnel).pipe(writeStream);
}
exports.createDuplexStream = createDuplexStream;
//# sourceMappingURL=stream.js.map