import ansiColors from 'ansi-colors';
import Bluebird from 'bluebird';
import { existsSync, readdir, rm, RmOptions } from 'fs-extra';
import gulp from 'gulp';
import hexoLib from 'hexo';
import { EOL } from 'os';
import { join } from 'upath';
import { inspect } from 'util';
import { getConfig } from './gulp.config';
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

  return undefined;
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
 * clean old archives (categories, tags, pagination) from deployment directory
 */
export async function cleanOldArchives(done?: gulp.TaskFunctionCallback) {
  const config = getConfig();
  const logname = 'clean:' + ansiColors.grey('archives');

  // clean archives, tags, categories
  const archives = join(config.deploy.deployDir, config.archive_dir);
  const categories = join(config.deploy.deployDir, config.category_dir);
  const tags = join(config.deploy.deployDir, config.tag_dir);
  const folders = [archives, tags, categories].filter((str) => existsSync(str));

  // push language folder to be deleted from deploy dir
  if (Array.isArray(config.language)) {
    const langDir = config.language.map((path) => join(config.deploy.deployDir, path));
    folders.push(...langDir);
  } else if (typeof config.language === 'string' && String(config.language).trim().length > 0) {
    folders.push(join(config.deploy.deployDir, String(config.language)));
  }

  // delete pagination
  const pagesDir = join(config.deploy.deployDir, 'page');
  if (existsSync(pagesDir)) {
    const pages = (await readdir(pagesDir)).filter((str) => /^\d+$/.test(str)).map((str) => join(pagesDir, str));
    folders.push(...pages);
  }

  const hexo = new hexoLib(config.base_dir);
  await hexo.init().catch(noop);
  await hexo.load().catch(noop);
  const count = hexo.locals.get('posts').count();
  console.log(count);

  const promises: Promise<any>[] = [];

  // dump to file
  const dumpfile = join(process.cwd(), 'tmp/clean/dump.txt');
  writefile(dumpfile, folders.join(EOL));
  Logger.log(logname, 'list deleted files', dumpfile);

  for (let i = 0; i < folders.length; i++) {
    const pathStr = folders[i];
    try {
      if (existsSync(pathStr)) promises.push(del(pathStr).catch(noop));
    } catch {
      //
    }
  }

  const finishNow = function (e: any) {
    if (e instanceof Error) {
      console.log('clean archives has some erros');
    }
    if (typeof done === 'function') done();
    return undefined;
  };

  await Bluebird.all(promises).then(finishNow).catch(finishNow);
}

gulp.task('clean-archives', cleanOldArchives);
gulp.task('clean-archive', cleanOldArchives);
gulp.task('clean-all', gulp.series('clean', 'clean-archives'));
