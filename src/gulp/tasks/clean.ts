import { rm } from 'fs';
import { cwd } from 'process';
import { TaskCallback } from 'undertaker';
import { join } from 'upath';
import { dbFolder } from '../../node/cache';
import { post_generated_dir, post_public_dir, tmp } from '../../types/_config';

/** clean generated folder */
export const clean_public = (done?: TaskCallback) =>
  rm(post_generated_dir, { recursive: true }, () => done());
/** clean posts from config.source_dir */
export const clean_posts = (done?: TaskCallback) =>
  rm(post_public_dir, { recursive: true }, () => done());
/** clean temp folder */
export const clean_tmp = (done?: TaskCallback) => {
  rm(tmp(), { recursive: true }, () => {
    rm(join(cwd(), 'tmp'), { recursive: true }, () => {
      done();
    });
  });
};
/** clean database folder */
export const clean_db = (done?: TaskCallback) =>
  rm(dbFolder, { recursive: true }, () => done());
