const spawn = require('cross-spawn').spawn;
const { existsSync } = require('fs-extra');
const { join } = require('upath');
const packagejson = require('./package.json');

spawn('npm', ['pack'], { cwd: __dirname, stdio: 'ignore' });

const tgz = join(__dirname, `${packagejson.name}-${packagejson.version}.tgz`);
if (existsSync)