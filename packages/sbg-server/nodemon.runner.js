const { spawn } = require('cross-spawn');

// parallel run

spawn('node', ['server-dev.runner.js'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});
spawn('yarn', ['run', 'prebuild'], {
  cwd: __dirname,
  shell: true,
  stdio: 'inherit'
});
