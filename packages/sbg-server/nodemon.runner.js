const spawn = require('cross-spawn');

// parallel run

spawn.spawn('ts-node', ['src/server.runner.ts'], {
  cwd: __dirname,
  stdio: 'inherit'
});
spawn.spawn('gulp', ['compile:js'], {
  cwd: __dirname,
  stdio: 'inherit'
});
