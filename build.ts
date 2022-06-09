import Bluebird from 'bluebird';
import { exec, spawn, SpawnOptions } from 'child_process';
import fse, { writeFile } from 'fs-extra';
import { join, toUnix } from 'upath';
import pkg from './package.json';

if (!process.env['GITHUB_WORKFLOW']) {
  /*pkg.version = crypto
    .createHash('md5')
    .update(new Date().toDateString())
    .digest('hex');*/
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
        exec('npm install', () => {
          Bluebird.all([
            git({ cwd: __dirname, stdio: 'ignore' }, 'add', 'package.json'),
            git({ cwd: __dirname, stdio: 'ignore' }, 'add', 'package-lock.json')
          ]).spread((_pkg, _lock) => {
            git(
              { cwd: __dirname, stdio: 'ignore' },
              'commit',
              '-m',
              'update ' + hash
            ).then(() => {
              build();
            });
          });
        });
      }
    }
  );
} else {
  console.log('not updating the commit hash on github workflow');
  build();
}

/**
 * main build function
 */
function build() {
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

/**
 * git command
 * @param args
 * @returns
 */
function git(options: null | SpawnOptions = {}, ...args: string[]) {
  return new Promise(
    (
      resolve: (args: { code: number; stdout: string; stderr: string }) => any,
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
          code: code,
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
