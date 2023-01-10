import ansiColors from 'ansi-colors';
import Bluebird from 'bluebird';
import { existsSync, readdir } from 'fs-extra';
import gulp from 'gulp';
import { getConfig } from 'sbg-utility/src/config/_config';
import { del, writefile } from 'sbg-utility/src/utils/fm';
import Logger from 'sbg-utility/src/utils/logger';
import { join } from 'upath';

/**
 * clean old archives (categories, tags, pagination) from deployment directory
 */
export default async function cleanArchive(callback?: gulp.TaskFunctionCallback | (() => any)) {
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
  writefile(dumpfile, folders.join('\n'));
  Logger.log(logname, 'list deleted files', dumpfile);

  for (let i = 0; i < folders.length; i++) {
    const pathStr = folders[i];
    try {
      if (existsSync(pathStr)) promises.push(del(pathStr));
    } catch {
      //s
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

gulp.task('clean:archive', cleanArchive);
