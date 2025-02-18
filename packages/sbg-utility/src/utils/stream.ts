import fs from 'fs';
import path from 'path';
import { PassThrough } from 'stream';
import Logger from './logger';

export function createDuplexStream() {
  const readStream = fs.createReadStream(path.join(process.cwd(), `tmp/streams/read-${process.pid}.txt`));
  const writeStream = fs.createWriteStream(path.join(process.cwd(), `tmp/streams/write-${process.pid}.txt`));
  const tunnel = new PassThrough(); // simply...

  //tunnel.pipe(writeStream, { end: false }); // pipe without closing the target stream on end
  //closingFunction(tunnel); // this function closes the pipe for me

  Logger.log(tunnel.writable); // false: the pipe was closed
  Logger.log(writeStream.writable); // true: the stream is still open
  return readStream.pipe(tunnel).pipe(writeStream);
}
