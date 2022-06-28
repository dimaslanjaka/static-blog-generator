import Bluebird from 'bluebird';
import path from 'path';
import { modMoment } from '../../renderer/helpers/date';
import spawner from '../spawner';

export default async function gitAddCommit(
  gitDir = path.resolve(process.cwd(), '.git'),
  filePath: string,
  messages: string
) {
  const add = await spawner.promise(
    { cwd: gitDir },
    'git',
    'add',
    filePath ? filePath : '-A'
  );
  const commit = await spawner.promise(
    { cwd: gitDir },
    'git',
    'commit',
    typeof messages === 'string' ? messages : 'update ' + modMoment()
  );
  return Bluebird.all([add, commit]);
}
