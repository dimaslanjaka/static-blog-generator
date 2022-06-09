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

// mock data

[
  'src/types/_config_project.json',
  'src/types/_config_theme.json',
  'src/types/_config_hashes.json',
  'src/gulp/server/routes.json'
].forEach((loc) => {
  const src = path.join(__dirname, '..', loc);
  const dist = path.join(__dirname, '../dist', loc);
  try {
    fs.mkdirSync(path.dirname(src), { recursive: true });
    fs.mkdirSync(path.dirname(dist), { recursive: true });
    fs.writeFileSync(src, '{}');
    fs.writeFileSync(dist, '{}');
  } catch {
    //
  }
});
