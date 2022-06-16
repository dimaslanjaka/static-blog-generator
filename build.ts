import Bluebird from 'bluebird';
import { spawn } from 'child_process';
import fs, { writeFileSync } from 'fs';
import { writeFile } from 'fs-extra';
import { gitDescribe, GitInfo } from 'git-describe';
import moment from 'moment-timezone';
import readline from 'readline';
import { join } from 'upath';
import pkg from './package.json';
import color from './src/node/color';
import { write } from './src/node/filemanager';
import { getLatestCommitHash, git, gitAddAndCommit } from './src/node/git';
import { md5FileSync } from './src/node/md5-file';
import spawner from './src/node/spawner';
import { argv } from './src/types/_config';

// mock data
writeFileSync(join(__dirname, 'src/types/_config_project.json'), '{}');
writeFileSync(join(__dirname, 'src/types/_config_theme.json'), '{}');
writeFileSync(join(__dirname, 'src/types/_config_hashes.json'), '{}');

const date = moment.tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss A [GMT]Z z');

(async () => {
  if (!process.env['GITHUB_WORKFLOW']) {
    // --update-cache
    if (argv['update-cache'] || argv['update-guid']) return update_guid();
    // --update-version
    if (argv['update-version']) return update_version();

    askCommitMessage('commit messages (empty allowed):  ').then(async (msg) => {
      if (msg.trim().length > 0) {
        await gitAddAndCommit('src', msg, { cwd: __dirname });
      }
      await start();
    });
  } else {
    start();
  }
})();

async function start() {
  const islocal = !process.env['GITHUB_WORKFLOW'];
  await build();
  if (islocal) {
    //await update_guid();
    await update_version();
  }
}

async function update_guid() {
  const commitHash = await getLatestCommitHash('src');
  let lock = join(__dirname, 'yarn.lock');
  if (!fs.existsSync(lock)) lock = join(__dirname, 'package-lock.json');
  const guid = commitHash + ':' + md5FileSync(lock);

  writeFile(join(__dirname, '.guid'), guid);
  // commit uuid
  await gitAddAndCommit('.guid', `[${commitHash}] update cache`, {
    cwd: __dirname
  });
}

/**
 * update version package.json
 * * apply version by folder src latest commit
 */
async function update_version() {
  Bluebird.all([
    gitDescribe(join(__dirname, 'src')),
    getLatestCommitHash(join(__dirname, 'src'))
  ])
    .spread((info: GitInfo, srcInfo: string) => {
      const newVer =
        info.semver.major +
        '.' +
        info.semver.minor +
        '.' +
        info.semver.patch +
        '-' +
        info.distance +
        '-' +
        srcInfo;

      if (pkg.version !== newVer) {
        console.log(
          color['Yellow Orange']('updating version'),
          color.redBright(pkg.version),
          '->',
          color.greenBright(newVer)
        );
      } else {
        console.log(color.green('no update needed'), pkg.version);
      }

      pkg.version = newVer;

      write(
        join(__dirname, '/package.json'),
        JSON.stringify(pkg, null, 2) + '\n'
      );

      spawner
        .promise({ cwd: __dirname }, 'npm', 'install')
        .then(() => spawner.promise({ cwd: __dirname }, 'npm', 'audit', 'fix'))
        .then(() => {
          gitAddAndCommit('package.json', `update from ${srcInfo}`, {
            cwd: __dirname
          }).then(() => {
            gitAddAndCommit('package-lock.json', `update from ${srcInfo}`, {
              cwd: __dirname
            });
          });
        });
    })
    .catch((err) => console.error(err));
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
      `[${commitHash}] build ${date}`
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
