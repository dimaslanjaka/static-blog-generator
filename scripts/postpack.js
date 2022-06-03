const { existsSync, mkdirSync } = require('fs');
const { copySync } = require('fs-extra');
const { join } = require('path');
const pkg = require('../package.json');

const filename = pkg.name + '-' + pkg.version + '.tgz';
const filepath = join(process.cwd(), filename);

const tmp = join(__dirname, 'tmp');
if (!existsSync(tmp)) mkdirSync(tmp, { recursive: true });
if (existsSync(filepath)) {
  const isbeta = filepath.includes('-beta-');
  let newPath = join(process.cwd(), 'release/production.tgz');
  if (isbeta) {
    newPath = join(process.cwd(), 'release/development.tgz');
  }
  copySync(filepath, newPath, { overwrite: true });
}
