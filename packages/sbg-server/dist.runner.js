const spawn = require('cross-spawn');
const path = require('upath');

// parallel run

spawn
  .spawn('yarn', ['build'], {
    cwd: __dirname,
    stdio: 'inherit'
  })
  .once('exit', function () {
    const dist = require('./dist');
    const server = new dist.default({
      port: 4000,
      root: path.join(__dirname, '../../test')
    });
    server.start();
  });
