/// <reference types="node" />
import * as fs from 'fs-extra';
/**
 * create writestream (auto create dirname)
 * @param dest
 * @param options
 * @returns
 */
export declare function createWriteStream(dest: string, options?: Parameters<(typeof fs)['createWriteStream']>[1]): fs.WriteStream;
