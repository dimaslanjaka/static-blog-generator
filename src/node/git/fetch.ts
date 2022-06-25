import nodegit from 'nodegit';
import path from 'path';

/**
 * git fetch
 * @param gitDir path location to `.git` folder
 * @example
 * gitFetch(path.resolve(process.cwd(), '.git'))
 */
export default async function gitFetch(
  gitDir = path.resolve(process.cwd(), '.git')
) {
  const repo = await nodegit.Repository.open(gitDir);
  await repo.fetch('origin', {
    callbacks: {
      credentials: function (_url_1: any, userName: any) {
        //console.log(url, userName);
        return nodegit.Cred.sshKeyFromAgent(userName);
      }
    }
  });
}
