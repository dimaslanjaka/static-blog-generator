import { spawn } from 'child_process';
import fs, { writeFileSync } from 'fs';
import { writeFile } from 'fs-extra';
import moment from 'moment-timezone';
import readline from 'readline';
import { join } from 'upath';
import pkg from './package.json';
import { getLatestCommitHash, git, gitAddAndCommit } from './src/node/git';
import { json_encode } from './src/node/JSON';
import { md5FileSync } from './src/node/md5-file';

writeFileSync(join(__dirname, 'src/types/_config_project.json'), '{}');
writeFileSync(join(__dirname, 'src/types/_config_theme.json'), '{}');
writeFileSync(join(__dirname, 'src/types/_config_hashes.json'), '{}');
const date = moment.tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss A [GMT]Z z');

if (!process.env['GITHUB_WORKFLOW']) {
  askCommitMessage('commit messages (empty allowed):').then(async (msg) => {
    if (msg.trim().length > 0) {
      await gitAddAndCommit('src', msg, { cwd: __dirname });
    }
    await start();
  });
} else {
  start();
}

async function start() {
  const commitHash = await getLatestCommitHash('src');
  const islocal = !process.env['GITHUB_WORKFLOW'];
  if (islocal) {
    let lock = join(__dirname, 'yarn.lock');
    if (!fs.existsSync(lock)) lock = join(__dirname, 'package-lock.json');
    const guid = commitHash + ':' + md5FileSync(lock);
    pkg.version = pkg.version.split('-')[0] + '-beta-' + commitHash;
    writeFile(join(__dirname, '.guid'), guid);
    writeFile(join(__dirname, 'package.json'), json_encode(pkg, 2) + '\n');
    // commit uuid
    await gitAddAndCommit('.guid', `update cache id ${commitHash}`, {
      cwd: __dirname
    });
    await gitAddAndCommit('package.json', `release beta ${commitHash}`, {
      cwd: __dirname
    });
  }
  await build();
  if (islocal) {
    const child = spawn('npm', ['install'], {
      cwd: __dirname,
      stdio: 'inherit',
      shell: true
    });
    child.once('close', async () => {
      await gitAddAndCommit(
        'package-lock.json',
        `${commitHash} update module resolutions`,
        {
          cwd: __dirname
        }
      );
    });
  }
}

/**
 * main build function
 */
async function build() {
  //fse.emptyDirSync(join(__dirname, 'dist'));
  const child = spawn('tsc', ['-p', 'tsconfig.build.json'], {
    cwd: __dirname,
    stdio: 'inherit',
    shell: true
  });
  child.once('close', async () => {
    await git({ cwd: __dirname }, 'add', 'dist');
    const commitHash = await getLatestCommitHash();

    return await git(
      { cwd: __dirname },
      'commit',
      '-m',
      `build ${commitHash} ${date}`
    );
  });
  return child;
}

function askCommitMessage(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans);
    })
  );
}
