/// <reference types="node/json" />
/**
 * json_encode PHP equivalent
 * * support circular refs
 * @param data
 * @returns
 */
export declare function json_encode<T extends Record<string, unknown> | any[] | any>(data: T, indent?: number): string;
/**
 * definitely typed json decode
 * @param data
 * @returns
 */
export declare function json_decode<T extends Record<string, unknown> | any[] | any>(data: string): T;
