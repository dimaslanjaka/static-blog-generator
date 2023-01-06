/// <reference types="node" />
import fs from 'fs';
export declare function loopDir(destDir: fs.PathLike | string, debug?: boolean): string[] | undefined;
export declare function copyDir(source: string, dest: string, callback?: (err: any | null) => void): void;
export declare function slash(path: string): string;
export declare const isEmpty: (data: any) => boolean;
export declare function isValidHttpUrl(str: string): any;
