/**
 * instant indexing using request
 * @param url
 * @param type
 * @param tokens
 * @returns
 */
export declare function notify(url: string, type: string, tokens: import('googleapis').Auth.Credentials): Promise<unknown>;
/**
 * instant indexing using axios
 * @param url
 * @param type
 * @param tokens
 */
export declare function notify2(url: string, type: 'URL_UPDATED' | 'URL_DELETED', tokens: import('googleapis').Auth.Credentials): Promise<void>;
