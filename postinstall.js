const pjson = require('./package.json');
const fs = require('fs');
const path = require('path/posix');
const { spawn } = require('cross-spawn');

// cache file
const cacheJSON = path.join(__dirname, 'tmp/cache/npm-install.json');
if (!fs.existsSync(path.dirname(cacheJSON))) {
  fs.mkdirSync(path.dirname(cacheJSON), { recursive: true });
}
if (!fs.existsSync(cacheJSON)) {
  fs.writeFileSync(cacheJSON, '{}');
}
/**
 * Get cache
 * @returns {import('./tmp/cache/npm-install.json')}
 */
const getCache = () => require('./tmp/cache/npm-install.json');

/**
 * Save cache
 * @param {any} data
 * @returns
 * @example
 * const data = getCache()
 * data['key']='value';
 * saveCache(data)
 */
const saveCache = (data) =>
  fs.writeFileSync(cacheJSON, JSON.stringify(data, null, 2));

(async () => {
  // @todo clear cache local packages
  const packages = [pjson.dependencies, pjson.devDependencies];
  for (let i = 0; i < packages.length; i++) {
    const pkgs = packages[i];
    //const isDev = i === 1; // <-- index devDependencies
    for (const pkgname in pkgs) {
      /**
       * @type {string}
       */
      const version = pkgs[pkgname];
      // re-installing local and monorepo package
      if (/^((file|github):|(git|ssh)\+|http)/i.test(version)) {
        const isYarn = fs.existsSync(path.join(__dirname, 'yarn.lock'));
        //const arg = [version, isDev ? '-D' : ''].filter((str) => str.trim().length > 0);

        if (isYarn) {
          // yarn upgrade package
          await summon('yarn', ['upgrade'].concat(pkgname), {
            cwd: __dirname,
            stdio: 'inherit'
          }).finally(function () {
            // save to cache
            const data = getCache();
            data[pkgname] = Object.assign(data[pkgname] || {}, {
              lastInstall: new Date().getTime()
            });
            saveCache(data);
          });
        } else {
          // npm update package
          await summon('npm', ['update'].concat(pkgname), {
            cwd: __dirname,
            stdio: 'inherit'
          }).finally(function () {
            // save to cache
            const data = getCache();
            data[pkgname] = Object.assign(data[pkgname] || {}, {
              lastInstall: new Date().getTime()
            });
            saveCache(data);
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
    if (typeof cmd !== 'string' || cmd.trim().length === 0)
      return reject('cmd empty');
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
