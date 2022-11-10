import Bluebird from 'bluebird';
import { existsSync, readdir, rm, statSync } from 'fs-extra';
import gulp from 'gulp';
import hexoLib from 'hexo';
import { TaskCallback } from 'undertaker';
import { join } from 'upath';
import ProjectConfig, { deployConfig } from './gulp.config';
import noop from './utils/noop';

/**
 * Clean Project Databases
 */
export async function cleanDb() {
  const config = ProjectConfig;
  const post = join(process.cwd(), config.source_dir, '_posts');
  const publicDir = join(process.cwd(), config.public_dir);
  const tmpDir = join(process.cwd(), 'tmp');

  try {
    if (existsSync(tmpDir)) await del(tmpDir).catch(noop);
  } catch {
    //
  }
  try {
    if (existsSync(publicDir)) await del(publicDir).catch(noop);
  } catch {
    //
  }
  try {
    if (existsSync(post)) await del(post).catch(noop);
  } catch {
    //
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
  return new Promise((resolve) => {
    if (existsSync(path)) {
      if (statSync(path).isDirectory()) {
        readdir(path, function (err, files) {
          if (!err) {
            Bluebird.all(files)
              .map((file) => join(path, file))
              .map((file) => {
                rm(file, { recursive: true });
              })
              .then(() => {
                rm(path, { recursive: true }).then(resolve).catch(noop);
              });
          } else {
            rm(path, { recursive: true }).then(resolve).catch(noop);
          }
        });
      } else {
        rm(path, { recursive: true }).then(resolve).catch(noop);
      }
    } else {
      resolve(new Error(path + ' not found'));
    }
  });
}

gulp.task('clean', cleanDb);

/**
 * clean old archives (categories, tags, pagination)
 */
export function cleanOldArchives(done?: TaskCallback) {
  // const publicDir = join(process.cwd(), ProjectConfig.public_dir);
  const { deployDir } = deployConfig();
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

  return Bluebird.all(promises).then(function () {
    if (typeof done === 'function') done();
  });
}

gulp.task('clean-archives', cleanOldArchives);
