require('./bin/update-cache.js');
const pjson = require('./package.json');
const { summon } = require('./preinstall.js');
const fs = require('fs');
const path = require('path/posix');

(async () => {
  // @todo clear cache local packages
  const packages = [pjson.dependencies, pjson.devDependencies];
  for (let i = 0; i < packages.length; i++) {
    const pkgs = packages[i];
    const isDev = i === 1; // <-- index devDependencies
    for (const pkgname in pkgs) {
      /**
       * @type {string}
       */
      const version = pkgs[pkgname];
      // re-installing local and monorepo
      if (/^((file|github):|(git|ssh)\+|http)/.test(version)) {
        const isYarn = fs.existsSync(path.join(__dirname, 'yarn.lock'));
        const arg = ['install', version, isDev ? '-D' : ''].filter(
          (str) => str.trim().length > 0
        );
        if (isYarn) {
          await summon('yarn', arg, {
            cwd: __dirname,
            stdio: 'inherit'
          });
        } else {
          await summon('npm', arg, {
            cwd: __dirname,
            stdio: 'inherit'
          });
        }
      }
    }
  }
})();
