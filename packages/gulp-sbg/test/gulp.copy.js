const spawn = require('cross-spawn');
const { hexoProject } = require('../project');

const cwd = hexoProject;

spawn('npm', ['run', 'copy'], { cwd, stdio: 'inherit' });
