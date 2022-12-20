import Bluebird from 'bluebird';
import { existsSync, rm, RmOptions } from 'fs-extra';
import gulp from 'gulp';
import hexoLib from 'hexo';
import { join } from 'upath';
import { inspect } from 'util';
import { deployDir, getConfig } from './gulp.config';
import { writefile } from './utils/fm';
import Logger from './utils/logger';
import noop from './utils/noop';

/**
 * Clean Project Databases
 */
export async function cleanDb() {
  const config = getConfig();
  if (typeof config.source_dir !== 'string') {
    writefile(join(config.cwd, 'tmp/errors/clean.log'), inspect(config));
    throw new Error('config.source_dir must be configured');
  }

  const postDir = join(config.cwd, config.source_dir, '_posts');
  const publicDir = join(config.cwd, config.public_dir);
  const tmpDir = join(config.cwd, 'tmp');

  Logger.log('[clean]', { tmpDir, postDir, publicDir });

  try {
    if (existsSync(tmpDir)) await del(tmpDir);
  } catch {
    Logger.log('[clean]', 'cannot delete', tmpDir);
  }
  try {
    if (existsSync(publicDir)) await del(publicDir);
  } catch {
    Logger.log('[clean]', 'cannot delete', publicDir);
  }
  try {
    if (existsSync(postDir)) await del(postDir);
  } catch {
    Logger.log('[clean]', 'cannot delete', postDir);
  }

  const hexo = new hexoLib(config.base_dir);
  await hexo.init().catch(noop);
  await hexo.call('clean').catch(noop);
}

/**
 * delete folder async for gulp
 * @param path
 * @returns
 */
export function del(path: string) {
  return new Bluebird((resolve) => {
    const rmOpt: RmOptions = { recursive: true, force: true };
    if (existsSync(path)) {
      rm(path, rmOpt).then(resolve).catch(resolve);
      /*if (statSync(path).isDirectory()) {
        rmdir(path, { maxRetries: 10 }).then(resolve).catch(resolve);
      } else {
        rm(path, rmOpt).then(resolve).catch(resolve);
      }*/
    } else {
      resolve(new Error(path + ' not found'));
    }
  });
}

gulp.task('clean', cleanDb);

/**
 * clean old archives (categories, tags, pagination)
 */
export function cleanOldArchives(done?: gulp.TaskFunctionCallback) {
  const config = getConfig();
  const archives = join(deployDir, config.archive_dir);
  const categories = join(deployDir, config.category_dir);
  const tags = join(deployDir, config.tag_dir);
  const folders = [archives, tags, categories]
    .concat(config.language.map((str) => join(deployDir, str)))
    .filter((str) => existsSync(str));

  const promises: Promise<any>[] = [];

  for (let i = 0; i < folders.length; i++) {
    const pathStr = folders[i];
    try {
      if (existsSync(pathStr)) promises.push(del(pathStr).catch(noop));
    } catch {
      //
    }
  }

  const finishNow = function () {
    if (typeof done === 'function') done();
  };
  return Bluebird.all(promises).then(finishNow).catch(finishNow);
}

gulp.task('clean-archives', cleanOldArchives);

gulp.task('clean-all', gulp.series('clean', 'clean-archives'));
