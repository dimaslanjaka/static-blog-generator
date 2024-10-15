import ansiColors from 'ansi-colors';
import Bluebird from 'bluebird';
import fs from 'fs-extra';
import gulp from 'gulp';
import { del, getConfig, Logger, writefile } from 'sbg-utility';
import path from 'upath';

/**
 * clean old archives (categories, tags, pagination) from deployment directory
 */
export default async function cleanArchive(callback?: gulp.TaskFunctionCallback | (() => any)) {
  const config = getConfig();
  const logname = 'clean:' + ansiColors.grey('archives');

  // clean archives, tags, categories
  const archives = path.join(config.deploy.deployDir, config.archive_dir);
  const categories = path.join(config.deploy.deployDir, config.category_dir);
  const tags = path.join(config.deploy.deployDir, config.tag_dir);
  const folders = [archives, tags, categories].filter((str) => fs.existsSync(str));

  // push language folder to be deleted from deploy dir
  if (Array.isArray(config.language)) {
    const langDir = config.language.map((path) => path.join(config.deploy.deployDir, path));
    folders.push(...langDir);
  } else if (typeof config.language === 'string' && String(config.language).trim().length > 0) {
    folders.push(path.join(config.deploy.deployDir, String(config.language)));
  }

  // delete pagination
  const pagesDir = path.join(config.deploy.deployDir, 'page');
  if (fs.existsSync(pagesDir)) {
    const pages = (await fs.readdir(pagesDir))
      .filter((str) => /^\d+$/.test(str))
      .map((str) => path.join(pagesDir, str));
    folders.push(...pages);
  }

  const promises: Promise<any>[] = [];

  // dump to file
  const dumpfile = path.join(config.cwd, 'tmp/dump/clean.txt');
  writefile(dumpfile, folders.join('\n'));
  Logger.log(logname, 'list deleted files', dumpfile);

  for (let i = 0; i < folders.length; i++) {
    const pathStr = folders[i];
    try {
      if (fs.existsSync(pathStr)) promises.push(del(pathStr));
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
