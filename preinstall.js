// git submodule update -i -r
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

if (fs.existsSync(path.join(__dirname, '.git'))) {
  console.log('installing from github repository');
  spawn('git', ['submodule', 'update', '-i', '-r'], {
    cwd: __dirname,
    shell: true,
    stdio: 'inherit'
  });
  spawn('git', ['submodule', 'update', '--init', '--recursive'], {
    cwd: path.join(__dirname, 'packages/hexo-post-parser'),
    shell: true,
    stdio: 'inherit'
  });
} else {
  console.log('installing from npm registry, skipping preinstall');
}
