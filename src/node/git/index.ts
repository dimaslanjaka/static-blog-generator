import Bluebird from 'bluebird';
import { SpawnOptions } from 'child_process';
import { deepmerge } from 'deepmerge-ts';
import { existsSync, readFileSync } from 'fs';
import ini from 'ini';
import { dirname, join } from 'upath';
import { deployDir } from '../../types/_config';
import spawner from '../spawner';

/**
 * git command
 * @param optionsOrCmd git argument or spawn options
 * @param args git variadic arguments
 * @returns
 * @example
 * await git('add', '-A');
 * await git('commit', '-m', 'commit messages');
 * await git('push');
 * // async the result
 * git({stdio:'pipe'}, 'submodule', 'status').then(console.log);
 */
export function git(
  optionsOrCmd: null | string | SpawnOptions = null,
  ...args: string[]
) {
  if (deployDir === null)
    throw new Error(
      'Deploy Dir is Null, please set deploy options https://github.com/dimaslanjaka/static-blog-generator/blob/master/readme-options.md#deployment'
    );

  if (optionsOrCmd !== null) {
    if (typeof optionsOrCmd === 'object') {
      return spawner.promise(optionsOrCmd, 'git', ...args);
    } else if (typeof optionsOrCmd === 'string') {
      return spawner.promise(
        {
          cwd: deployDir,
          stdio: 'inherit'
        },
        'git',
        optionsOrCmd,
        ...args
      );
    }
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
 * check if git has submodule
 * @param gitDir git directory
 * @returns
 */
export function isGitHasSubmodule(gitDir: string) {
  return new Bluebird((resolve: (a: boolean) => any) => {
    git(
      { stdio: 'pipe', cwd: gitDir },
      'submodule',
      'status',
      '--recursive'
    ).then((o) => {
      if ('stdout' in o) {
        if (Array.isArray(o.stdout) && o.stdout.length > 0) {
          return resolve(true);
        }
      }
      return resolve(false);
    });
  });
}

/**
 * git describe
 * @returns
 */
export const gitDescribe = async () => {
  const res = await git(
    {
      cwd: process.cwd() //join(__dirname, '../../')
    },
    'describe',
    '--tags'
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

export interface SubmoduleObject {
  [key: string]: any;
  path: string;
  url: string;
  branch?: string;
  fullpath?: string;
}

export interface SubmoduleResult {
  [key: string]: any;
  hasSubmodule: boolean;
  data: SubmoduleObject[];
}

/**
 * extract submodule to object
 * @param path path to .gitmodules or git directory
 */
export function extractSubmodule(path: string): SubmoduleResult {
  // fix when path is git directory
  if (!path.endsWith('.gitmodules') && !path.endsWith('.ini')) {
    path = join(path, '.gitmodules');
  }
  if (!existsSync(path)) return null;
  const config = ini.parse(readFileSync(path).toString());
  const result: SubmoduleObject[] = [];
  Object.keys(config).forEach((key) => {
    if (key.startsWith('submodule')) {
      const submodule: SubmoduleObject = config[key];
      submodule.fullpath = join(dirname(path), submodule.path);
      //console.log(key, submodule);
      result.push(submodule);
    }
  });
  return {
    hasSubmodule: existsSync(path),
    data: result
  };
}
