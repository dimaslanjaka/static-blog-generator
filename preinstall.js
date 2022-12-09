const { spawn } = require('cross-spawn');
const pjson = require('./package.json');
const fs = require('fs');
const path = require('upath');

// preinstall scripts
// run this script after `npm install`
// requirements: npm i -D cross-spawn upath
// update: curl -L https://github.com/dimaslanjaka/static-blog-generator-hexo/raw/master/preinstall.js > preinstall.js
// repo: https://github.com/dimaslanjaka/static-blog-generator-hexo/blob/master/preinstall.js
// raw: https://github.com/dimaslanjaka/static-blog-generator-hexo/raw/master/preinstall.js
// usages: node preinstall.js

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

if (require.main === module) {
  // console.log('called directly');
  summon(
    'git',
    ['submodule', 'sync', '--recursive'],
    spawnOpt({ cwd: __dirname, stdio: 'inherit' })
  );

  const packages = [pjson.dependencies, pjson.devDependencies];
  for (let i = 0; i < packages.length; i++) {
    const pkgs = packages[i];
    //const isDev = i === 1; // <-- index devDependencies
    for (const pkgname in pkgs) {
      /**
       * @type {string}
       */
      const version = pkgs[pkgname];

      // delete node_modules/package folder of local packages
      const pkgdatacache = getCache()[pkgname] || {};
      if ('lastDelete' in pkgdatacache) {
        const lastDelete = pkgdatacache.lastDelete;
        const now = new Date();
        const msBetweenDates = Math.abs(lastDelete - now.getTime());
        // 👇️ convert ms to hours                  min  sec   ms
        const hoursBetweenDates = msBetweenDates / (60 * 60 * 1000);

        // skip if already deleted in 24 hours
        if (hoursBetweenDates < 24) continue;
      }
      if (/^file:/i.test(version)) {
        const nodeModules = path.join(__dirname, 'node_modules', pkgname);
        if (fs.existsSync(nodeModules)) {
          fs.rmSync(nodeModules, {
            maxRetries: 3,
            recursive: true,
            force: true
          });
          const data = getCache();
          data[pkgname] = Object.assign(pkgdatacache, {
            lastDelete: new Date().getTime(),
            nodeModules
          });
          saveCache(data);
        }
      }
    }
  }
} else {
  // console.log('required as a module');
}

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

module.exports = { summon };

/**
 * Overidden Options
 * @param {import('child_process').SpawnOptions} opt
 * @returns
 */
function spawnOpt(opt = {}) {
  return Object.assign({ stdio: 'inherit' }, opt);
}

/*
cdir="$PWD"

git submodule update -i -r
echo "update submodule static-blog-generator"
cd $cdir/packages/static-blog-generator
git submodule update -i -r
echo "update submodule hexo-post-parser"
cd $cdir/packages/static-blog-generator/packages/hexo-post-parser
git submodule update -i -r
    summon(
      'yarn',
      ['install', '--check-files'],
      spawnOpt({
        cwd: path.join(
          sbgPath,
          'packages/hexo-post-parser/packages/persistent-cache'
        )
      })
    ).then(() => {
      summon(
        'yarn',
        ['install', '--check-files'],
        spawnOpt({
          cwd: path.join(sbgPath, 'packages/google-news-sitemap')
        })
      ).then(() => {
        summon(
          'yarn',
          ['install', '--check-files'],
          spawnOpt({
            cwd: path.join(sbgPath, 'packages/hexo-post-parser')
          })
        ).then(() => {
          summon(
            'yarn',
            ['install', '--check-files'],
            spawnOpt({
              cwd: path.join(sbgPath, 'packages/safelink')
            })
          ).then(() => {

          });
        });
      });
    });
*/
