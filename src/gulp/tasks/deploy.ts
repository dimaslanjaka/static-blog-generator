import gulp from 'gulp';
import config from '../../types/_config';
import './deploy/firebase';
import { deployerGit } from './deploy/git';

gulp.task('deploy-git', deployerGit);
if (
  'deploy' in config &&
  typeof config.deploy == 'object' &&
  'type' in config.deploy
) {
  gulp.task('deploy', gulp.series('deploy-' + config['deploy']['type']));
}
