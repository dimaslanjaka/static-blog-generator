import { exec, spawn, SpawnOptions } from 'child_process';
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
      function (err, hash) {
        //if (!err) console.log('Last commit hash on this branch is:', hash);
        if (typeof hash === 'string' && hash.length > 1) {
          hash = hash.trim().replace(/^v/, '');
          pkg.version = hash;
          writeFile(
            join(__dirname, 'package.json'),
            JSON.stringify(pkg, null, 2)
          );
          exec('npm install', async () => {
            const _pkg = await git(
              { cwd: __dirname, stdio: 'ignore' },
              'add',
              'package.json'
            );
            const _lock = await git(
              { cwd: __dirname, stdio: 'ignore' },
              'add',
              'package-lock.json'
            );
            await git(
              { cwd: __dirname, stdio: 'ignore' },
              'commit',
              '-m',
              'update ' + hash
            );
          });
        }
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
