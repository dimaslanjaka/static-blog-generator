import nodegit from 'nodegit';
import path from 'path';

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
  await repo.fetchAll({
    callbacks: {
      credentials: function (_url: any, userName: string) {
        return nodegit.Cred.sshKeyFromAgent(userName);
      },
      certificateCheck: function () {
        return 0;
      }
    }
  });
  await repo.mergeBranches(branch, 'origin/' + branch);
}
