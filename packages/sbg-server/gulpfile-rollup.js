const { spawn } = require('git-command-helper');

async function bundleJSRollUp() {
  await spawn('rollup', ['-c'], { stdio: 'inherit', cwd: __dirname });
}

module.exports = { bundleJSRollUp };
