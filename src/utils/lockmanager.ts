import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import { writefile } from './fm';
import scheduler from './scheduler';

const locks: LockManager[] = [];

export default class LockManager {
  folder = path.join(process.cwd(), 'build/cache/lock');
  file: string;
  constructor(name: string) {
    this.file = path.join(this.folder, name, os.platform() + '-index.lock');
    locks.push(this);
  }

  lock() {
    return writefile(this.file, '');
  }

  release() {
    console.log(path.dirname(this.file), 'released');
    if (!fs.existsSync(this.file)) return;
    return fs.rmSync(this.file, { recursive: true });
  }

  releaseAsync() {
    console.log(path.dirname(this.file), 'released');
    if (!fs.existsSync(this.file)) return Promise.resolve();
    return fs.rm(this.file, { recursive: true });
  }

  exist() {
    return fs.existsSync(this.file);
  }
}

scheduler.add('clean locks', () => {
  locks.forEach((lock) => lock.release());
});
