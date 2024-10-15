import fs__default from 'fs-extra';
import os from 'os';
import path__default from 'path';
import 'bluebird';
import 'minimatch';
import 'upath';
import './filemanager/case-path.mjs';
import { writefile } from './filemanager/writefile.mjs';
import { scheduler } from './scheduler.mjs';

const locks = [];
class LockManager {
    folder = path__default.join(process.cwd(), 'tmp/cache/lock');
    file;
    constructor(name) {
        this.file = path__default.join(this.folder, name, os.platform() + '-index.lock');
        locks.push(this);
    }
    lock() {
        return writefile(this.file, '');
    }
    release() {
        console.log(path__default.dirname(this.file), 'released');
        if (!fs__default.existsSync(this.file))
            return;
        return fs__default.rmSync(this.file, { recursive: true });
    }
    releaseAsync() {
        console.log(path__default.dirname(this.file), 'released');
        if (!fs__default.existsSync(this.file))
            return Promise.resolve();
        return fs__default.rm(this.file, { recursive: true });
    }
    exist() {
        return fs__default.existsSync(this.file);
    }
}
scheduler.add('clean locks', () => {
    locks.forEach((lock) => lock.release());
});

export { LockManager as default };
