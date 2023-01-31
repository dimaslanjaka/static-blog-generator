const { spawn } = require('child_process');
const path = require('path');
const pkg = require('../package.json');
const fs = require('fs');

(async () => {
  console.info('build dist');
  await spawnParent(undefined, 'npm', 'run', 'build');
  console.info('build tarball');
  await spawnParent(undefined, 'npm', 'pack');
  fs.writeFileSync(
    __dirname + '/package.json',
    JSON.stringify({
      name: 'sbg-cli-test'
    })
  );
  console.info('installing tarball');
  await spawnParent({ cwd: __dirname }, 'npm', 'install', '-D', `file:../${pkg.name}-${pkg.version}.tgz`);
})();

/**
 * spawn on parent folder
 * @param {import('child_process').SpawnOptions} opt overriden spawn option
 * @param  {...string} args
 * @returns
 */
function spawnParent(opt, ...args) {
  return new Promise((resolve) => {
    const child = spawn(
      args[0],
      args.splice(1),
      Object.assign(
        {
          cwd: path.resolve(__dirname + '/../'),
          stdio: 'inherit',
          shell: true
        },
        opt || {}
      )
    );
    child.on('exit', () => resolve(null));
  });
}
