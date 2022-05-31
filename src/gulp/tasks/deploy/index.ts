import gulp from 'gulp';
import config from '../../../types/_config';
import './firebase';
import { deployerGit } from './git';

gulp.task('deploy-git', deployerGit);
if (
  'deploy' in config &&
  typeof config.deploy == 'object' &&
  'type' in config.deploy
) {
  gulp.task('deploy', gulp.series('deploy-' + config['deploy']['type']));
}
