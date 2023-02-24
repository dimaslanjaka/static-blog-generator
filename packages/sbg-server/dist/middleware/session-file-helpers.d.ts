declare const configs: {
    path: string;
    ttl: number;
    retries: number;
    factor: number;
    minTimeout: number;
    maxTimeout: number;
    reapInterval: number;
    reapMaxConcurrent: number;
    reapAsync: boolean;
    reapSyncFallback: boolean;
    logFn: {
        (...data: any[]): void;
        (message?: any, ...optionalParams: any[]): void;
    };
    encoding: string;
    encoder: {
        (value: any, replacer?: (this: any, key: string, value: any) => any, space?: string | number): string;
        (value: any, replacer?: (string | number)[], space?: string | number): string;
    };
    decoder: (text: string, reviver?: (this: any, key: string, value: any) => any) => any;
    encryptEncoding: string;
    fileExtension: string;
    filePattern: any;
    crypto: {
        algorithm: string;
        hashing: string;
        use_scrypt: boolean;
    };
    keyFunction: (secret: string, sessionId: string) => string;
};
export type sessionFileStoreConfig = typeof configs & Record<string, any>;
export declare function isSecret(secret: any): boolean;
export declare function sessionPath(options: sessionFileStoreConfig, sessionId: string): string;
export declare function sessionId(options: sessionFileStoreConfig, file: string): string;
export declare function getLastAccess(session: Record<string, any>): any;
export declare function setLastAccess(session: Record<string, any>): void;
export declare function escapeForRegExp(str: string): string;
export declare function getFilePatternFromFileExtension(fileExtension: any): RegExp;
export declare function defaults(userOptions: Partial<sessionFileStoreConfig>): {
    path: string;
    ttl: number;
    retries: number;
    factor: number;
    minTimeout: number;
    maxTimeout: number;
    reapInterval: number;
    reapMaxConcurrent: number;
    reapAsync: boolean;
    reapSyncFallback: boolean;
    logFn: {
        (...data: any[]): void;
        (message?: any, ...optionalParams: any[]): void;
    };
    encoding: string;
    encoder: {
        (value: any, replacer?: (this: any, key: string, value: any) => any, space?: string | number): string;
        (value: any, replacer?: (string | number)[], space?: string | number): string;
    };
    decoder: (text: string, reviver?: (this: any, key: string, value: any) => any) => any;
    encryptEncoding: string;
    fileExtension: string;
    filePattern: any;
    crypto: {
        algorithm: string;
        hashing: string;
        use_scrypt: boolean;
    };
    keyFunction: (secret: string, sessionId: string) => string;
} & Partial<sessionFileStoreConfig>;
export declare function destroyIfExpired(sessionId: any, options: any, callback: any): void;
export declare function scheduleReap(options: sessionFileStoreConfig): void;
export declare function asyncReap(options: sessionFileStoreConfig, callback?: (...args: any[]) => any): void;
export declare function reap(options: sessionFileStoreConfig, callback?: (...args: any[]) => any): void;
/**
 * Attempts to fetch session from a session file by the given `sessionId`
 *
 * @param    sessionId
 * @param     options
 * @param callback
 *
 * @api public
 */
export declare function get(sessionId: string, options: sessionFileStoreConfig, callback: (...args: any[]) => any): void;
/**
 * Attempts to commit the given `session` associated with the given `sessionId` to a session file
 *
 * @param {String}   sessionId
 * @param {Object}   session
 * @param  {Object}  options
 * @param {Function} callback (optional)
 *
 * @api public
 */
export declare function set(sessionId: any, session: any, options: any, callback: any): void;
/**
 * Update the last access time and the cookie of given `session` associated with the given `sessionId` in session file.
 * Note: Do not change any other session data.
 *
 * @param {String}   sessionId
 * @param {Object}   session
 * @param {Object}   options
 * @param {Function} callback (optional)
 *
 * @api public
 */
export declare function touch(sessionId: any, session: any, options: any, callback: any): void;
/**
 * Attempts to unlink a given session by its id
 *
 * @param  {String}   sessionId   Files are serialized to disk by their sessionId
 * @param  {Object}   options
 * @param  {Function} callback
 *
 * @api public
 */
export declare function destroy(sessionId: any, options: any, callback: any): void;
/**
 * Attempts to fetch number of the session files
 *
 * @param  {Object}   options
 * @param  {Function} callback
 *
 * @api public
 */
export declare function length(options: any, callback: any): void;
/**
 * Attempts to clear out all of the existing session files
 *
 * @param  {Object}   options
 * @param  {Function} callback
 *
 * @api public
 */
export declare function clear(options: any, callback: any): void;
/**
 * Attempts to find all of the session files
 *
 * @param  {Object}   options
 * @param  {Function} callback
 *
 * @api public
 */
export declare function list(options: any, callback: any): void;
/**
 * Attempts to detect whether a session file is already expired or not
 *
 * @param  {String}   sessionId
 * @param  {Object}   options
 * @param  {Function} callback
 *
 * @api public
 */
export declare function expired(sessionId: any, options: any, callback: any): void;
export declare function isExpired(session: any, options: any): boolean;
export declare function encrypt(options: any, data: any, _sessionId: any): any;
export declare function decrypt(options: any, data: any, _sessionId: any): any;
export {};
