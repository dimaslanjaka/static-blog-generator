const { spawn } = require('cross-spawn');
const { existsSync, rmSync } = require('fs');
const { join } = require('path');
const pjson = require('./package.json');

summon(
  'git',
  ['submodule', 'sync', '--recursive'],
  spawnOpt({ cwd: __dirname, stdio: 'inherit' })
).then(() => {
  // @todo clear cache local packages
  const packages = Object.assign(pjson.dependencies, pjson.devDependencies);
  for (const pkgname in packages) {
    /**
     * @type {string}
     */
    const version = packages[pkgname];
    if (version.startsWith('file:')) {
      const nodeModule = join(__dirname, 'node_modules', pkgname);
      if (existsSync(nodeModule)) rmSync(nodeModule, { recursive: true });
    }
  }
});

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
