import ansiColors from 'ansi-colors';
import Bluebird from 'bluebird';
import { existsSync, readdir } from 'fs-extra';
import gulp from 'gulp';
import { EOL } from 'os';
import { join } from 'upath';
import { inspect } from 'util';
import debug from '../utils/debug';
import { del, writefile } from '../utils/fm';
import Logger from '../utils/logger';
import noop from '../utils/noop';
import { getConfig } from '../_config';

/**
 * Clean Project Databases
 */
export async function cleanDb(callback?: gulp.TaskFunctionCallback | (() => any), files?: string[]) {
  const log = debug('clean');
  const config = getConfig();
  if (typeof config.source_dir !== 'string') {
    writefile(join(config.cwd, 'tmp/errors/clean.log'), inspect(config));
    throw new Error('config.source_dir must be configured');
  }

  // const publicDir = join(config.cwd, config.public_dir);

  let dirs = [
    join(config.cwd, config.source_dir, '_posts'),
    join(config.cwd, 'tmp/cache'),
    join(config.cwd, 'tmp/dump'),
    join(config.cwd, 'tmp/logs'),
    join(config.cwd, 'db.json')
  ];
  if (Array.isArray(files)) dirs = dirs.concat(files);
  for (let i = 0; i < dirs.length; i++) {
    const dir = dirs[i];
    try {
      if (existsSync(dir)) {
        log('claning', dir);
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

/**
 * clean old archives (categories, tags, pagination) from deployment directory
 */
export async function cleanOldArchives(callback?: gulp.TaskFunctionCallback | (() => any)) {
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

  const promises: Promise<any>[] = [];

  // dump to file
  const dumpfile = join(process.cwd(), 'tmp/dump/clean.txt');
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
    if (typeof callback === 'function') callback();
    return undefined;
  };

  await Bluebird.all(promises).then(finishNow).catch(finishNow);
}

export async function cleanGeneratedPosts(callback?: gulp.TaskFunctionCallback | (() => any)) {
  const config = getConfig();
  return cleanDb(callback, [join(config.cwd, config.source_dir, '_posts')]);
}

gulp.task('clean:archive', cleanOldArchives);
gulp.task('clean:db', cleanDb);
gulp.task('clean:post', cleanGeneratedPosts);
gulp.task('clean:all', gulp.series('clean:db', 'clean:archive'));
