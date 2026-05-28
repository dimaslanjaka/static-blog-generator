const { writefile } = require('sbg-utility');
const fs = require('fs');
const { spawn } = require('cross-spawn');
const path = require('path');
const yaml = require('js-yaml');

const gitDir = path.join(__dirname, 'source-posts', '.git');
const repoUrl = 'https://github.com/dimaslanjaka/source-posts.git';
const branch = 'posts';
const postDir = path.join(__dirname, 'source-posts');

function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: 'inherit', ...opts });
    p.on('error', reject);
    p.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} exited with ${code}`));
    });
  });
}

async function main() {
  if (!fs.existsSync(gitDir)) {
    console.log('🚀 shallow cloning repo...');

    await run('git', ['clone', '--depth', '1', '--single-branch', '--branch', branch, repoUrl, 'source-posts'], {
      cwd: __dirname
    });
  } else {
    console.log('⚡ fast update (fetch + ff-only pull)...');

    await run('git', ['fetch', 'origin', branch, '--depth=1'], { cwd: postDir });
    await run('git', ['checkout', branch], { cwd: postDir });
    await run('git', ['pull', '--ff-only', 'origin', branch], { cwd: postDir });
  }

  // ⚡ yarn optimization (skip if unchanged)
  const lockPath = path.join(postDir, 'yarn.lock');

  const needInstall = !fs.existsSync(lockPath) || fs.statSync(lockPath).mtimeMs < Date.now() - 1000 * 60 * 60; // 1 hour cache

  console.log(`📁 Working on posts folder: ${postDir}`);

  if (!fs.existsSync(lockPath)) {
    console.log('📦 no lockfile found, will install dependencies');
    writefile(lockPath, '');
  }

  if (needInstall) {
    console.log('📦 installing dependencies (cached)...');

    await run('yarn', ['install', '--inline-builds'], {
      cwd: postDir
    });
  } else {
    console.log('✅ yarn install skipped (cached)');
  }

  // config update (unchanged)
  const configPath = path.join(__dirname, '_config.base.yml');
  const doc = yaml.load(fs.readFileSync(configPath, 'utf8'));

  doc.post_dir = 'source-posts';

  writefile(path.join(__dirname, '_config.yml'), yaml.dump(doc));
}

main().catch((err) => {
  console.error('❌ failed:', err.message);
});
