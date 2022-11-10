import Bluebird from 'bluebird';
import { existsSync, readdir, rm } from 'fs-extra';
import gulp from 'gulp';
import hexoLib from 'hexo';
import { join } from 'upath';
import ProjectConfig from './gulp.config';
import noop from './utils/noop';

/**
 * Clean Project Databases
 */
export async function cleanDb() {
  const config = ProjectConfig;
  const post = join(process.cwd(), config.source_dir, '_posts');
  const publicDir = join(process.cwd(), config.public_dir);
  const tmpDir = join(process.cwd(), 'tmp');
  if (existsSync(tmpDir)) await del(tmpDir).catch(noop);
  if (existsSync(post)) await del(post).catch(noop);
  if (existsSync(publicDir)) await del(publicDir).catch(noop);
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
      resolve(new Error(path + ' not found'));
    }
  });
}

gulp.task('clean', cleanDb);
