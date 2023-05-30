import fs from 'fs-extra';
import * as sessionFileHelper from './session-file-helpers';

/**
 * https://github.com/expressjs/session#session-store-implementation
 *
 * @param session  express session
 * @return the `FileStore` extending `express`'s session Store
 *
 * @api public
 */
export function sessionFileStore(session: typeof import('express-session')) {
  const Store = session.Store;
  type implStore = Partial<typeof Store> & {
    options: Record<string, any>;
  };

  /**
   * Initialize FileStore with the given `options`
   *
   * @param options (optional)
   *
   * @api public
   */
  class FileStore implements implStore {
    options: ReturnType<typeof sessionFileHelper.defaults>;
    store: typeof Store;
    constructor(options: ReturnType<typeof sessionFileHelper.defaults>) {
      const self = this;

      // fallback options as empty object
      const opt = options || ({} as typeof options);
      if (!fs.existsSync(opt.path)) {
        fs.mkdirSync(opt.path, { recursive: true });
      }

      // call session store
      Store.call(self, opt);
      this.store = Store;

      self.options = sessionFileHelper.defaults(opt);
      fs.mkdirsSync(self.options.path);
      sessionFileHelper.scheduleReap(self.options);
      options.reapIntervalObject = self.options.reapIntervalObject;
    }
    /**
     * Attempts to fetch session from a session file by the given `sessionId`
     *
     * @param sessionId
     * @param callback
     *
     * @api public
     */
    get(sessionId: string, callback: (...args: any[]) => any) {
      sessionFileHelper.get(sessionId, this.options, callback);
    }
    /**
     * Attempts to commit the given session associated with the given `sessionId` to a session file
     *
     * @param sessionId
     * @param session
     * @param callback (optional)
     *
     * @api public
     */
    set(sessionId: string, session, callback: (...args: any[]) => any) {
      sessionFileHelper.set(sessionId, session, this.options, callback);
    }

    /**
     * Touch the given session object associated with the given `sessionId`
     *
     * @param sessionId
     * @param session
     * @param callback
     *
     * @api public
     */
    touch(sessionId: string, session, callback: (...args: any[]) => any) {
      sessionFileHelper.touch(sessionId, session, this.options, callback);
    }

    /**
     * Attempts to unlink a given session by its id
     *
     * @param    sessionId   Files are serialized to disk by their
     *                                sessionId
     * @param  callback
     *
     * @api public
     */
    destroy(sessionId: string, callback: (...args: any[]) => any) {
      sessionFileHelper.destroy(sessionId, this.options, callback);
    }

    /**
     * Attempts to fetch number of the session files
     *
     * @param  callback
     *
     * @api public
     */
    length(callback: (...args: any[]) => any) {
      sessionFileHelper.length(this.options, callback);
    }

    /**
     * Attempts to clear out all of the existing session files
     *
     * @param  callback
     *
     * @api public
     */
    clear(callback: (...args: any[]) => any) {
      sessionFileHelper.clear(this.options, callback);
    }

    /**
     * Attempts to find all of the session files
     *
     * @param  callback
     *
     * @api public
     */
    list(callback: (...args: any[]) => any) {
      sessionFileHelper.list(this.options, callback);
    }

    /**
     * Attempts to detect whether a session file is already expired or not
     *
     * @param    sessionId
     * @param  callback
     *
     * @api public
     */
    expired(sessionId: string, callback: (...args: any[]) => any) {
      sessionFileHelper.expired(sessionId, this.options, callback);
    }
  }

  /**
   * Inherit from Store
   */
  FileStore.prototype['__proto__'] = Store.prototype;

  return FileStore;
}
