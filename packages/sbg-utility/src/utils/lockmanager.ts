import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import { writefile } from './filemanager';
import Logger from './logger';
import scheduler from './scheduler';

const locks: LockManager[] = [];
let schedulerInitialized = false;

export default class LockManager {
  folder = path.join(process.cwd(), 'tmp/cache/lock');
  file: string;
  constructor(name: string) {
    this.file = path.join(this.folder, name, os.platform() + '-index.lock');
    locks.push(this);

    // Register scheduler only once
    if (!schedulerInitialized) {
      schedulerInitialized = true;
      scheduler.register();
      scheduler.add('clean locks', () => {
        locks.forEach((lock) => lock.release());
      });
    }
  }

  lock() {
    return writefile(this.file, '');
  }

  release() {
    Logger.log(path.dirname(this.file), 'released');
    if (!fs.existsSync(this.file)) return;
    return fs.rmSync(this.file, { recursive: true });
  }

  releaseAsync() {
    Logger.log(path.dirname(this.file), 'released');
    if (!fs.existsSync(this.file)) return Promise.resolve();
    return fs.rm(this.file, { recursive: true });
  }

  exist() {
    return fs.existsSync(this.file);
  }
}
