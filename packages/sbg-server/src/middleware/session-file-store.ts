import { Store } from 'express-session';
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
export class FileStore extends Store {
  options: ReturnType<typeof sessionFileHelper.defaults>;

  constructor(
    options: ReturnType<typeof sessionFileHelper.defaults> = {} as ReturnType<
      typeof sessionFileHelper.defaults
    >
  ) {
    super(options as any);

    const opt = options || ({} as typeof options);
    if (!fs.existsSync(opt.path)) {
      fs.mkdirSync(opt.path, { recursive: true });
    }

    this.options = sessionFileHelper.defaults(opt);
    fs.mkdirsSync(this.options.path);
    sessionFileHelper.scheduleReap(this.options);
    options.reapIntervalObject = this.options.reapIntervalObject;
  }

  get(sessionId: string, callback: (...args: any[]) => any) {
    sessionFileHelper.get(sessionId, this.options, callback);
  }

  set(sessionId: string, session, callback: (...args: any[]) => any) {
    sessionFileHelper.set(sessionId, session, this.options, callback);
  }

  touch(sessionId: string, session, callback: (...args: any[]) => any) {
    sessionFileHelper.touch(sessionId, session, this.options, callback);
  }

  destroy(sessionId: string, callback: (...args: any[]) => any) {
    sessionFileHelper.destroy(sessionId, this.options, callback);
  }

  length(callback: (...args: any[]) => any) {
    sessionFileHelper.length(this.options, callback);
  }

  clear(callback: (...args: any[]) => any) {
    sessionFileHelper.clear(this.options, callback);
  }

  list(callback: (...args: any[]) => any) {
    sessionFileHelper.list(this.options, callback);
  }

  expired(sessionId: string, callback: (...args: any[]) => any) {
    sessionFileHelper.expired(sessionId, this.options, callback);
  }
}
