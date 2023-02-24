"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionFileStore = void 0;
var fs_extra_1 = __importDefault(require("fs-extra"));
var sessionFileHelper = __importStar(require("./session-file-helpers"));
/**
 * https://github.com/expressjs/session#session-store-implementation
 *
 * @param session  express session
 * @return the `FileStore` extending `express`'s session Store
 *
 * @api public
 */
function sessionFileStore(session) {
    var Store = session.Store;
    /**
     * Initialize FileStore with the given `options`
     *
     * @param options (optional)
     *
     * @api public
     */
    var FileStore = /** @class */ (function () {
        function FileStore(options) {
            var self = this;
            // fallback options as empty object
            var opt = options || {};
            Store.call(self, opt);
            this.store = Store;
            self.options = sessionFileHelper.defaults(opt);
            fs_extra_1.default.mkdirsSync(self.options.path);
            sessionFileHelper.scheduleReap(self.options);
            options.reapIntervalObject = self.options.reapIntervalObject;
        }
        /**
         * Attempts to fetch session from a session file by the given `sessionId`
         *
         * @param  {String}   sessionId
         * @param  {Function} callback
         *
         * @api public
         */
        FileStore.prototype.get = function (sessionId, callback) {
            sessionFileHelper.get(sessionId, this.options, callback);
        };
        /**
         * Attempts to commit the given session associated with the given `sessionId` to a session file
         *
         * @param {String}   sessionId
         * @param {Object}   session
         * @param {Function} callback (optional)
         *
         * @api public
         */
        FileStore.prototype.set = function (sessionId, session, callback) {
            sessionFileHelper.set(sessionId, session, this.options, callback);
        };
        /**
         * Touch the given session object associated with the given `sessionId`
         *
         * @param {string} sessionId
         * @param {object} session
         * @param {function} callback
         *
         * @api public
         */
        FileStore.prototype.touch = function (sessionId, session, callback) {
            sessionFileHelper.touch(sessionId, session, this.options, callback);
        };
        /**
         * Attempts to unlink a given session by its id
         *
         * @param  {String}   sessionId   Files are serialized to disk by their
         *                                sessionId
         * @param  {Function} callback
         *
         * @api public
         */
        FileStore.prototype.destroy = function (sessionId, callback) {
            sessionFileHelper.destroy(sessionId, this.options, callback);
        };
        /**
         * Attempts to fetch number of the session files
         *
         * @param  {Function} callback
         *
         * @api public
         */
        FileStore.prototype.length = function (callback) {
            sessionFileHelper.length(this.options, callback);
        };
        /**
         * Attempts to clear out all of the existing session files
         *
         * @param  {Function} callback
         *
         * @api public
         */
        FileStore.prototype.clear = function (callback) {
            sessionFileHelper.clear(this.options, callback);
        };
        /**
         * Attempts to find all of the session files
         *
         * @param  {Function} callback
         *
         * @api public
         */
        FileStore.prototype.list = function (callback) {
            sessionFileHelper.list(this.options, callback);
        };
        /**
         * Attempts to detect whether a session file is already expired or not
         *
         * @param  {String}   sessionId
         * @param  {Function} callback
         *
         * @api public
         */
        FileStore.prototype.expired = function (sessionId, callback) {
            sessionFileHelper.expired(sessionId, this.options, callback);
        };
        return FileStore;
    }());
    /**
     * Inherit from Store
     */
    FileStore.prototype['__proto__'] = Store.prototype;
    return FileStore;
}
exports.sessionFileStore = sessionFileStore;
//# sourceMappingURL=session-file-store.js.map