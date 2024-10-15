import fs__default from 'fs';
import path__default from 'path';
import { PassThrough } from 'stream';

function createDuplexStream() {
    const readStream = fs__default.createReadStream(path__default.join(process.cwd(), `tmp/streams/read-${process.pid}.txt`));
    const writeStream = fs__default.createWriteStream(path__default.join(process.cwd(), `tmp/streams/write-${process.pid}.txt`));
    const tunnel = new PassThrough(); // simply...
    //tunnel.pipe(writeStream, { end: false }); // pipe without closing the target stream on end
    //closingFunction(tunnel); // this function closes the pipe for me
    console.log(tunnel.writable); // false: the pipe was closed
    console.log(writeStream.writable); // true: the stream is still open
    return readStream.pipe(tunnel).pipe(writeStream);
}

export { createDuplexStream };
