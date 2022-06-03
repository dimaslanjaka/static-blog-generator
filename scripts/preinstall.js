// git submodule update -i -r
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

if (fs.existsSync(path.join(root, '.git'))) {
  console.log('installing from github repository');
  spawn('git', ['pull', '--all'], {
    cwd: root,
    shell: true,
    stdio: 'inherit'
  });
  spawn('git', ['submodule', 'update', '-i', '-r'], {
    cwd: root,
    shell: true,
    stdio: 'inherit'
  });
} else {
  console.log('installing from npm registry, skipping preinstall');
}
