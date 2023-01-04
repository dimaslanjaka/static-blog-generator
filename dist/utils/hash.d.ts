/// <reference types="node" />
import crypto from 'crypto';
import fs from 'fs-extra';
export declare function file_to_hash(alogarithm: 'sha1' | 'sha256' | 'sha384' | 'sha512' | 'md5', path: fs.PathLike, encoding?: import('crypto').BinaryToTextEncoding): Promise<unknown>;
export declare function data_to_hash(alogarithm: "sha1" | "sha256" | "sha384" | "sha512" | "md5" | undefined, data: crypto.BinaryLike, encoding?: import('crypto').BinaryToTextEncoding): Promise<unknown>;
export declare function data_to_hash_sync(alogarithm: "sha1" | "sha256" | "sha384" | "sha512" | "md5" | undefined, data: crypto.BinaryLike, encoding?: import('crypto').BinaryToTextEncoding): string;
