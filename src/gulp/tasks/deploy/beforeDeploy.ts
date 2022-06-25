import * as fs from 'fs';
import * as upath from 'upath';
import color from '../../../node/color';
import { extractSubmodule, getLatestCommitHash } from '../../../node/git';
import spawner from '../../../node/spawner';
import { modMoment } from '../../../renderer/helpers/date';

const logname = color['Burnt Sienna']('[deploy][before-push]');

/**
 * process before push
 * @param cwd current working directory
 */
export async function beforeDeploy(cwd: string) {
  const pkg = upath.join(cwd, 'package.json');
  if (fs.existsSync(pkg)) {
    console.log(logname, 'package.json found, installing...');
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

  const submoduleFile = upath.join(cwd, '.gitmodules');
  console.log(logname, submoduleFile, ' found ', fs.existsSync(submoduleFile));
  if (fs.existsSync(submoduleFile)) {
    const submodule = extractSubmodule(submoduleFile);
    if (submodule) {
      for (let i = 0; i < submodule.data.length; i++) {
        const sm = submodule.data[i];
        if (fs.existsSync(sm.fullpath)) {
          console.log(logname, 'adding submodule files...');
          await spawner.promise(
            {
              cwd: sm.fullpath
            },
            'git',
            'add',
            '-A'
          );
          console.log(logname, 'comiting submodule...');
          let msg = 'Update site';
          if (fs.existsSync(upath.join(process.cwd(), '.git'))) {
            msg += ' ' + (await getLatestCommitHash());
          }
          msg += '\ndate: ' + modMoment().format();
          await spawner.promise(
            {
              cwd: sm.fullpath
            },
            'git',
            'commit',
            '-m',
            msg
          );
          console.log(logname, 'pushing submodule...');
          await spawner.promise(
            {
              cwd: sm.fullpath
            },
            'git',
            'push'
          );
        }
      }
    }
  }
}
