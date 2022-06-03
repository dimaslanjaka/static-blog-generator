const { existsSync } = require('fs');
const { join } = require('path');
const pkg = require('../package.json');
const filename = pkg.name + '-' + pkg.version + '.tgz';
const filepath = join(__dirname, filename);

console.log(filepath, existsSync(filepath));
