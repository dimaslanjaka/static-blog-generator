/// <reference types="node/JSON" />
/**
 * json_encode PHP equivalent
 * * support circular refs
 * @param data
 * @returns
 */
export declare function json_encode<T extends Record<string, unknown> | any[]>(data: T, indent?: number): string;
