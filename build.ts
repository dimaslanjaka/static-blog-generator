import { spawn, SpawnOptions } from 'child_process';
import { randomUUID } from 'crypto';
import fse, { writeFile } from 'fs-extra';
import { join, toUnix } from 'upath';

if (!process.env['GITHUB_WORKFLOW']) {
  const uuid = randomUUID();
  writeFile(join(__dirname, '.guid'), uuid);
  // commit uuid
  git(null, 'add', '.guid').then(() => {
    git(null, 'commit', '-m', `update cache id ${uuid}`).then(() => {
      build();
    });
  });
} else {
  console.log('not updating the uuid on github workflow');
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
    git(null, 'add', 'dist').then(() => {
      git(null, 'commit', '-m', 'build ' + new Date());
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
