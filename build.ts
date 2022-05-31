import { spawn } from 'child_process';
import { writeFile } from 'fs-extra';
import moment from 'moment-timezone';
import readline from 'readline';
import { join, toUnix } from 'upath';
import pkg from './package.json';
import { getLatestCommitHash, git, gitAddAndCommit } from './src/bin/git';
import { json_encode } from './src/node/JSON';

if (!process.env['GITHUB_WORKFLOW']) {
  askCommitMessage('commit messages:\t').then(async (msg) => {
    await gitAddAndCommit('src', msg, { cwd: __dirname });
    await start();
  });
} else {
  start();
}

async function start() {
  if (!process.env['GITHUB_WORKFLOW']) {
    const id = await getLatestCommitHash();
    pkg.version = pkg.version.split('-')[0] + '-beta-' + id;
    writeFile(join(__dirname, '.guid'), id);
    writeFile(join(__dirname, 'package.json'), json_encode(pkg, 2) + '\n');
    // commit uuid
    await gitAddAndCommit('.guid', `update cache id ${id}`, {
      cwd: __dirname
    });
    await gitAddAndCommit('package.json', `beta-${id}`, {
      cwd: __dirname
    });
  }
  build();
}
/**
 * main build function
 */
async function build() {
  //fse.emptyDirSync(join(__dirname, 'dist'));
  const child = spawn('tsc', ['-p', 'tsconfig.build.json'], {
    cwd: toUnix(__dirname),
    stdio: 'inherit',
    shell: true
  });
  child.once('close', async () => {
    await git({ cwd: __dirname }, 'add', 'dist');
    const id = await getLatestCommitHash();
    const date = moment.tz('Asia/Jakarta').format('z');
    return await git({ cwd: __dirname }, 'commit', '-m', `build ${id} ${date}`);
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
