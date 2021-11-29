import Promise from 'bluebird';
import { CurlyResult } from 'node-libcurl';
export declare function get(url: string): Promise<CurlyResult>;
