'use strict';

var fs = require('fs');
var path = require('path');
var stream = require('stream');

function createDuplexStream() {
    const readStream = fs.createReadStream(path.join(process.cwd(), `tmp/streams/read-${process.pid}.txt`));
    const writeStream = fs.createWriteStream(path.join(process.cwd(), `tmp/streams/write-${process.pid}.txt`));
    const tunnel = new stream.PassThrough(); // simply...
    //tunnel.pipe(writeStream, { end: false }); // pipe without closing the target stream on end
    //closingFunction(tunnel); // this function closes the pipe for me
    console.log(tunnel.writable); // false: the pipe was closed
    console.log(writeStream.writable); // true: the stream is still open
    return readStream.pipe(tunnel).pipe(writeStream);
}

exports.createDuplexStream = createDuplexStream;
