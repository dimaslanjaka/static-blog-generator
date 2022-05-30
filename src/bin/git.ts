import { spawn, SpawnOptions } from 'child_process';
import { Readable } from 'stream';
import { join, toUnix } from 'upath';

/**
 * git command
 * @param args
 * @returns
 */
export function git(options: null | SpawnOptions = null, ...args: string[]) {
  return new Promise(
    (
      resolve: (args: {
        code: number;
        stdout: string[] | Readable;
        stderr: any;
      }) => any,
      reject: (args: { args: string[]; err: Error }) => any
    ) => {
      if (options === null)
        options = {
          cwd: toUnix(__dirname),
          stdio: 'inherit'
        };
      const stdouts: string[] = [];
      const stderrs: string[] = [];
      const child = spawn('git', args, options);
      // use event hooks to provide a callback to execute when data are available:
      if (child.stdout !== null && child.stdout !== undefined)
        child.stdout.on('data', function (data) {
          stdouts.push(data.toString().trim());
        });
      if (child.stderr !== null && child.stderr !== undefined)
        child.stderr.on('data', function (data) {
          stderrs.push(data.toString().trim());
        });
      child.on('close', function (code) {
        // Should probably be 'exit', not 'close'
        // *** Process completed
        return resolve({
          code: code,
          stdout: stdouts.length > 0 ? stdouts : child.stdout,
          stderr:
            stderrs.length > 0
              ? stderrs
              : stdouts.length === 0
              ? child.stderr
              : null
        });
      });
      child.on('error', function (err) {
        // *** Process creation failed
        return reject({ args: args, err: err });
      });
    }
  );
}

export const getLatestCommitHash = async () => {
  const res = await git(
    {
      cwd: join(__dirname, '../../')
    },

    'rev-parse',
    '--short',
    'HEAD'
  );
  return res.stdout[0];
};

export async function gitAddAndCommit(
  file: string,
  msg: string,
  options: null | SpawnOptions = null
) {
  await git(options, 'add', file);
  return await git(options, 'commit', '-m', msg);
}

export default git;
