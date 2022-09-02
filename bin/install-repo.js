const { spawn } = require('child_process');
const { join } = require('path');

var isWin = process.platform === 'win32';
const file = 'install-repo' + (isWin ? '.cmd' : '');
spawn('./bin/' + file, { cwd: join(__dirname, '../') });
