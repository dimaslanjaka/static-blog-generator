import nodegit from 'nodegit';
import path from 'path';

/**
 * git fetch
 * @param gitDir path location to `.git` folder
 * @param all git fetch --all
 * @example
 * gitFetch(path.resolve(process.cwd(), '.git'))
 */
export default async function gitFetch(
  gitDir = path.resolve(process.cwd(), '.git'),
  all = false
) {
  const repo = await nodegit.Repository.open(gitDir);

  if (all) {
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
  } else {
    await repo.fetch('origin', {
      callbacks: {
        credentials: function (_url_1: any, userName: string) {
          //console.log(url, userName);
          return nodegit.Cred.sshKeyFromAgent(userName);
        }
      }
    });
  }
}
