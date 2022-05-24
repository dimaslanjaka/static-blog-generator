import { spawn, SpawnOptions } from 'child_process';
import fse from 'fs-extra';
import { join, toUnix } from 'upath';

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
