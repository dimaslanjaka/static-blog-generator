import * as sessionFileHelper from './session-file-helpers';
/**
 * https://github.com/expressjs/session#session-store-implementation
 *
 * @param session  express session
 * @return the `FileStore` extending `express`'s session Store
 *
 * @api public
 */
export declare function sessionFileStore(session: typeof import('express-session')): {
    new (options: ReturnType<typeof sessionFileHelper.defaults>): {
        options: ReturnType<typeof sessionFileHelper.defaults>;
        store: typeof import("express-session").Store;
        /**
         * Attempts to fetch session from a session file by the given `sessionId`
         *
         * @param sessionId
         * @param callback
         *
         * @api public
         */
        get(sessionId: string, callback: (...args: any[]) => any): void;
        /**
         * Attempts to commit the given session associated with the given `sessionId` to a session file
         *
         * @param sessionId
         * @param session
         * @param callback (optional)
         *
         * @api public
         */
        set(sessionId: string, session: any, callback: (...args: any[]) => any): void;
        /**
         * Touch the given session object associated with the given `sessionId`
         *
         * @param sessionId
         * @param session
         * @param callback
         *
         * @api public
         */
        touch(sessionId: string, session: any, callback: (...args: any[]) => any): void;
        /**
         * Attempts to unlink a given session by its id
         *
         * @param    sessionId   Files are serialized to disk by their
         *                                sessionId
         * @param  callback
         *
         * @api public
         */
        destroy(sessionId: string, callback: (...args: any[]) => any): void;
        /**
         * Attempts to fetch number of the session files
         *
         * @param  callback
         *
         * @api public
         */
        length(callback: (...args: any[]) => any): void;
        /**
         * Attempts to clear out all of the existing session files
         *
         * @param  callback
         *
         * @api public
         */
        clear(callback: (...args: any[]) => any): void;
        /**
         * Attempts to find all of the session files
         *
         * @param  callback
         *
         * @api public
         */
        list(callback: (...args: any[]) => any): void;
        /**
         * Attempts to detect whether a session file is already expired or not
         *
         * @param    sessionId
         * @param  callback
         *
         * @api public
         */
        expired(sessionId: string, callback: (...args: any[]) => any): void;
    };
};
