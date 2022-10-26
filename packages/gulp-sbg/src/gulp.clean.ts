import { existsSync, rmdirSync } from 'fs';
import gulp from 'gulp';
import hexoLib from 'hexo';
import { join } from 'path';
import ProjectConfig from './gulp.config';

export function cleanDb() {
  return new Promise((resolve) => {
    const config = ProjectConfig;
    const post = join(process.cwd(), config.source_dir, '_posts');
    const publicDir = join(process.cwd(), config.public_dir);
    const tmpDir = join(process.cwd(), 'tmp');
    if (existsSync(tmpDir)) rmdirSync(tmpDir, { recursive: true });
    if (existsSync(post)) rmdirSync(post, { recursive: true });
    if (existsSync(publicDir)) rmdirSync(publicDir, { recursive: true });
    const hexo = new hexoLib(process.cwd());
    hexo.init().then(() => {
      hexo.call('clean').then(() => {
        resolve(null);
      });
    });
  });
}

gulp.task('clean', cleanDb);
