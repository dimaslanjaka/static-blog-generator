/// <reference types="node/JSON" />
/**
 * json_encode PHP equivalent
 * * support circular refs
 * @param data
 * @returns
 */
export declare function json_encode(data: Record<string, unknown>, indent?: number): string;
