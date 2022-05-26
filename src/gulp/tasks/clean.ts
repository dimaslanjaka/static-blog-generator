import { rm } from 'fs';
import * as fse from 'fs-extra';
import { cwd } from 'process';
import { TaskCallback } from 'undertaker';
import { join } from 'upath';
import { dbFolder } from '../../node/cache';
import config, { root, tmp } from '../../types/_config';

/** clean generated folder */
export const clean_public = () => fse.emptyDir(join(root, config.public_dir));
/** clean posts from config.source_dir */
export const clean_posts = () =>
  fse.emptyDir(join(root, config.source_dir, '_posts'));
/** clean temp folder */
export const clean_tmp = () =>
  fse.emptyDir(tmp()).then(() => fse.emptyDir(join(cwd(), 'tmp')));
/** clean database folder */
export const clean_db = (done?: TaskCallback) =>
  rm(dbFolder, { recursive: true }, done);
