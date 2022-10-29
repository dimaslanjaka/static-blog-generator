import { existsSync, rm } from 'fs';
import gulp from 'gulp';
import hexoLib from 'hexo';
import { join } from 'path';
import ProjectConfig from './gulp.config';

/**
 * Clean Project Databases
 */
export async function cleanDb() {
  const config = ProjectConfig;
  const post = join(process.cwd(), config.source_dir, '_posts');
  const publicDir = join(process.cwd(), config.public_dir);
  const tmpDir = join(process.cwd(), 'tmp');
  if (existsSync(tmpDir)) await del(tmpDir);
  if (existsSync(post)) await del(post);
  if (existsSync(publicDir)) await del(publicDir);
  const hexo = new hexoLib(process.cwd());
  await hexo.init();
  await hexo.call('clean');
}

function del(path: string) {
  return new Promise((resolve) => {
    if (existsSync(path)) {
      rm(path, { recursive: true }, function (err) {
        resolve(err);
      });
    }
    resolve(new Error(path + ' not found'));
  });
}

gulp.task('clean', cleanDb);
