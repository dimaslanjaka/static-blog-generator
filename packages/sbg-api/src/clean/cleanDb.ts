import fs from 'fs-extra';
import { debug, del, getConfig, writefile } from 'sbg-utility';
import path from 'upath';
import { inspect } from 'util';
import { NodeCallback } from '../gulp-options';

/**
 * Clean Project Databases
 */
export async function cleanDb(callback?: NodeCallback, files?: string[]) {
  const log = debug('clean');
  const config = getConfig();
  if (typeof config.source_dir !== 'string') {
    writefile(path.join(config.cwd, 'tmp/errors/clean.log'), inspect(config));
    throw new Error('config.source_dir must be configured');
  }

  // const publicDir = join(config.cwd, config.public_dir);

  let dirs = [
    path.join(config.cwd, config.source_dir, '_posts'),
    path.join(config.cwd, 'tmp/cache'),
    path.join(config.cwd, 'tmp/dump'),
    path.join(config.cwd, 'tmp/logs'),
    path.join(config.cwd, 'db.json')
  ];
  if (Array.isArray(files)) dirs = dirs.concat(files);
  for (let i = 0; i < dirs.length; i++) {
    const dir = dirs[i];
    try {
      if (fs.existsSync(dir)) {
        log('cleaning', dir);
        await del(dir);
      }
    } catch {
      log('cannot delete', dir);
    }
  }

  /*const hexo = new hexoLib(config.cwd);
  await hexo.init().catch(noop);
  await hexo.call('clean').catch(noop);*/

  if (typeof callback === 'function') return callback();

  return undefined;
}
