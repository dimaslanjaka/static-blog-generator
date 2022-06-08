import { rm } from 'fs';
import gulp from 'gulp';
import { cwd } from 'process';
import { TaskCallback } from 'undertaker';
import { join } from 'upath';
import { HexoDBPath } from '../../db/hexo';
import { dbFolder } from '../../node/cache';
import config, {
  post_generated_dir,
  post_public_dir,
  tmp
} from '../../types/_config';

/** clean generated folder */
export const clean_public = (done?: TaskCallback) =>
  rm(post_generated_dir, { recursive: true, force: true }, () => done());
/** clean posts from config.source_dir */
export const clean_posts = (done?: TaskCallback) => {
  rm(post_public_dir, { recursive: true, force: true }, () => {
    if ('generator' in config && config['generator']['type'] === 'hexo') {
      rm(HexoDBPath, () => done());
    } else {
      done();
    }
  });
};
/** clean temp folder */
export const clean_tmp = (done?: TaskCallback) => {
  rm(tmp(), { recursive: true, force: true }, () => {
    rm(join(cwd(), 'tmp'), { recursive: true, force: true }, () => {
      done();
    });
  });
};
/** clean database folder */
export const clean_db = (done?: TaskCallback) =>
  rm(dbFolder, { recursive: true, force: true }, () => done());

// [task] CLEAN
gulp.task('clean:public', clean_public);
gulp.task('clean:posts', clean_posts);
gulp.task('clean:db', clean_db);
gulp.task('clean:tmp', clean_tmp);
gulp.task(
  'clean',
  gulp.parallel('clean:db', 'clean:tmp', 'clean:posts', 'clean:public')
);
