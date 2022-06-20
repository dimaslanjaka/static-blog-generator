import * as fs from 'fs';
import * as path from 'upath';
import spawner from '../../../node/spawner';

/**
 * process before push
 * @param cwd current working directory
 */
export async function beforeDeploy(cwd: string) {
  const pkg = path.join(cwd, 'package.json');
  if (fs.existsSync(pkg)) {
    return await spawner.promise(
      {
        cwd
      },
      'npm',
      'install',
      '--production',
      '--omit=dev'
    );
  }
}
