import { SpawnOptions } from 'child_process';
import { deepmerge } from 'deepmerge-ts';
import fs from 'fs';
import ini from 'ini';
import { join, resolve } from 'upath';
import spawner from './spawner';

/**
 * git command
 * @param options git argument or spawn options
 * @param args git variadic arguments
 * @returns
 */
export function git(
  options: null | string | SpawnOptions = null,
  ...args: string[]
) {
  if (typeof options === 'object') {
    return spawner.promise(options, 'git', ...args);
  } else {
    const deployDir = resolve(join(process.cwd(), '.deploy_git'));
    return spawner.promise(
      {
        cwd: deployDir,
        stdio: 'inherit'
      },
      'git',
      options,
      ...args
    );
  }
}

type GetLatestCommitHashOptions = Partial<SpawnOptions> & {
  short: boolean;
};

/**
 * get latest commit hash
 * * git log --pretty=tformat:%H -n 1 path
 * * git log --pretty=tformat:%h -n 1 path
 * * git rev-parse HEAD
 * * git rev-parse --short HEAD
 * @param path specific folder
 * @returns
 */
export const getLatestCommitHash = async (
  path?: string,
  options: Partial<GetLatestCommitHashOptions> = {}
) => {
  const default_options: GetLatestCommitHashOptions = {
    short: true,
    cwd: process.cwd()
  };
  options = deepmerge(default_options, options);
  const short = options.short;
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
  const res = await git(options, ...args);
  return res.stdout[0] as string;
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

/**
 * extract submodule to object
 * @param path
 */
export function extractSubmodule(path: fs.PathOrFileDescriptor) {
  const config = ini.parse(fs.readFileSync(path).toString());
  Object.keys(config).forEach((key) => {
    if (key.startsWith('submodule')) {
      const submodule = config[key];
      console.log(submodule);
    }
  });
}
