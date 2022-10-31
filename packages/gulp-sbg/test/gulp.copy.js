const { spawn } = require("child_process");
const { hexoProject } = require('../project')

const cwd = hexoProject;

spawn('npm', ['run', 'copy'], { cwd, stdio: 'inherit' });
