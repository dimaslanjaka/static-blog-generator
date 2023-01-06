/// <reference types="node" />
import fs from 'fs';
export declare function now(): string;
export declare function shortcodeNow(file: string | fs.PathLike, read: string): string;
export default shortcodeNow;
