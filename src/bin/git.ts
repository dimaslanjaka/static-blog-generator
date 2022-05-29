import { spawn, SpawnOptions } from 'child_process';
import { toUnix } from 'upath';

/**
 * git command
 * @param args
 * @returns
 */
export function git(options: null | SpawnOptions = {}, ...args: string[]) {
  return new Promise(
    (
      resolve: (args: { code: number; stdout: any; stderr: any }) => any,
      reject: (args: { args: string[]; err: Error }) => any
    ) => {
      if (typeof options !== 'object')
        options = {
          cwd: toUnix(__dirname),
          stdio: 'inherit'
        };
      const stdouts: string[] = [];
      const child = spawn('git', args, options);
      // use event hooks to provide a callback to execute when data are available:
      if (child.stdout !== null && child.stdout !== undefined)
        child.stdout.on('data', function (data) {
          stdouts.push(data.toString());
        });
      child.on('close', function (code) {
        // Should probably be 'exit', not 'close'
        // *** Process completed
        return resolve({
          code: code,
          stdout: child.stdout || stdouts,
          stderr: child.stderr
        });
      });
      child.on('error', function (err) {
        // *** Process creation failed
        return reject({ args: args, err: err });
      });
    }
  );
}
