const { existsSync, mkdirSync } = require('fs');
const { copySync } = require('fs-extra');
const { join } = require('path');
const pkg = require('../package.json');

const root = join(__dirname, '..');
const filename = pkg.name + '-' + pkg.version + '.tgz';
const filepath = join(root, filename);

const tmp = join(__dirname, 'tmp');
if (!existsSync(tmp)) mkdirSync(tmp, { recursive: true });
if (existsSync(filepath)) {
  const isbeta = filepath.includes('-');
  let newPath = join(root, 'release/production.tgz');
  if (isbeta) {
    newPath = join(root, 'release/development.tgz');
  }
  copySync(filepath, newPath, { overwrite: true });
}
