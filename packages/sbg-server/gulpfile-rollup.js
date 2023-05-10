const { spawnAsync } = require('cross-spawn');

async function bundleJSRollUp() {
  await spawnAsync('rollup', ['-c'], { stdio: 'inherit', cwd: __dirname });
}

module.exports = { bundleJSRollUp };
