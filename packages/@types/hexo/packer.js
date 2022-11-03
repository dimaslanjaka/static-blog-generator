const spawn = require('cross-spawn').spawn;
const { existsSync, renameSync, rmSync, mkdirpSync } = require('fs-extra');
const GulpClient = require('gulp');
const { join, dirname } = require('upath');
const packagejson = require('./package.json');

const child = spawn('npm', ['pack'], { cwd: __dirname, stdio: 'ignore' });
child.on('exit', function () {
  const filename = `${packagejson.name}-${packagejson.version}.tgz`;
  const tgz = join(__dirname, filename);
  const tgzlatest = join(__dirname, 'release', `${packagejson.name}.tgz`);

  if (!existsSync(dirname(tgzlatest))) {
    mkdirpSync(dirname(tgzlatest));
  }

  if (existsSync(tgz)) {
    GulpClient.src(tgz)
      .pipe(GulpClient.dest(join(__dirname, 'release')))
      .once('end', function () {
        if (existsSync(tgzlatest)) {
          rmSync(tgzlatest);
        }
        renameSync(tgz, tgzlatest);
      });
  }
});
