const spawn = require('cross-spawn');
const path = require('upath');

// parallel run

spawn
  .async('yarn', ['run', 'prebuild'], {
    cwd: __dirname,
    stdio: 'inherit',
    shell: true
  })
  .then(function () {
    return spawn.async('yarn', ['run', 'build'], {
      cwd: __dirname,
      stdio: 'inherit',
      shell: true
    });
  })
  .then(function () {
    return spawn.async('yarn', ['run', 'pack'], {
      cwd: __dirname,
      stdio: 'inherit',
      shell: true
    });
  })
  .then(function () {
    const dist = require('./dist');
    const server = new dist.default({
      port: 4000,
      root: path.join(__dirname, '../../test')
    });
    server.start();
  });
