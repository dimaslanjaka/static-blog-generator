const pjson = require('./package.json');
const fs = require('fs');
const path = require('upath');
const { spawn } = require('cross-spawn');

// postinstall scripts
// run this script after `npm install`
// requirements: npm i -D cross-spawn upath
// update: curl https://github.com/dimaslanjaka/static-blog-generator-hexo/raw/master/postinstall.js > postinstall.js
// repo: https://github.com/dimaslanjaka/static-blog-generator-hexo/blob/master/postinstall.js
// raw: https://github.com/dimaslanjaka/static-blog-generator-hexo/raw/master/postinstall.js
// usages: node postinstall.js

// cache file
const cacheJSON = path.join(__dirname, 'node_modules/.cache/npm-install.json');
console.log('cache json', cacheJSON);
if (!fs.existsSync(path.dirname(cacheJSON))) {
  fs.mkdirSync(path.dirname(cacheJSON), { recursive: true });
}
if (!fs.existsSync(cacheJSON)) {
  fs.writeFileSync(cacheJSON, '{}');
}
/**
 * Get cache
 * @returns {import('./node_modules/cache/npm-install.json')}
 */
const getCache = () => require('./node_modules/.cache/npm-install.json');

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
  /**
   * list packages to update
   * @type {string[]}
   */
  const toUpdate = [];

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
        //const arg = [version, isDev ? '-D' : ''].filter((str) => str.trim().length > 0);
        toUpdate.push(pkgname);
      }
    }
  }

  // do update

  const isYarn = fs.existsSync(path.join(__dirname, 'yarn.lock'));

  const updateCache = () => {
    // save to cache
    const data = getCache();
    for (let i = 0; i < toUpdate.length; i++) {
      const pkgname = toUpdate[i];
      data[pkgname] = Object.assign(data[pkgname] || {}, {
        lastInstall: new Date().getTime()
      });
    }

    saveCache(data);
  };

  /**
   * check if all packages exists
   * @returns
   */
  const checkNodeModules = () => {
    const exists = toUpdate.map(
      (pkgname) =>
        fs.existsSync(path.join(__dirname, 'node_modules', pkgname)) &&
        fs.existsSync(
          path.join(__dirname, 'node_modules', pkgname, 'package.json')
        )
    );
    //console.log({ exists });
    return exists.every((exist) => exist === true);
  };

  if (checkNodeModules()) {
    if (isYarn) {
      // yarn upgrade package
      await summon('yarn', ['upgrade'].concat(...toUpdate), {
        cwd: __dirname,
        stdio: 'inherit'
      }).finally(updateCache);
    } else {
      // npm update package
      await summon('npm', ['update'].concat(...toUpdate), {
        cwd: __dirname,
        stdio: 'inherit'
      }).finally(updateCache);
    }
  } else {
    console.log('some packages already deleted from node_modules');
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
