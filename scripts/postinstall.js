const { spawn } = require('child_process');
const { existsSync } = require('fs');
const { join } = require('upath');

const root = join(__dirname, '..');
const islocal = !process.env['GITHUB_WORKFLOW'];

if (existsSync(join(root, '.git')) && islocal) {
  ['package.json', 'yarn.lock', 'package-lock.json']
    .map((path) => join(root, path))
    .filter(existsSync)
    .forEach((path) => {
      console.log('installing from github repository');
      spawn('git', ['add', path], {
        cwd: root,
        shell: true,
        stdio: 'ignore'
      });
      spawn('git', ['commit', '-m', 'update module resolution'], {
        cwd: root,
        shell: true,
        stdio: 'ignore'
      });
    });
}
