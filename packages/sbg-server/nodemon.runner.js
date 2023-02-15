const { spawn } = require('cross-spawn');

// parallel run

spawn('node', ['-r', 'ts-node/register', 'src/server.runner.ts'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});
spawn('gulp', ['compile'], {
  cwd: __dirname,
  shell: true,
  stdio: 'inherit'
});
