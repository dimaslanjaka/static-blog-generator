import fs from 'fs';
import glob from 'glob';
import path from 'path';

const base = path.join(__dirname);
const dirs = glob
  .sync('**/node_modules/**', { cwd: base })
  .concat(glob.sync('**/tmp/**', { cwd: base }))
  .concat(glob.sync('**/package-lock.json', { cwd: base }))
  .sort((x, y) => x.length - y.length)
  .reverse()
  .map((p) => path.join(base, p));
dirs.forEach((p) => fs.rmSync(p, { recursive: true, force: true }));
