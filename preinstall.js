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
  spawn(
    'git',
    [
      'submodule',
      'foreach',
      'git',
      'submodule',
      'update',
      '--init',
      '--recursive'
    ],
    {
      cwd: __dirname,
      shell: true,
      stdio: 'inherit'
    }
  );
} else {
  console.log('installing from npm registry');
}
