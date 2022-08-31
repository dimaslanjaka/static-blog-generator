import Bluebird from 'bluebird';
import { exec, ExecException, spawn, SpawnOptions } from 'child_process';
import fse, { writeFile } from 'fs-extra';
import { join, toUnix } from 'upath';
import yargs from 'yargs';
import pkg from './package.json';

const argv = yargs.parse(process.argv);

if (argv['update-version']) {
  updateVersion();
} else {
  build().then(updateVersion);
}

/**
 * main build function
 */
async function build() {
  fse.emptyDirSync(join(__dirname, 'dist'));
  const summon = spawn('tsc', ['-p', 'tsconfig.build.json'], {
    cwd: toUnix(__dirname),
    stdio: 'inherit',
    shell: true
  });
  summon.once('close', () => {
    git({ cwd: __dirname, stdio: 'ignore' }, 'add', 'dist').then(() => {
      git(
        { cwd: __dirname, stdio: 'ignore' },
        'commit',
        '-m',
        'build ' + new Date()
      );
    });
  });
}

function updateVersion() {
  if (!process.env['GITHUB_WORKFLOW']) {
    exec(
      'git describe --tags --first-parent --dirty --broken',
      { cwd: __dirname },
      function (err, hash) {
        getLatestCommitHash(join(__dirname, 'src')).then((result) => {
          const srcErr = result.err;
          const srcHash = result.hash;
          if (!err) {
            //console.log('Described this branch', hash);
          }
          if (!srcErr) {
            //console.log('Last commit hash ./src', srcHash);
          }

          if (typeof hash === 'string' && hash.length > 1) {
            const parse = hash
              .trim()
              .replace(/^v|-dirty$/gim, '')
              .split('-');
            pkg.version = parse[0] + '-' + parse[1] + '-' + srcHash;
            writeFile(
              join(__dirname, 'package.json'),
              JSON.stringify(pkg, null, 2)
            );
            exec(
              'npm install && npm audit fix',
              { cwd: __dirname },
              async () => {
                await git(
                  { cwd: __dirname, stdio: 'ignore' },
                  'add',
                  'package.json'
                );
                await git(
                  { cwd: __dirname, stdio: 'ignore' },
                  'add',
                  'package-lock.json'
                );
                await git(
                  { cwd: __dirname, stdio: 'ignore' },
                  'commit',
                  '-m',
                  `[${srcHash}] update ${hash}`
                );
              }
            );
          }
        });
      }
    );
  } else {
    console.log('not updating the commit hash on github workflow');
  }
}

/**
 * git command
 * @param args
 * @returns
 */
function git(options: null | SpawnOptions = {}, ...args: string[]) {
  return new Promise(
    (
      resolve: (args: {
        code: number | null;
        stdout: string | null;
        stderr: string | null;
      }) => any,
      reject: (args: { args: string[]; err: Error }) => any
    ) => {
      options = Object.assign(
        {
          cwd: toUnix(__dirname),
          stdio: 'inherit'
        },
        options
      );
      const summon = spawn('git', args, options);
      summon.on('close', function (code) {
        // Should probably be 'exit', not 'close'
        // *** Process completed
        return resolve({
          code,
          stdout: String(summon.stdout),
          stderr: String(summon.stderr)
        });
      });
      summon.on('error', function (err) {
        // *** Process creation failed
        return reject({ args: args, err: err });
      });
    }
  );
}

/**
 * get latest hash of directory
 * @param path
 * @returns
 */
function getLatestCommitHash(path?: string) {
  return new Bluebird(
    (
      resolve: (result: {
        err: ExecException | null;
        hash: string | null;
      }) => any
    ) => {
      if (path) {
        exec(
          `git log --pretty=tformat:"%h" -n1 ${path}`,
          { cwd: __dirname },
          (err, hash) => {
            resolve({ err, hash: String(hash).trim() });
          }
        );
      } else {
        exec(
          `git log --pretty=tformat:"%h" -n1 .`,
          { cwd: __dirname },
          (err, hash) => {
            resolve({ err, hash: String(hash).trim() });
          }
        );
      }
    }
  );
}
