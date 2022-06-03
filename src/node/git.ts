import { SpawnOptions } from 'child_process';
import spawner from './spawner';

/**
 * git command
 * @param args
 * @returns
 */
export function git(options: null | SpawnOptions = null, ...args: string[]) {
  return spawner.promise(options, 'git', ...args);
}

/**
 * get latest commit hash
 * * git log --pretty=tformat:%H -n 1 path
 * * git log --pretty=tformat:%h -n 1 path
 * * git rev-parse HEAD
 * * git rev-parse --short HEAD
 * @param path specific folder
 * @returns
 */
export const getLatestCommitHash = async (path?: string, short = true) => {
  const args: string[] = [];
  if (!path) {
    args.push('rev-parse');
    if (short) args.push('--short');
    args.push('HEAD');
  } else {
    args.push('log');
    if (!short) {
      args.push('--pretty=tformat:%H');
    } else {
      args.push('--pretty=tformat:%h');
    }
    args.push('-n');
    args.push('1');
    args.push(path);
  }
  const res = await git(
    {
      cwd: process.cwd() //join(__dirname, '../../')
    },
    ...args
  );
  return res.stdout[0];
};

/**
 * git describe
 * @returns
 */
export const gitDescribe = async () => {
  const res = await git(
    {
      cwd: process.cwd() //join(__dirname, '../../')
    },
    'describe'
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
