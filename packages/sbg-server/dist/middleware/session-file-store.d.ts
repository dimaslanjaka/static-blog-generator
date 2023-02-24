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
         * @param  {String}   sessionId
         * @param  {Function} callback
         *
         * @api public
         */
        get(sessionId: any, callback: any): void;
        /**
         * Attempts to commit the given session associated with the given `sessionId` to a session file
         *
         * @param {String}   sessionId
         * @param {Object}   session
         * @param {Function} callback (optional)
         *
         * @api public
         */
        set(sessionId: any, session: any, callback: any): void;
        /**
         * Touch the given session object associated with the given `sessionId`
         *
         * @param {string} sessionId
         * @param {object} session
         * @param {function} callback
         *
         * @api public
         */
        touch(sessionId: any, session: any, callback: any): void;
        /**
         * Attempts to unlink a given session by its id
         *
         * @param  {String}   sessionId   Files are serialized to disk by their
         *                                sessionId
         * @param  {Function} callback
         *
         * @api public
         */
        destroy(sessionId: any, callback: any): void;
        /**
         * Attempts to fetch number of the session files
         *
         * @param  {Function} callback
         *
         * @api public
         */
        length(callback: any): void;
        /**
         * Attempts to clear out all of the existing session files
         *
         * @param  {Function} callback
         *
         * @api public
         */
        clear(callback: any): void;
        /**
         * Attempts to find all of the session files
         *
         * @param  {Function} callback
         *
         * @api public
         */
        list(callback: any): void;
        /**
         * Attempts to detect whether a session file is already expired or not
         *
         * @param  {String}   sessionId
         * @param  {Function} callback
         *
         * @api public
         */
        expired(sessionId: any, callback: any): void;
    };
};
