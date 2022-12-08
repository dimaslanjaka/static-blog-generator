import Bluebird from 'bluebird';
import { existsSync, rm, RmOptions } from 'fs-extra';
import gulp from 'gulp';
import hexoLib from 'hexo';
import { join } from 'upath';
import ProjectConfig, { deployDir } from './gulp.config';
import noop from './utils/noop';

/**
 * Clean Project Databases
 */
export async function cleanDb() {
  const config = ProjectConfig;
  const postDir = join(process.cwd(), config.source_dir, '_posts');
  const publicDir = join(process.cwd(), config.public_dir);
  const tmpDir = join(process.cwd(), 'tmp');

  console.log({ tmpDir, postDir, publicDir });

  try {
    if (existsSync(tmpDir)) await del(tmpDir);
  } catch {
    console.log('[clean]', 'cannot delete', tmpDir);
  }
  try {
    if (existsSync(publicDir)) await del(publicDir);
  } catch {
    console.log('[clean]', 'cannot delete', publicDir);
  }
  try {
    if (existsSync(postDir)) await del(postDir);
  } catch {
    console.log('[clean]', 'cannot delete', postDir);
  }

  const hexo = new hexoLib(process.cwd());
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
  const archives = join(deployDir, ProjectConfig.archive_dir);
  const categories = join(deployDir, ProjectConfig.category_dir);
  const tags = join(deployDir, ProjectConfig.tag_dir);
  const folders = [archives, tags, categories]
    .concat(ProjectConfig.language.map((str) => join(deployDir, str)))
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
