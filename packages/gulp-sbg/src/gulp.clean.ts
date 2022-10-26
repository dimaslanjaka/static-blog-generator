import { existsSync, rm } from 'fs';
import gulp from 'gulp';
import hexoLib from 'hexo';
import { join } from 'path';
import ProjectConfig from './gulp.config';
import noop from './utils/noop';

export function cleanDb() {
  return new Promise((resolve) => {
    const config = ProjectConfig;
    const post = join(process.cwd(), config.source_dir, '_posts');
    const publicDir = join(process.cwd(), config.public_dir);
    const tmpDir = join(process.cwd(), 'tmp');
    if (existsSync(tmpDir)) rm(tmpDir, { recursive: true }, noop);
    if (existsSync(post)) rm(post, { recursive: true }, noop);
    if (existsSync(publicDir)) rm(publicDir, { recursive: true }, noop);
    const hexo = new hexoLib(process.cwd());
    hexo.init().then(() => {
      hexo.call('clean').then(() => {
        resolve(null);
      });
    });
  });
}

gulp.task('clean', cleanDb);
