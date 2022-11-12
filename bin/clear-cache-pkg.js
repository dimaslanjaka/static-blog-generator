const spawn = require('cross-spawn');
const { existsSync } = require('fs-extra');
const { del, noop } = require('gulp-sbg/dist/gulp.clean');
const { join } = require('upath');

const myArgs = require('yargs/yargs')(process.argv.slice(2)).parse();

(async function () {
  const packages = String(myArgs._)
    .split(/\s+/)
    .map((pkgName) => {
      return { pkgName, path: join(process.cwd(), pkgName.trim()) };
    });

  /**
   * Do install ?
   */
  let install = false;
  for (let i = 0; i < packages.length; i++) {
    const o = packages[i];
    if (existsSync(o.path)) {
      install = true;
      await del(o.path).catch(noop);
    }
  }

  if (install) {
    const installArg = ['install'];
    if (myArgs.cache) installArg.push('--cache', myArgs.cache);
    spawn('npm', installArg, { cwd: process.cwd(), stdio: 'inherit' });
  }
})();
