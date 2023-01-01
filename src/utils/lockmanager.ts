import { existsSync, rmSync } from 'fs';
import path from 'path';
import { writefile } from './fm';

export default class LockManager {
  folder = path.join(process.cwd(), 'tmp/static-blog-generator/lock-' + process.env.CACHE_NAME || 'default');
  file: string;
  constructor(name: string) {
    this.file = path.join(this.folder, name, 'index.lock');
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
