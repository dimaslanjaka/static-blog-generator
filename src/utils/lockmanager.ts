import { existsSync, rmSync } from 'fs';
import { platform } from 'os';
import path from 'path';
import { writefile } from './fm';
import scheduler from './scheduler';

const locks: LockManager[] = [];

export default class LockManager {
  folder = path.join(process.cwd(), 'tmp/cache/lock');
  file: string;
  constructor(name: string) {
    this.file = path.join(this.folder, name, platform() + 'index.lock');
    locks.push(this);
  }

  lock() {
    return writefile(this.file, '');
  }

  release() {
    rmSync(this.file);
  }

  exist() {
    return existsSync(this.file);
  }
}

scheduler.add('clean locks', () => {
  locks.forEach((lock) => lock.release());
});
