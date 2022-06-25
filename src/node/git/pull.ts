import nodegit from 'nodegit';
import path from 'path';
import gitFetch from './fetch';

/**
 * git pull
 * @param gitDir path location to `.git` folder
 * @param branch branch default `master`
 * @example
 * gitPull(path.resolve(process.cwd(), '.git'), 'main');
 */
export default async function gitPull(
  gitDir = path.resolve(process.cwd(), '.git'),
  branch = 'master'
) {
  const repo = await nodegit.Repository.open(gitDir);
  await gitFetch(gitDir, true);
  await repo.mergeBranches(branch, 'origin/' + branch);
}
