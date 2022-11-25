const pjson = require('./package.json');
const fs = require('fs');
const path = require('path/posix');
const { spawn } = require('cross-spawn');

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
      // re-installing local and monorepo package
      if (/^((file|github):|(git|ssh)\+|http)/.test(version)) {
        const isYarn = fs.existsSync(path.join(__dirname, 'yarn.lock'));
        const arg = [version, isDev ? '-D' : ''].filter((str) => str.trim().length > 0);
        if (isYarn) {
          // yarn upgrade package
          await summon('yarn', ['upgrade'].concat(arg), {
            cwd: __dirname,
            stdio: 'inherit'
          });
        } else {
          // npm update package
          await summon('npm', ['update'].concat(arg), {
            cwd: __dirname,
            stdio: 'inherit'
          });
        }
      }
    }
  }
})();

/**
 * spawn command prompt
 * @param {string} cmd
 * @param {string[]} args
 * @param {Parameters<typeof spawn>[2]} opt
 * @returns
 */
function summon(cmd, args = [], opt = {}) {
  // *** Return the promise
  return new Promise(function (resolve, reject) {
    if (typeof cmd !== 'string' || cmd.trim().length === 0) return reject('cmd empty');
    const process = spawn(cmd, args, opt);
    process.on('close', function (code) {
      // Should probably be 'exit', not 'close'
      // *** Process completed
      resolve(code);
    });
    process.on('error', function (err) {
      // *** Process creation failed
      reject(err);
    });
  });
}
